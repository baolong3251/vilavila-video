import React, { useState } from 'react'
import { useEffect } from 'react'
// import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import HorizontalImageCard from '../../components/HorizontalImageCard'
import { firestore } from '../../firebase/utils'

import "./style_userImages.scss"

// const mapState = ({ user }) => ({
//   currentUser: user.currentUser
// })

function UserImages() {
  // const {currentUser} = useSelector(mapState)
  const { userID } = useParams()
  const [images, setImages] = useState([])

  useEffect(() => {
    
    firestore.collection("images").where("imageAdminUID", "==", userID).orderBy("createdDate", "desc").where("privacy", "==", "public").onSnapshot((snapshot) => {
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
   
  }, [userID])

  return (
    <div className='horizontalImage'>
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
  )
}

export default UserImages