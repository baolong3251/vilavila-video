import React, { useEffect, useState } from 'react'
import "./style_animationVideo.scss"
import { Link, useHistory, useParams } from "react-router-dom";

import VideoCard from '../../VideoCard'
import { firestore } from '../../../firebase/utils';



function AnimationVideo() {
    const [videosThing, setVideosThing] = useState([])

    useEffect(() => {
        firestore.collection("videos").where("category", "==", "animation").where("tier", "==", "").where("privacy", "==", "public").limit(8).get().then(snapshot => {
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
           
        
    }, [])


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
                    Thể loại Animation <Link to={`/videos/${"animation"}`}>Xem thêm</Link>
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

export default AnimationVideo
