import React, { useState } from 'react'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { firestore } from '../../../firebase/utils'
import {collection, query, where, orderBy, onSnapshot, getDocs, limit} from "firebase/firestore"
import VideoCard from './VideoCard'

function SideVideoCard({category, tags}) {
    const [videos, setVideos] = useState([])
    const { videoID } = useParams()

    useEffect(() => {
        if(category && tags){
            // const q = query(collection(firestore, "videos"), where("tags", "array-contains-any", tags));
            // getDocs(q, (snapshot) => {
            //     setVideos(snapshot.docs.map(doc => ({
            //         vid: doc.id, 
            //         title: doc.data().title, 
            //         sourceLink: doc.data().sourceLink, 
            //         privacy: doc.data().privacy,
            //         createdDate: doc.data().createdDate,
            //         tags: doc.data().tags,
            //         thumbnail: doc.data().thumbnail,
            //         videoAdminUID: doc.data().videoAdminUID,
            //         views: doc.data().views,
            //       })
            //     ))
            // })

            let ref = firestore.collection("videos").where("tier", "==", "").where("privacy", "==", "public")

            if(tags) ref = ref.where("tags", "array-contains-any", tags)
            if(!tags) ref = ref.where("category", "==", category)

            ref = ref.where("tier", "==", "")
            
            ref.get().then(
                (snapshot) => {
                    setVideos(snapshot.docs.map(doc => ({
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
    }, [tags])

    console.log(videos)

  return (
    <div className='videoDetails_sideVideoCard'>

        {
            videos.map(video => {
                return(
                    <div key={video.vid}>
                        {video.vid !== videoID ? <VideoCard video={video} /> : null}
                    </div>
                )
            })
        }

        {/* <div className='videoDetails_rightSide_videoCards'>
            <div className='videoDetails_rightSide_videoCardsThumbnail'>
                <img className='videoCards_img' src="" />
            </div>
            <div className='videoDetails_rightSide_videoCardsInfo'>
                <div className="videoCards_text">
                    <Link>
                        <h4>titleassssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss</h4>
                    </Link>
                    
                    <p>Channel</p>
                    <p>
                        12345 • time 
                    </p>
                </div>
            </div>
        </div>

        <div className='videoDetails_rightSide_videoCards'>
            <div className='videoDetails_rightSide_videoCardsThumbnail'>
                <img className='videoCards_img' src="" />
            </div>
            <div className='videoDetails_rightSide_videoCardsInfo'>
                <div className="videoCards_text">
                    <Link>
                        <h4>titleassssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss</h4>
                    </Link>
                    
                    <p>Channel</p>
                    <p>
                        12345 • time 
                    </p>
                </div>
            </div>
        </div> */}
    </div>
  )
}

export default SideVideoCard