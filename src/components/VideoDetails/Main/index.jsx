import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player'

import { firestore } from '../../../firebase/utils';
import {collection, query, doc, onSnapshot, where} from "firebase/firestore"

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

const mapState = state => ({
    currentUser: state.user.currentUser,
})


function Main({id, url, title, views, desc, date, tags, category}) {
    const { currentUser } = useSelector(mapState);
    const [like, setLike] = useState(false)
    const [likeArray, setLikeArray] = useState([])
    const [allInfo, setAllInfo] = useState([])
    const [save, setSave] = useState(false)
    const [hideModal, setHideModal] = useState(true)
    const [watched, setWatched] = useState(false)
    const [showContainer, setShowContainer] = useState(false)
    const [tagLog, setTagLog] = useState([])

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
        getTagLog()
    }, [currentUser])

    useEffect(() => {
        checkLike()
        checkSave()
        
    }, [allInfo])

    // ===============================THIS THING FOR UPDATE POINT FOR CONTENT BUT NOT USE YET
    const handlePoint = () => {
        var likeTotal = 0
        var viewTotal = views * 10
        if(allInfo.length > 0) {
            likeTotal = likeArray.length * 100
        }
        var allTotal = 0
        var today = new Date();
        var nowTime = Number(today)
        var oldTime = Number(date)
        var minute = Math.round(Math.abs(nowTime - oldTime) / 60,2)
        var hour = minute / 60
        console.log(hour)
        allTotal = (likeTotal + viewTotal) - (0.04167) * (likeTotal + viewTotal) * hour
        console.log(allTotal)
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
        if(currentUser){
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
                    reported: "false"
                })
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
                        liked: "true"
                    }, { merge: true })
                    setShowContainer(true)
                }
                
                if (foundLiked == "true") {
                    firestore.collection('contentStatus').doc(found.infoId).set({
                        liked: "false"
                    }, { merge: true })
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
        if(currentUser){
            const someArray = allInfo
            const found = someArray.find(element => element.userId == currentUser.id);
        
            if(!found){
                firestore.collection('contentStatus').add({
                    contentId: id, 
                    userId: currentUser.id, 
                    liked: "false",
                    saved: "true",
                    reported: "false"
                })

            }

            if(found){
                const foundSaved = found.saved
                if (foundSaved == "false")
                firestore.collection('contentStatus').doc(found.infoId).set({
                    saved: "true"
                }, { merge: true })
                
                if (foundSaved == "true")
                firestore.collection('contentStatus').doc(found.infoId).set({
                    saved: "false"
                }, { merge: true })
            }
        }
    }

    const handleReport = () => {
        if(currentUser){
            const someArray = allInfo
            const found = someArray.find(element => element.userId == currentUser.id);
        
            if(!found){
                firestore.collection('contentStatus').add({
                    contentId: id, 
                    userId: currentUser.id, 
                    liked: "false",
                    saved: "false",
                    reported: "true"
                })

            }

            if(found){
                const foundReported = found.saved
                if (foundReported == "false")
                firestore.collection('contentStatus').doc(found.infoId).set({
                    reported: "true"
                }, { merge: true })
                
                if (foundReported == "true")
                firestore.collection('contentStatus').doc(found.infoId).set({
                    reported: "true"
                }, { merge: true })
            }

            alert("Báo cáo thành công")
            toggleModal()
        }
    }

    const handleWatching = ({ played }) => {
        if(played >= 0.2 && !watched){
            var numView = views * 1
            numView = numView + 1
            var realNumView = numView.toString()
            var tagArray = tagLog

            firestore.collection('videos').doc(id).set({
                views: realNumView
            }, { merge: true })

            if(tags.length > 0 && currentUser){
                tags.map(tag => {

                    var someArray = tagArray.find(element => element.tag == tag)

                    if(!someArray){
                        firestore.collection('tagLog').add({
                            uid: currentUser.id, 
                            tag: tag,
                        })
                    }
                    
                })
            }
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

        {currentUser ? <PopUpContainer 
                            tags={tags} 
                            category={category} 
                            showContainer={showContainer}
                        /> 
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

        <AlertModal {...configModal}>
            <h2>
                Báo cáo
            </h2>
            <p>
                Báo cáo nội dung sẽ bao gồm: 
            </p>
            <p>
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
            </p>
            <p>
                * Bằng việc nhấn vào nút xác nhận bên dưới nội dung sẽ chính thức bị báo cáo, 
                chúng tôi sẽ nhanh chóng xem xét lại nội dung và xác thực lại báo cáo,
                nếu đúng thì nội dung sẽ bị xóa.
            </p>
            <div className='modal_Buttons'>
                <Button onClick={() => toggleModal()}>
                    Hủy
                </Button>
                <Button onClick={() => handleReport()}>
                    Xác nhận
                </Button>
            </div>
        </AlertModal>
    
    </>;
}

export default Main;
