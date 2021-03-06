import React, { useEffect, useState } from 'react';

import { firestore } from '../../../firebase/utils';
import {collection, query, doc, onSnapshot, where, increment} from "firebase/firestore"

import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import EmojiFlagsIcon from '@material-ui/icons/EmojiFlags';

import moment from 'moment'
import 'moment/locale/vi';
import { useSelector } from 'react-redux';
import AlertModal from '../../AlertModal';
import Button from "../../Forms/Button"
import ShowMoreButton from '../../Forms/ShowMoreButton';
import { Link } from 'react-router-dom';
import { deleteField } from "firebase/firestore";
import Image from "../../../assets/16526305592141308214.png"

import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import FormTextArea from '../../Forms/FormTextArea';
import AdOnTop from '../../DisplayAd/AdOnTop';

const mapState = state => ({
    currentUser: state.user.currentUser,
})

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        marginBottom: "10px",
        margin: "auto",
        textAlign: "center",
        justifyContent: "center",
    },
    formControl: {
        
    },
    formLabel: {
        color: "white",
    },
    formGroup: {
        
    },
    formControlLabel: {
        fontSize: "25px!important"
    },
}));

function Main({id, urls, title, views, desc, date, tags, imageAdminUID, abilityShowMore, abilityAdsBlock}) {
    const { currentUser } = useSelector(mapState);
    const [like, setLike] = useState(false)
    const [likeArray, setLikeArray] = useState([])
    const [allInfo, setAllInfo] = useState([])
    const [save, setSave] = useState(false)
    const [hideModal, setHideModal] = useState(true)
    const [showAllImage, setShowAllImage] = useState(false)
    const [reportDesc, setReportDesc] = useState("")
    const classes = useStyles();
    const [state, setState] = React.useState({
        spam: true,
        "N???i dung ho???c b??nh lu???n c?? ?? x??c ph???m": false,
        "Kh??ng li??n quan": false,
    });

    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
      };
    
    const { spam, mean, notRelate } = state;

    const handleFilter = (obj) => {
        var keys = Object.keys(obj);

        var filtered = keys.filter(function(key) {
            return obj[key]
        });

        return(filtered)
    }


    const toggleModal = () => setHideModal(!hideModal);

    const configModal = {
        hideModal,
        toggleModal
    }
    
    useEffect(() => {
        // if (id && likeArray.length == 0) {
        //     firestore.collection("videos").doc(id).onSnapshot((snapshot) => {
        //         setLikeArray([{
        //             likes: snapshot.data().likes
        //         }])
        //     }) 
        // }
        if (id && allInfo.length == 0) {
            const q = query(collection(firestore, "contentStatus"), where("contentId", "==", id));
            onSnapshot(q, (snapshot) => {
                try {
                    setAllInfo(snapshot.docs.map(doc => ({
                        infoId: doc.id, 
                        contentId: doc.data().contentId, 
                        userId: doc.data().userId, 
                        liked: doc.data().liked,
                        saved: doc.data().saved,
                        reported: doc.data().reported
                    })))
                } catch (error) {
                    
                }
            }) 
        }
    }, [])

    useEffect(() => {
        setShowAllImage(false)
    }, [id])

    useEffect(() => {
        if (id && allInfo.length > 0) {
            checkLike()
            checkSave()
        }
    }, [currentUser])

    useEffect(() => {
        checkLike()
        checkSave()
    }, [allInfo])

    const checkLike = () => {
        if(currentUser){
            // Put the id of currentUser into the follow array
            // const someArray = likeArray[0].likes
            // const found = someArray.find(element => element == currentUser.id);
            const someArray = allInfo
            const foundUser = someArray.find(element => element.userId == currentUser.id);

            if(!foundUser){
                setLike(false)
            }

            if(foundUser){
                const foundLiked = foundUser.liked
                if(foundLiked == "true")
                setLike(true)
                if(foundLiked == "false")
                setLike(false)
            }
        }
        const result = allInfo.filter(info => info.liked == "true");
        setLikeArray(result)
    }

    const handleLike = () => {
        if(!currentUser) {
            alert("Kh??ng th??? th???c hi???n th??ch n???i dung, xin vui l??ng ????ng nh???p...")
        }
        if(currentUser){
            var time = new Date()
            // Put the id of currentUser into the follow array
            // const someArray = likeArray[0].likes
            // const found = someArray.find(element => element == currentUser.id);
            
            const someArray = allInfo
            const found = someArray.find(element => element.userId == currentUser.id);
            
            // if(!found){
            //     someArray.push(currentUser.id)
                
            //     firestore.collection('videos').doc(id).set({
            //         likes: someArray
            //     }, { merge: true })
            // }

            if(!found){
                firestore.collection('contentStatus').add({
                    contentId: id, 
                    userId: currentUser.id, 
                    liked: "true",
                    saved: "false",
                    reported: "false",
                    likedDate: time,
                }).then(
                    firestore.collection('users').doc(imageAdminUID).set({
                        point: increment(10),
                    }, { merge: true })
                )
            }

            // if(found){
            //     const index = someArray.indexOf(currentUser.id);
            //     if (index > -1) {
            //         someArray.splice(index, 1); // 2nd parameter means remove one item only
            //     }
                
            //     firestore.collection('videos').doc(id).set({
            //         likes: someArray
            //     }, { merge: true })
            // }

            if(found){
                const foundLiked = found.liked
                if (foundLiked == "false")
                firestore.collection('contentStatus').doc(found.infoId).set({
                    liked: "true",
                    likedDate: time,
                }, { merge: true }).then(
                    firestore.collection('users').doc(imageAdminUID).set({
                        point: increment(10),
                    }, { merge: true })
                )
                
                if (foundLiked == "true")
                firestore.collection('contentStatus').doc(found.infoId).set({
                    liked: "false",
                    likedDate: deleteField(),
                }, { merge: true }).then(
                    firestore.collection('users').doc(imageAdminUID).set({
                        point: increment(-10),
                    }, { merge: true })
                )
            }
        }
    }

    const checkSave = () => {
        if(currentUser){
            // Put the id of currentUser into the follow array
            // const someArray = likeArray[0].likes
            // const found = someArray.find(element => element == currentUser.id);
            const someArray = allInfo
            const foundUser = someArray.find(element => element.userId == currentUser.id);

            if(!foundUser){
                setSave(false)
            }

            if(foundUser){
                const foundSaved = foundUser.saved
                if(foundSaved == "true")
                setSave(true)
                if(foundSaved == "false")
                setSave(false)
            }
        }
    }


    const handleSave = () => {
        if(!currentUser) {
            alert("Kh??ng th??? th???c hi???n l??u n???i dung, xin vui l??ng ????ng nh???p...")
        }
        if(currentUser){
            var time = new Date()
            const someArray = allInfo
            const found = someArray.find(element => element.userId == currentUser.id);
        
            if(!found){
                firestore.collection('contentStatus').add({
                    contentId: id, 
                    userId: currentUser.id, 
                    liked: "false",
                    saved: "true",
                    reported: "false",
                    savedDate: time,
                })

            }

            if(found){
                const foundSaved = found.saved
                if (foundSaved == "false")
                firestore.collection('contentStatus').doc(found.infoId).set({
                    saved: "true",
                    savedDate: time,
                }, { merge: true })
                
                if (foundSaved == "true")
                firestore.collection('contentStatus').doc(found.infoId).set({
                    saved: "false",
                    savedDate: deleteField(),
                }, { merge: true })
            }
        }
    }

    const handleReport = () => {
        if(!currentUser) {
            alert("Kh??ng th??? th???c hi???n b??o c??o n???i dung, xin vui l??ng ????ng nh???p...")
        }
        if(currentUser){
            var time = new Date()
            if(reportDesc == ""){
                alert("M?? t??? b??o c??o kh??ng ???????c ????? tr???ng!!!")
                return
            }

            var filtered = handleFilter(state)
            var reportDescString = filtered.join(', ')
            reportDescString = reportDescString + ", " + reportDesc
            
            const someArray = allInfo
            const found = someArray.find(element => element.userId == currentUser.id);
        
            if(!found){
                firestore.collection('contentStatus').add({
                    contentId: id, 
                    userId: currentUser.id, 
                    liked: "false",
                    saved: "false",
                    reported: "true",
                    reportDesc: reportDescString,
                    reportedDate: time,
                })

            }

            if(found){
                const foundReported = found.saved
                if (foundReported == "false")
                firestore.collection('contentStatus').doc(found.infoId).set({
                    reported: "true",
                    reportDesc: reportDescString,
                    reportedDate: time,
                }, { merge: true })
                
                if (foundReported == "true")
                firestore.collection('contentStatus').doc(found.infoId).set({
                    reported: "true",
                    reportDesc: reportDescString,
                }, { merge: true })
            }

            alert("B??o c??o th??nh c??ng")
            toggleModal()
        }
    }

    return <>
        
        <div className="imageDetails_showImage">
            {showAllImage ?    
                urls.map(url => {
                    return(
                        <div className='imageDetails_showImage_container' key={url}>
                            <img src={url} />
                        </div>
                    )
                })
            :   <> {urls && [
                <div className='imageDetails_showImage_container'>
                    <img src={urls[0]} />
                </div>
                ]}
                {urls && urls.length > 1 && [
                <div className='imageDetails_showImage_container'>
                    <ShowMoreButton onClick={() => {setShowAllImage(true)}}>
                        Hi???n th??? th??m
                    </ShowMoreButton>
                </div>
                ]}
                </>
            }
        </div>

        <div className='imageDetails_leftSide_title'>
            {title}
        </div>

        <div className='imageDetails_leftSide_option'>
            <div className='imageDetails_leftSide_optionView'>

                {date && [<> {moment(date.toDate()).locale('vi').calendar()}</>]}
                
            </div>
            
            <div className='imageDetails_leftSide_optionItems'>
                <div className='imageDetails_leftSide_optionItem'>
                    {/* {!like ? <FavoriteBorderIcon onClick={() => handleLike()} className='videoDetails_leftSide_optionIcon liked' /> :
                    <FavoriteIcon onClick={() => handleLike()} className='videoDetails_leftSide_optionIcon liked' />}
                    {likeArray.length > 0 ? likeArray[0].likes.length : 0} */}

                    {!like ? <FavoriteBorderIcon onClick={() => handleLike()} className='imageDetails_leftSide_optionIcon liked' /> :
                    <FavoriteIcon onClick={() => handleLike()} className='imageDetails_leftSide_optionIcon liked' />}
                    {allInfo.length > 0 ? likeArray.length : 0}
                </div>
                <div onClick={() => handleSave()} className={!save ? 'imageDetails_leftSide_optionItem' : 'imageDetails_leftSide_optionItem saved'}>
                    <PlaylistAddIcon className='imageDetails_leftSide_optionIcon' />
                    {!save ? "L??u" : "???? l??u"}
                </div>
                <div onClick={() => toggleModal()} className='imageDetails_leftSide_optionItem'> 
                    <EmojiFlagsIcon className='imageDetails_leftSide_optionIcon' />
                    B??o c??o
                </div>
            </div>
        </div>

        <div className='imageDetails_leftSide_tags'>
            {tags ?
            tags.map((tag) => {
                return(
                    <Link key={tag} to={`/images/tag/${tag}`}>
                        <span className='tag'>
                            {tag} 
                        </span>
                    </Link>
                )
            }) : null
            }
        </div>

        <div className='imageDetails_leftSide_desc'>
            <p style={{whiteSpace: "pre-line"}}> 
                {desc}
            </p>
        </div>

        {abilityAdsBlock == "true" ? null :
            <AdOnTop 
                Image={Image}
                Link="https://gamersupps.gg/?afmc=213&cmp_id=15872452240&adg_id=131805543003&kwd=&device=c&gclid=CjwKCAjw3cSSBhBGEiwAVII0Z-7utscsbxqYYMa4h3QCALZ_DkChfECxDVhp-K8eNBP0MTEPUvzBFxoCUIAQAvD_BwE"
            />
        }

        <AlertModal {...configModal}>
            <h2>
                B??o c??o
            </h2>
            <p>
                B??o c??o n???i dung s??? bao g???m: (H??y ?????c lu???t c???a page ????? b??o c??o c???a b???n th??m ch??nh x??c nh??)
            </p>
            <p>Xem lu???t t???i ????y: <Link to={'/rule'} target="_blank">Lu???t</Link></p>

            <div className={classes.root}>
                <FormControl component="fieldset" className={classes.formControl}>
                    {/* <FormLabel className={classes.formLabel} component="legend">B??o c??o n???i dung</FormLabel> */}
                    <FormGroup className={classes.formGroup}>
                        <FormControlLabel className={classes.formControlLabel}
                            control={<Checkbox checked={spam} onChange={handleChange} name="spam" />}
                            label="Spam"
                        />
                        <FormControlLabel className={classes.formControlLabel}
                            control={<Checkbox checked={mean} onChange={handleChange} name="N???i dung ho???c b??nh lu???n c?? ?? x??c ph???m" />}
                            label="N???i dung ho???c b??nh lu???n c?? ?? x??c ph???m"
                        />
                        <FormControlLabel className={classes.formControlLabel}
                            control={<Checkbox checked={notRelate} onChange={handleChange} name="Kh??ng li??n quan" />}
                            label="Kh??ng li??n quan"
                        />
                    </FormGroup>
                    
                </FormControl>
                
            </div>
            <FormTextArea 
                label="M?? t??? b??o c??o"
                type="Text"
                placeholder="M?? t??? b??o c??o"
                value={reportDesc}
                handleChange={e => setReportDesc(e.target.value)}
            />
            <p>
                * ????? gi??p admin c?? th??? xem x??t n???i dung m???t c??ch nhanh h??n, h??y xem x??t v?? ??i???n
                ?????y ????? c??c th??ng tin c???n thi???t (c?? th??? l?? s??? gi??y, v??? tr?? vi ph???m,...) nh?? th??? vi???c
                x??? l?? s??? ???????c ti???n h??nh m???t c??ch nhanh ch??ng h??n
            </p>
            <div className='modal_Buttons'>
                <Button onClick={() => toggleModal()}>
                    H???y
                </Button>
                <Button onClick={() => handleReport()}>
                    X??c nh???n
                </Button>
            </div>
            <p>
                * B???ng vi???c nh???n v??o n??t x??c nh???n b??n d?????i n???i dung s??? ch??nh th???c b??? b??o c??o, 
                ch??ng t??i s??? nhanh ch??ng xem x??t l???i n???i dung v?? x??c th???c l???i b??o c??o,
                n???u ????ng th?? n???i dung s??? b??? x??a.
            </p>
        </AlertModal>
    
    </>;
}

export default Main;
