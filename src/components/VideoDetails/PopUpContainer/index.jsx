import React, { useEffect, useState } from 'react';
import { Avatar } from '@material-ui/core';
import ReactPlayer from 'react-player'
import { Link, useParams } from 'react-router-dom';
import Button from "../../Forms/Button"
import {collection, query, doc, onSnapshot, where} from "firebase/firestore"
import { firestore } from '../../../firebase/utils';
import { useSelector } from 'react-redux';
import CloseIcon from '@material-ui/icons/Close';
import VideoThumbnail from 'react-video-thumbnail';
import TopInner_thumbnail from './TopInner_thumbnail';

const mapState = state => ({
    currentUser: state.user.currentUser,
})

function PopUpContainer({ videoAdminId, tags, category, showContainer, id }) {
    const { currentUser } = useSelector(mapState);
    const [notSortedArray, setNotSortedArray] = useState([])
    const [userArray, setUserArray] = useState([])
    const [userDetailArray, setUserDetailArray] = useState([])
    const [contentArray, setContentArray] = useState([])
    const [showStat, setShowStat] = useState(showContainer)
    const [thumb, setThumb] = useState('')
    const { videoID } = useParams()

    useEffect(() => {
        // this thing will data from firestore
        if(category) {
            reset()
            let ref = firestore.collection("videos")

            if(tags.length > 0) ref = ref.where("tags", "array-contains-any", tags)
            if(tags.length == 0) ref = ref.where("category", "==", category)

            ref = ref.where("videoAdminUID", "!=", videoAdminId).where("tier", "==", "").where("privacy", "==", "public").limit(10)
            
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
    }, [id])

    const reset = () => {
        setUserArray([])
        setContentArray([])
        setUserDetailArray([])
        setNotSortedArray([])
    }

    console.log(videoAdminId)
    // console.log(notSortedArray)
    // console.log(userArray)
    // console.log(userDetailArray)

    // useEffect(() => {
    //     // this thing will data from firestore
    //     setShowStat(showContainer)
    // }, [showContainer])

    useEffect(() => {
        // When the thing on up useEffect change this will happen
        if(notSortedArray.length == 0) {

        }else {
            if(userArray.length < 1){
                var result = notSortedArray.map(a => a.videoAdminUID);
                eliminateDuplicates(result)
            }
            if(userArray.length >= 1){
                var result = notSortedArray.map(a => a.videoAdminUID);
                eliminateDuplicatesForAfter(result)
            }
        }
    }, [notSortedArray])

    useEffect(() => {
        // When the thing on up useEffect change this will happen
        // if(userArray.length !== 0 && userArray.length < 3) {
        //     let ref = firestore.collection("videos")

        //     // if(tags) ref = ref.where("tags", "array-contains-any", tags)
        //     ref = ref.where("category", "==", category)

            
        //     ref = ref.where("videoAdminUID", "not-in", userArray).where("videoAdminUID", "!=", videoAdminId).where("tier", "==", "").where("privacy", "==", "public").limit(10)
            
        //     try {
        //         ref.get().then(
        //             (snapshot) => {
        //                 setNotSortedArray(snapshot.docs.map(doc => ({
        //                     vid: doc.id, 
        //                     videoAdminUID: doc.data().videoAdminUID,
        //                   })
        //                 ))
        //             }
        //         )


        //     } catch (err) {
                
        //     }
        // }
        if(userArray.length > 0) {
            doSomeThing()
        }
    }, [userArray])

    // useEffect(() => {
    //     if(userArray.length == 3 && contentArray.length > 0) {
    //         userArray.map(array => {
    //             CheckArray(array)
    //         })
    //     }
    // }, [contentArray])

    const doSomeThing = () => {
        userArray.map(array => {
            getUserData(array)
            getContentArray(array)
        })
    }

    const getUserData = (userId) => {
        firestore.collection("users").doc(userId).onSnapshot((snapshot) => {
            setUserDetailArray((prevState) => [...prevState,{
                uid: snapshot.id,
                displayName: snapshot.data().displayName,
                avatar: snapshot.data().avatar,
                follow: snapshot.data().follow,
            }])
        }) 
    }

    const getContentArray = (userId) => {
        let ref = firestore.collection("videos")

        if(tags.length > 0) ref = ref.where("tags", "array-contains-any", tags)
        if(category && tags.length == 0) ref = ref.where("category", "==", category)

        ref = ref.where("videoAdminUID", "==", userId)
        ref = ref.where("tier", "==", "").where("privacy", "==", "public").limit(2)
        
        ref.get().then(
            (snapshot) => {
                
                snapshot.docs.map(doc => ( setContentArray( (prevState) => [...prevState,{
                    vid: doc.id, 
                    title: doc.data().title, 
                    sourceLink: doc.data().sourceLink, 
                    privacy: doc.data().privacy,
                    createdDate: doc.data().createdDate,
                    tags: doc.data().tags,
                    thumbnail: doc.data().thumbnail,
                    videoAdminUID: doc.data().videoAdminUID,
                    views: doc.data().views,
                    }]))
                )
                
            }
        )
        
    }

    const CheckArray = (userId) => {
        var someArray = contentArray.filter(element => element.videoAdminUID == userId)
        var result = someArray.map(a => a.title)
        
        if(someArray.length < 2){
            let ref = firestore.collection("videos")

            ref = ref.where("category", "==", category)

            ref = ref.where("videoAdminUID", "==", userId)
            ref = ref.where("title", "not-in", result).where("tier", "==", "").where("privacy", "==", "public").limit(2)
            
            ref.get().then(
                (snapshot) => {
                    
                    snapshot.docs.map(doc => ( setContentArray( (prevState) => [...prevState,{
                        vid: doc.id, 
                        title: doc.data().title, 
                        sourceLink: doc.data().sourceLink, 
                        privacy: doc.data().privacy,
                        createdDate: doc.data().createdDate,
                        tags: doc.data().tags,
                        thumbnail: doc.data().thumbnail,
                        videoAdminUID: doc.data().videoAdminUID,
                        views: doc.data().views,
                      }]))
                    )
                    
                }
            )  
        }
    
    }

    const eliminateDuplicates = (arr) => {
        // var someArray = arr.filter(element => element !== currentUser.id)
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
        var arrayThing = userArray.concat(out)
        arrayThing.length = 3
        setUserArray(arrayThing)
    }

    return (
        
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
                                                <Link to={`/video/${arr.vid}`} >
                                                <TopInner_thumbnail key={arr.vid} arr={arr} />
                                                
                                                <div className='popUpWhenLike_item_topInnerInfo'>
                                                
                                                    {arr.title}
                            
                                                </div>
                                                </Link>
                                            </div>
                                        )
                                    })}
                                    
                                </div>
                                <div className='popUpWhenLike_item_bottom'>
                                    <div className='popUpWhenLike_item_bottomChannel'>
                                        <Avatar src={uArray.avatar} />
                                        <Link to={`/user/${uArray.uid}`} target="_blank" className='popUpWhenLike_item_bottomChannelText'>
                                            {uArray.displayName}
                                        </Link>
                                    </div>

                                    <div className='popUpWhenLike_item_bottomButton'>
                                        <Link to={`/user/${uArray.uid}`} target="_blank">
                                            <Button>
                                                Xem trang
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )})
                    : null
                    }

                    
                </div>
            
    )
}

export default PopUpContainer