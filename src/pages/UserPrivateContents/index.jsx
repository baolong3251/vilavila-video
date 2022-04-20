import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import HorizontalImageCard from '../../components/HorizontalImageCard'
import HorizontalVideoCard from '../../components/HorizontalVideoCard'
import { firestore } from '../../firebase/utils'
import "./style_userPrivateContents.scss"

function UserPrivateContents() {
    const { userID } = useParams()
    const [videos, setVideos] = useState([])
    const [images, setImages] = useState([])
    const [notDoneVideos, setNotDoneVideos] = useState([])
    const [notDoneImages, setNotDoneImages] = useState([])

    useEffect(() => {
        
        getData()
       
    }, [userID])

    console.log(videos)
    console.log(images)

    const getData = async () => {
        try{
            await Promise.all([
                getVideos(), 
                getImages(),
                getNotDoneContentVideos(),
                getNotDoneContentImages()
            ])
        } catch (err) {
    
        }
    }

    const getVideos = () => {
        firestore.collection("videos").where("videoAdminUID", "==", userID).where("privacy", "==", "private").onSnapshot((snapshot) => {
            try {
              setVideos(snapshot.docs.map(doc => ({
                vid: doc.id, 
                title: doc.data().title,
                views: doc.data().views,
                privacy: doc.data().privacy,
                desc: doc.data().desc,
                category: doc.data().category,
                sourceLink: doc.data().sourceLink,
                thumbnail: doc.data().thumbnail,
                createdDate: doc.data().createdDate,
                videoAdminUID: doc.data().videoAdminUID,
                tier: doc.data().tier,
              })))
            } catch (error) {
              
            }
        })
    }

    const getImages = () => {
        firestore.collection("images").where("imageAdminUID", "==", userID).where("privacy", "==", "private").onSnapshot((snapshot) => {
            try {
              setImages(snapshot.docs.map(doc => ({
                id: doc.id, 
                title: doc.data().title,
                privacy: doc.data().privacy,
                desc: doc.data().desc,
                sourceLink: doc.data().sourceLink,
                createdDate: doc.data().createdDate,
                imageAdminUID: doc.data().imageAdminUID,
                tier: doc.data().tier,
              })))
            } catch (error) {
              
            }
        })
    }

    const getNotDoneContentVideos = () => {
        firestore.collection("videos").where("videoAdminUID", "==", userID).where("privacy", "==", "not-done").onSnapshot((snapshot) => {
            try {
                setNotDoneVideos(snapshot.docs.map(doc => ({
                    vid: doc.id, 
                    title: "",
                    views: "0",
                    privacy: doc.data().privacy,
                    desc: "",
                    category: "",
                    sourceLink: doc.data().sourceLink,
                    thumbnail: "",
                    createdDate: doc.data().createdDate,
                    videoAdminUID: doc.data().videoAdminUID,
                    tier: "",
                })))
            } catch (error) {
              
            }
        })
    }

    const getNotDoneContentImages = () => {
        firestore.collection("images").where("imageAdminUID", "==", userID).where("privacy", "==", "not-done").onSnapshot((snapshot) => {
            try {
                setNotDoneImages(snapshot.docs.map(doc => ({
                    id: doc.id, 
                    title: "",
                    privacy: doc.data().privacy,
                    desc: "",
                    sourceLink: doc.data().sourceLink,
                    createdDate: doc.data().createdDate,
                    imageAdminUID: doc.data().imageAdminUID,
                    tier: "",
                })))
            } catch (error) {
              
            }
        })
    }

    return (
        <div className='userPrivateContents'>
            <div className="userPrivateContents_videos horizontalVideo">
                <h2>Videos</h2>
                {videos.length == 0 && [<p>Không có nội dung nào tại đây cả...</p>]}
                {
                    videos.map(video => {
                    return(
                        <div key={video.vid}>
                            <HorizontalVideoCard video={video} />
                        </div>
                    )
                    })
                }
            </div>

            <div className="userPrivateContents_images horizontalImage">
                <h2>Hình ảnh</h2>
                {images.length == 0 && [<p>Không có nội dung nào tại đây cả...</p>]}
                {
                    images.map(image => {
                    return(
                        <div key={image.id}>
                        <HorizontalImageCard image={image} />
                        </div>
                    )
                    })
                }
            </div>

            <div className="userPrivateContents_contentNotFilled horizontalVideo">
                <h2>Videos chưa hoàn tất thiết lập</h2>
                {notDoneVideos.length == 0 && [<p>Không có nội dung nào tại đây cả...</p>]}
                {
                    notDoneVideos.map(video => {
                    return(
                        <div key={video.vid}>
                            <HorizontalVideoCard video={video} />
                        </div>
                    )
                    })
                }
            </div>

            <div className="userPrivateContents_contentNotFilled horizontalImage">
                <h2>Hình ảnh chưa hoàn tất thiết lập</h2>
                {notDoneImages.length == 0 && [<p>Không có nội dung nào tại đây cả...</p>]}
                {
                    notDoneImages.map(image => {
                    return(
                        <div key={image.vid}>
                            <HorizontalImageCard image={image} />
                        </div>
                    )
                    })
                }
            </div>
        </div>
    )
}

export default UserPrivateContents