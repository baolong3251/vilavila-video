import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player'
import Image from "../../../assets/16526305592141308214.png"

import { firestore } from '../../../firebase/utils';
import {collection, query, doc, onSnapshot, where, updateDoc, increment} from "firebase/firestore"

import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import EmojiFlagsIcon from '@material-ui/icons/EmojiFlags';

import moment from 'moment'
import 'moment/locale/vi';
import { useSelector } from 'react-redux';
import AlertModal from '../../AlertModal';
import Button from "../../Forms/Button"
import { Link } from 'react-router-dom';
import PopUpContainer from '../PopUpContainer';
import FormTextArea from '../../Forms/FormTextArea';
import AdOnTop from '../../DisplayAd/AdOnTop';


import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import CloseIcon from '@material-ui/icons/Close';
import { deleteField } from "firebase/firestore";


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


function Main({id, url, title, views, desc, date, tags, category, videoAdminUID, abilityShowMore, abilityAdsBlock, point}) {
    const { currentUser } = useSelector(mapState);
    const [like, setLike] = useState(false)
    const [likeArray, setLikeArray] = useState([])
    const [allInfo, setAllInfo] = useState([])
    const [save, setSave] = useState(false)
    const [hideModal, setHideModal] = useState(true)
    const [watched, setWatched] = useState(false)
    const [showContainer, setShowContainer] = useState(false)
    const [tagLog, setTagLog] = useState([])
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
        if (id) {
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
        setShowContainer(false)
        
    }, [id])

    useEffect(() => {
        if (id && allInfo.length > 0) {
            checkLike()
            checkSave()
        }
        // getTagLog()
    }, [currentUser])

    useEffect(() => {
        checkLike()
        checkSave()
        
    }, [allInfo])

    // ===============================THIS THING FOR UPDATE POINT FOR CONTENT BUT NOT USE YET
    const handlePoint = () => {
        var currentPoint = point
        var likeTotal = 0
        var viewTotal = views * 10
        var bonusPoint = 0
        if(allInfo.length > 0) {
            likeTotal = likeArray.length * 100
        }
        if(abilityShowMore){
            bonusPoint = 1000
        }
        var allTotal = 0
        var today = new Date();
        var nowTime = Number(today)
        var oldTime = Number(date)
        var minute = Math.round(Math.abs(nowTime - oldTime) / 60,2)
        var hour = minute / 60
        
        allTotal = (likeTotal + viewTotal + bonusPoint) - (0.04167) * (likeTotal + viewTotal + bonusPoint) * hour
        return allTotal
    }

    //================================THIS THING GET ALL OF TAG USER CONTACT WITH
    const getTagLog = () => {
        if(currentUser){
            firestore.collection("tagLog").where("uid", "==", currentUser.id).onSnapshot(
                (snapshot) => {
                    setTagLog(snapshot.docs.map(doc => ({
                        tid: doc.id, 
                        uid: doc.data().uid,  
                        tag: doc.data().tag,
                    })
                    ))
                }
            )
        }
    }

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
            // Put the id of currentUser into the follow array
            // const someArray = likeArray[0].likes
            // const found = someArray.find(element => element == currentUser.id);
            var time = new Date()
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
                    firestore.collection('users').doc(videoAdminUID).set({
                        point: increment(10),
                    }, { merge: true })
                )
                setShowContainer(true)
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
                if (foundLiked == "false") {
                    firestore.collection('contentStatus').doc(found.infoId).set({
                        liked: "true",
                        likedDate: time,
                    }, { merge: true }).then(
                        firestore.collection('users').doc(videoAdminUID).set({
                            point: increment(10),
                        }, { merge: true })
                    )
                    setShowContainer(true)
                }
                
                if (foundLiked == "true") {
                    firestore.collection('contentStatus').doc(found.infoId).set({
                        liked: "false",
                        likedDate: deleteField(),
                    }, { merge: true }).then(
                        firestore.collection('users').doc(videoAdminUID).set({
                            point: increment(-10),
                        }, { merge: true })
                    )
                    setShowContainer(false)
                }
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
            alert("Không thể thực hiện báo cáo, xin vui lòng đăng nhập...")
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

    const handleWatching = ({ played }) => {
        if(played >= 0.2 && !watched){
            
            // var tagArray = tagLog

            const viewRef = doc(firestore, "videos", id);

            // Atomically increment the population of the city by 50.
            updateDoc(viewRef, {
                views: increment(1)
            });

            var point = handlePoint()
            point = point.toString()

            firestore.collection('videos').doc(id).set({
                point: point,
            }, { merge: true })

            firestore.collection('users').doc(videoAdminUID).set({
                point: increment(1),
            }, { merge: true })

            // firestore.collection('videos').doc(id).update({
            //     views: firestore.FieldValue.increment(1)
            // }, { merge: true })

            // if(tags.length > 0 && currentUser){
            //     tags.map(tag => {

            //         var someArray = tagArray.find(element => element.tag == tag)

            //         if(!someArray){
            //             firestore.collection('tagLog').add({
            //                 uid: currentUser.id, 
            //                 tag: tag,
            //             })
            //         }
                    
            //     })
            // }
            setWatched(true)
        }
    }

    return <>
        
        <div className="video-player">
            <ReactPlayer 
                className="react-player"
                url={url} 
                controls = {true}
                playing = {true}
                width="100%"
                height="100%"
                onProgress={handleWatching}
                crossorigin
                config={{ file: { 
                    attributes: {
                        controlsList: 'nodownload'
                }}}}
            />
        </div>

        <div className='videoDetails_leftSide_title'>
            {title}
        </div>

        <div className='videoDetails_leftSide_option'>
            <div className='videoDetails_leftSide_optionView'>

                {!date && [<>{views} lượt xem</>]}

                {date && [<>{new Intl.NumberFormat().format(views)} lượt xem • {moment(date.toDate()).locale('vi').calendar()}</>]}
                
            </div>
            
            <div className='videoDetails_leftSide_optionItems'>
                <div className='videoDetails_leftSide_optionItem'>
                    {/* {!like ? <FavoriteBorderIcon onClick={() => handleLike()} className='videoDetails_leftSide_optionIcon liked' /> :
                    <FavoriteIcon onClick={() => handleLike()} className='videoDetails_leftSide_optionIcon liked' />}
                    {likeArray.length > 0 ? likeArray[0].likes.length : 0} */}

                    {!like ? <FavoriteBorderIcon onClick={() => handleLike()} className='videoDetails_leftSide_optionIcon liked' /> :
                    <FavoriteIcon onClick={() => handleLike()} className='videoDetails_leftSide_optionIcon liked' />}
                    {allInfo.length > 0 ? likeArray.length : 0}
                </div>
                <div onClick={() => handleSave()} className={!save ? 'videoDetails_leftSide_optionItem' : 'videoDetails_leftSide_optionItem saved'}>
                    <PlaylistAddIcon className='videoDetails_leftSide_optionIcon' />
                    {!save ? "Lưu" : "Đã lưu"}
                </div>
                <div onClick={() => toggleModal()} className='videoDetails_leftSide_optionItem'> 
                    <EmojiFlagsIcon className='videoDetails_leftSide_optionIcon' />
                    Báo cáo
                </div>
            </div>
        </div>

        {currentUser ?  <>
            <div className={showContainer ? 'popUpWhenLike active' : 'popUpWhenLike'}>
                <div className='popUpWhenLike_title'>
                    Gợi ý người dùng
                </div>
                <div className='popUpWhenLike_turnOffIcon'>
                    <CloseIcon className='popUpWhenLike_icon' onClick={() => setShowContainer(!showContainer)} />
                </div> 
                {showContainer ?
                    <PopUpContainer 
                        videoAdminId = {videoAdminUID}
                        tags={tags ? tags : []} 
                        category={category} 
                        showContainer={showContainer}
                        id={id}
                    />  
                : null } 
            </div> </>
        : null}

        <div className='videoDetails_leftSide_tags'>
            {tags ?
            tags.map((tag) => {
                return(
                    <Link to={`/videos/tag/${tag}`}>
                        <span className='tag'>
                            {tag} 
                        </span>
                    </Link>
                    
                )
            }) : null
            }
        </div>

        <div className='videoDetails_leftSide_desc'>
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
            {/* <p>
                - Nội dung không phù hợp
            </p>
            <p>
                - Spam
            </p>
            <p>
                - Vi phạm các điều luật của web
            </p>
            <p>
                - ...
            </p> */}
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
