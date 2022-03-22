import React, { useEffect, useState } from 'react';
import { Avatar } from '@material-ui/core';
import ReactPlayer from 'react-player'
import { Link } from 'react-router-dom';
import Button from "../../Forms/Button"
import {collection, query, doc, onSnapshot, where} from "firebase/firestore"
import { firestore } from '../../../firebase/utils';
import { useSelector } from 'react-redux';
import CloseIcon from '@material-ui/icons/Close';
import VideoThumbnail from 'react-video-thumbnail';

const mapState = state => ({
    currentUser: state.user.currentUser,
})

function PopUpContainer({tags, category, showContainer}) {
    const { currentUser } = useSelector(mapState);
    const [notSortedArray, setNotSortedArray] = useState([])
    const [userArray, setUserArray] = useState([])
    const [userDetailArray, setUserDetailArray] = useState([])
    const [contentArray, setContentArray] = useState([])
    const [showStat, setShowStat] = useState(showContainer)
    const [thumb, setThumb] = useState('')

    useEffect(() => {
        // this thing will data from firestore
        if(category) {
        let ref = firestore.collection("videos")

            if(tags) ref = ref.where("tags", "array-contains-any", tags)
            if(!tags) ref = ref.where("category", "==", category)

            ref = ref.where("tier", "==", "").where("privacy", "==", "public").limit(10)
            
            ref.get().then(
                (snapshot) => {
                    setNotSortedArray(snapshot.docs.map(doc => ({
                        vid: doc.id, 
                        videoAdminUID: doc.data().videoAdminUID,
                      })
                    ))
                }
            )
        }
    }, [category])

    useEffect(() => {
        // this thing will data from firestore
        setShowStat(showContainer)
    }, [showContainer])

    console.log(notSortedArray)
    console.log(userArray)

    useEffect(() => {
        // When the thing on up useEffect change this will happen
        if(userArray.length < 1){
            var result = notSortedArray.map(a => a.videoAdminUID);
            eliminateDuplicates(result)
        }
        if(userArray.length >= 1){
            var result = notSortedArray.map(a => a.videoAdminUID);
            eliminateDuplicatesForAfter(result)
        }
    }, [notSortedArray])

    useEffect(() => {
        // When the thing on up useEffect change this will happen
        if(userArray.length !== 0 && userArray.length < 3) {
            let ref = firestore.collection("videos")

            // if(tags) ref = ref.where("tags", "array-contains-any", tags)
            if(tags) ref = ref.where("category", "==", category)

            
            ref = ref.where("videoAdminUID", "not-in", userArray).where("tier", "==", "").where("privacy", "==", "public").limit(10)
            
            try {
                ref.get().then(
                    (snapshot) => {
                        setNotSortedArray(snapshot.docs.map(doc => ({
                            vid: doc.id, 
                            videoAdminUID: doc.data().videoAdminUID,
                          })
                        ))
                    }
                )
            } catch (err) {
                setNotSortedArray([])
            }
        }
        if(userArray.length == 3) {
            userArray.map(array => {
                getUserData(array)
                getContentArray(array)
            })
        }
    }, [userArray])

    console.log(contentArray)

    const getUserData = (userId) => {
        firestore.collection("users").doc(userId).onSnapshot((snapshot) => {
            setUserDetailArray([...userDetailArray,{
                uid: snapshot.id,
                displayName: snapshot.data().displayName,
                avatar: snapshot.data().avatar,
                follow: snapshot.data().follow,
            }])
        }) 
    }

    const getContentArray = (userId) => {
        let ref = firestore.collection("videos")

            if(tags) ref = ref.where("tags", "array-contains-any", tags)
            if(!tags) ref = ref.where("category", "==", category)

            ref = ref.where("videoAdminUID", "==", userId)
            ref = ref.where("tier", "==", "").where("privacy", "==", "public").limit(2)
            
            ref.get().then(
                (snapshot) => {
                    setContentArray(snapshot.docs.map(doc => ({
                        vid: doc.id, 
                        title: doc.data().title, 
                        sourceLink: doc.data().sourceLink, 
                        privacy: doc.data().privacy,
                        createdDate: doc.data().createdDate,
                        tags: doc.data().tags,
                        thumbnail: doc.data().thumbnail,
                        videoAdminUID: doc.data().videoAdminUID,
                        views: doc.data().views,
                      })
                    ))
                }
            ) 
    }

    const eliminateDuplicates = (arr) => {
        var i,
            len = arr.length,
            out = [],
            obj = {};
      
        for (i = 0; i < len; i++) {
          obj[arr[i]] = 0;
        }
        for (i in obj) {
            if(out.length < 3)
            out.push(i);
        }
        setUserArray(out)
    }

    const eliminateDuplicatesForAfter = (arr) => {
        var i,
            len = arr.length,
            out = [],
            obj = {};
      
        for (i = 0; i < len; i++) {
          obj[arr[i]] = 0;
        }
        for (i in obj) {
            if(out.length < 3)
            out.push(i);
        }
        setUserArray([...userArray, out])
    }

    return (
        <div className={showStat ? 'popUpWhenLike active' : 'popUpWhenLike'}>
                <div className='popUpWhenLike_title'>
                    Gợi ý người dùng
                </div>
                <div className='popUpWhenLike_turnOffIcon'>
                    <CloseIcon className='popUpWhenLike_icon' onClick={() => setShowStat(!showStat)} />
                </div>
                <div className='popUpWhenLike_items'>

                    {userDetailArray.length > 0 ? 
                    
                        userDetailArray.map(uArray => {
                            var someArray = contentArray.filter(element => element.videoAdminUID == uArray.uid)
                            return(
                            <div key={uArray.uid} className='popUpWhenLike_item'>
                                <div className='popUpWhenLike_item_top'>
                                    {someArray.map(arr => {
                                        return(
                                            <div className='popUpWhenLike_item_topInner'>
                                                <div className="video-player-inner">
                                                    {!arr.thumbnail ? <>
                                                    {/* <ReactPlayer 
                                                        className="react-player-inner"
                                                        url={arr.sourceLink} 
                                                        controls = {false}
                                                        width="100%"
                                                        height="100%"
                                                        config={{ file: { 
                                                            attributes: {
                                                                controlsList: 'nodownload'
                                                        }}}} 
                                                    />  */}

                                                    <div className='hideVideoThumbnail'>
                                                        <VideoThumbnail
                                                            videoUrl={arr.sourceLink} 
                                                            thumbnailHandler={(thumbnail) => setThumb(thumbnail)}
                                                            // width={2000}
                                                            // height={1100}
                                                            // snapshotAtTime={5}
                                                            crossorigin
                                                        />
                                                    </div>

                                                    <img src={thumb} />
                                                    </> : <img src={arr.thumbnail} />
                                                    }
                                                </div>
                                                <div className='popUpWhenLike_item_topInnerInfo'>
                                                
                                                    {arr.title}
                            
                                                </div>
                                            </div>
                                        )
                                    })}
                                    
                                </div>
                                <div className='popUpWhenLike_item_bottom'>
                                    <div className='popUpWhenLike_item_bottomChannel'>
                                        <Avatar src={uArray.avatar} />
                                        <div className='popUpWhenLike_item_bottomChannelText'>
                                            {uArray.displayName}
                                        </div>
                                    </div>

                                    <div className='popUpWhenLike_item_bottomButton'>
                                        <Button>
                                            Theo dõi
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )})
                    : null
                    }

                    
                </div>
            </div>
    )
}

export default PopUpContainer