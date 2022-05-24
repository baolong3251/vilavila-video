import { Avatar } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { firestore } from '../../firebase/utils'
import "./style_UserFollowings.scss"

function UserFollowings() {

  const {userID} = useParams()
  const [users, setUsers] = useState([])

  useEffect(() => {
    firestore.collection("users").where("follow", "array-contains", userID).get().then((snapshot) => {
      try {
        setUsers(snapshot.docs.map(doc => ({
          id: doc.id, 
          displayName: doc.data().displayName,
          avatar: doc.data().displayName,
          follow: doc.data().follow,
          email: doc.data().email,
        })))
      } catch (error) {
        
      }
    })
  }, [])


  return (
    <div className='userFollowing'>
      <h2>
        Kênh theo dõi
      </h2>
      {users.length > 0 ? 
        users.map(user => {
          return(
            <div className='userFollowing-container'>
              
              <div className='userFollowing-showName'>
                <div className='userFollowing-showName-item'>
                  <Avatar src={user.avatar} />
                </div>
                <div className='userFollowing-showName-item'>
                  {user.displayName}
                </div>
              </div>
              <div className='userFollowing-item'>
                {user.email}
              </div>
              <div className='userFollowing-item'>
                Lượt theo dõi: {user.follow.length}
              </div>
              <div className="userFollowing-item">
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

export default UserFollowings