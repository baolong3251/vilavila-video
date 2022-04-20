import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";

import VideoCard from '../../VideoCard'
import { firestore } from '../../../firebase/utils';



function ShowMoreVideos() {
    const [videosThing, setVideosThing] = useState([])
    const [userArr, setUserArr] = useState([])

    useEffect(() => {

        firestore.collection('users').where("abilityShowMore", "==", "true").get().then(snapshot => {
                setUserArr(snapshot.docs.map(doc => ({
                    uid: doc.id, 
                    abilityShowMore: doc.data().abilityShowMore, 
                    
                })
            ))
        })
      
        
    }, [])

    console.log(userArr)
    console.log(videosThing)

    useEffect(() => {

        if(userArr.length > 0) {
            var arrUid = userArr.map(a => a.uid);
            getVideosData(arrUid)
        }
      
        
    }, [userArr])

    const getVideosData = (id) => {
        firestore.collection("videos").where("videoAdminUID", "in", id).orderBy("point", "desc").get().then(snapshot => {
            setVideosThing(snapshot.docs.map(doc => ({
              documentID: doc.id, 
              title: doc.data().title, 
              views: doc.data().views, 
              thumbnail: doc.data().thumbnail,
              privacy: doc.data().privacy, 
              sourceLink: doc.data().sourceLink, 
              desc: doc.data().desc,
              createdDate: doc.data().createdDate, 
              videoAdminUID: doc.data().videoAdminUID, 
            })
          ))
        })
    }


    if(!Array.isArray(videosThing)) return null
    
    if (videosThing.length < 1) {
        return (
            <div className="container_video">    
                <p>
                    Opps... không có gì ở đây cả...
                </p>

            </div>
        )
    }

    return (
        <div className='container_video following-thing'>
            <div className='upper'>
                <h2 className='label_video_type'>
                    Các bạn có thể thích...
                </h2>
                <div className='layout_video'>

                    {videosThing.length !== 0 && [
                    videosThing.map((video, pos) => {
                        const { thumbnail, title, views, likes, privacy, sourceLink, desc, createdDate, videoAdminUID, documentID } = video
                        if ( !title || 
                            typeof views === 'undefined') return null

                        const configVideo = {
                            ...video
                        }
                        
                        return(
                            
                            <VideoCard key={documentID}
                                {...configVideo}
                            />
                            
                        )
                    })]}
                    

                </div>
            </div>
        </div>
    )
}

export default ShowMoreVideos
