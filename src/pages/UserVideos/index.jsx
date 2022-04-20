import React, { useState } from 'react'
import { useEffect } from 'react'
// import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import HorizontalVideoCard from '../../components/HorizontalVideoCard'
import { firestore } from '../../firebase/utils'

import "./style_userVideos.scss"

// const mapState = ({ user }) => ({
//   currentUser: user.currentUser
// })

function UserVideos() {
  // const {currentUser} = useSelector(mapState)
  const { userID } = useParams()
  const [videos, setVideos] = useState([])

  useEffect(() => {
    
    firestore.collection("videos").where("videoAdminUID", "==", userID).where("privacy", "==", "public").onSnapshot((snapshot) => {
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
   
  }, [userID])

  return (
    <div className='horizontalVideo'>
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
  )
}

export default UserVideos