import React, { useEffect, useState } from 'react'
import HorizontalVideoCard from "../../../components/HorizontalVideoCard"
import HorizontalImageCard from "../../../components/HorizontalImageCard"
import { firestore } from '../../../firebase/utils'

function ContentLiked(props) {
    const [contentVideo, setContentVideo] = useState([])
    const [contentImg, setContentImg] = useState([])

    useEffect(() => {
        
        firestore.collection("videos").doc(props.content.contentId).get().then((snapshot) => {
            try {
                setContentVideo([...contentVideo,{
                    vid: snapshot.id, 
                    title: snapshot.data().title,
                    views: snapshot.data().views,
                    privacy: snapshot.data().privacy,
                    desc: snapshot.data().desc,
                    category: snapshot.data().category,
                    sourceLink: snapshot.data().sourceLink,
                    thumbnail: snapshot.data().thumbnail,
                    createdDate: snapshot.data().createdDate,
                    videoAdminUID: snapshot.data().videoAdminUID,
                    tier: snapshot.data().tier,
                }]
                )
            } catch (error) {
                getData(props.content.contentId)
            }
        })
       
      }, [props.content.id])
    
    const getData = (id) => {
        firestore.collection("images").doc(id).get().then((snapshot) => {
            try {
            setContentImg([...contentImg,{
                id: snapshot.id, 
                title: snapshot.data().title,
                privacy: snapshot.data().privacy,
                desc: snapshot.data().desc,
                sourceLink: snapshot.data().sourceLink,
                createdDate: snapshot.data().createdDate,
                imageAdminUID: snapshot.data().imageAdminUID,
                tier: snapshot.data().tier,
                }]
            )
            } catch (error) {
            
            }
        })
    }
    
    const handleUnLike = (id) => {

        firestore.collection("contentStatus").doc(id).set({
            saved: "false",
        }, { merge: true });

        var arrVideo = contentVideo.filter(item => item.vid !== id)
        var arrImage = contentImg.filter(item => item.id !== id)

        setContentImg(arrImage)
        setContentVideo(arrVideo)
        

    }
    return (
        <>
            
                
            {
                contentVideo.map(video => {
                return(
                    <div className='userSavedContents_videoContainer' key={video.vid}>
                        <HorizontalVideoCard video={video} />

                        <div onClick={() => handleUnLike(props.content.id)} className='userSavedContents_videoContainer_delButton'>
                            x
                        </div>
                    </div>
                )
                })
            }
            

            
                
            {
                contentImg.map(image => {
                return(
                    <div className='userSavedContents_imageContainer' key={image.id}>
                        <HorizontalImageCard image={image} />

                        <div onClick={() => handleUnLike(props.content.id)} className='userSavedContents_imageContainer_delButton'>
                            x
                        </div>

                        <div className='userSavedContents_imageContainer_type'>
                            Hình ảnh
                        </div>
                    </div>
                )
                })
            }
            
        </>
    )
}

export default ContentLiked