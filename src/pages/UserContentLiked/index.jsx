import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { firestore } from '../../firebase/utils'
import ContentLiked from './ContentLiked'
import "./style_userContentLiked.scss"

const mapState = state => ({
  video: state.videosData.video,
  currentUser: state.user.currentUser,
})

function UserContentLiked() {
  const { userID } = useParams()
  const [contentStatus, setContentStatus] = useState([])
  const { currentUser } = useSelector(mapState);

  useEffect(() => {
        
    firestore.collection("contentStatus").where("userId", "==", userID).where("liked", "==", "true").orderBy("likedDate", "desc").onSnapshot((snapshot) => {
      try {
        setContentStatus(snapshot.docs.map(doc => ({
          id: doc.id, 
          liked: doc.data().liked,
          reported: doc.data().reported,
          saved: doc.data().saved,
          userId: doc.data().userId,
          contentId: doc.data().contentId,
        })))
      } catch (error) {
        
      }
    })
   
  }, [userID])

  if(!currentUser) return (<h2>Có vẻ bạn đã đến nhầm chỗ rồi thì phải...</h2>)

  if(currentUser && currentUser.id !== userID) return (<h2>Có vẻ bạn đã đến nhầm chỗ rồi thì phải...</h2>)

  return (
    <div className="userLikedContents">
      
      <div className="userLikedContents_videos horizontalVideo">
          <h2>Nội dung đã thích</h2>
          {contentStatus.map(content => {
            return(
              <ContentLiked key={content.id} content={content} />
            )
          })}
      </div>

    </div>
  )
}

export default UserContentLiked