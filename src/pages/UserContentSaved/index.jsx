import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { firestore } from '../../firebase/utils'
import ContentSaved from './ContentSaved'
import "./style_userContentSaved.scss"

const mapState = state => ({
  video: state.videosData.video,
  currentUser: state.user.currentUser,
})

function UserContentSaved() {
  const { userID } = useParams()
  const [contentStatus, setContentStatus] = useState([])
  const { currentUser } = useSelector(mapState);

  useEffect(() => {
        
    firestore.collection("contentStatus").where("userId", "==", userID).where("saved", "==", "true").orderBy("savedDate", "desc").onSnapshot((snapshot) => {
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
    <div className="userSavedContents">
      
      <div className="userSavedContents_videos horizontalVideo">
          <h2>Nội dung đã lưu</h2>
          {contentStatus.map(content => {
            return(
              <ContentSaved key={content.id} content={content} />
            )
          })}
      </div>

    </div>
  )
}

export default UserContentSaved