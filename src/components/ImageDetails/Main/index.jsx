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
        "Nội dung hoặc bình luận có ý xúc phạm": false,
        "Không liên quan": false,
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
            alert("Không thể thực hiện thích nội dung, xin vui lòng đăng nhập...")
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
            alert("Không thể thực hiện lưu nội dung, xin vui lòng đăng nhập...")
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
            alert("Không thể thực hiện báo cáo nội dung, xin vui lòng đăng nhập...")
        }
        if(currentUser){
            var time = new Date()
            if(reportDesc == ""){
                alert("Mô tả báo cáo không được để trống!!!")
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

            alert("Báo cáo thành công")
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
                        Hiển thị thêm
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
                    {!save ? "Lưu" : "Đã lưu"}
                </div>
                <div onClick={() => toggleModal()} className='imageDetails_leftSide_optionItem'> 
                    <EmojiFlagsIcon className='imageDetails_leftSide_optionIcon' />
                    Báo cáo
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
                Báo cáo
            </h2>
            <p>
                Báo cáo nội dung sẽ bao gồm: (Hãy đọc luật của page để báo cáo của bạn thêm chính xác nhé)
            </p>
            <p>Xem luật tại đây: <Link to={'/rule'} target="_blank">Luật</Link></p>

            <div className={classes.root}>
                <FormControl component="fieldset" className={classes.formControl}>
                    {/* <FormLabel className={classes.formLabel} component="legend">Báo cáo nội dung</FormLabel> */}
                    <FormGroup className={classes.formGroup}>
                        <FormControlLabel className={classes.formControlLabel}
                            control={<Checkbox checked={spam} onChange={handleChange} name="spam" />}
                            label="Spam"
                        />
                        <FormControlLabel className={classes.formControlLabel}
                            control={<Checkbox checked={mean} onChange={handleChange} name="Nội dung hoặc bình luận có ý xúc phạm" />}
                            label="Nội dung hoặc bình luận có ý xúc phạm"
                        />
                        <FormControlLabel className={classes.formControlLabel}
                            control={<Checkbox checked={notRelate} onChange={handleChange} name="Không liên quan" />}
                            label="Không liên quan"
                        />
                    </FormGroup>
                    
                </FormControl>
                
            </div>
            <FormTextArea 
                label="Mô tả báo cáo"
                type="Text"
                placeholder="Mô tả báo cáo"
                value={reportDesc}
                handleChange={e => setReportDesc(e.target.value)}
            />
            <p>
                * Để giúp admin có thể xem xét nội dung một cách nhanh hơn, hãy xem xét và điền
                đầy đủ các thông tin cần thiết (có thể là số giây, vị trí vi phạm,...) như thể việc
                xứ lý sẽ được tiến hành một cách nhanh chóng hơn
            </p>
            <div className='modal_Buttons'>
                <Button onClick={() => toggleModal()}>
                    Hủy
                </Button>
                <Button onClick={() => handleReport()}>
                    Xác nhận
                </Button>
            </div>
            <p>
                * Bằng việc nhấn vào nút xác nhận bên dưới nội dung sẽ chính thức bị báo cáo, 
                chúng tôi sẽ nhanh chóng xem xét lại nội dung và xác thực lại báo cáo,
                nếu đúng thì nội dung sẽ bị xóa.
            </p>
        </AlertModal>
    
    </>;
}

export default Main;
