import { Avatar } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { firestore } from '../../firebase/utils'
import "./style_UserFollowers.scss"

const mapState = ({ videosData }) => ({
  videos: videosData.videos
})

function UserFollowers() {
  
  const { currentUser } = useSelector(mapState);
  const {userID} = useParams()
  const [followers, setFollowers] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    firestore.collection("users").doc(userID).get().then((snapshot) => {
      try {
        setFollowers([{
          id: snapshot.id, 
          displayName: snapshot.data().displayName,
          avatar: snapshot.data().displayName,
          follow: snapshot.data().follow,
          email: snapshot.data().email,
        }])
      } catch (error) {
        
      }
    })
  }, [])

  useEffect(() => {
    if(followers.length > 0){
      
      followers[0].follow.map(fl => {
        firestore.collection("users").doc(fl).get().then((snapshot) => {
          try {
            setUsers((prevState) => [...prevState,{
              id: snapshot.id, 
              displayName: snapshot.data().displayName,
              avatar: snapshot.data().displayName,
              follow: snapshot.data().follow,
              email: snapshot.data().email,
            }])
          } catch (error) {
            
          }
        })
      })
    }
  }, [followers])
  
  return (
    <div className='userFollowers'>
      <h2>
        Fan của tôi
      </h2>
      {users.length > 0 ? 
      users.map(user => {
        return(
          <div className='userFollowers-container'>
            
            <div className='userFollowers-showName'>
              <div className='userFollowers-showName-item'>
                <Avatar src={user.avatar} />
              </div>
              <div className='userFollowers-showName-item'>
                {user.displayName}
              </div>
            </div>
            <div className='userFollowers-item'>
              {user.email}
            </div>
            <div className='userFollowers-item'>
              Lượt theo dõi: {user.follow.length}
            </div>
            <div className="userFollowers-item">
              <Link to={`/user/${user.id}`} target={"_blank"}>
                Xem trang cá nhân
              </Link>
            </div>
          </div>
        ) 
      }) 
      
      : null}
    </div>
  )
}

export default UserFollowers