import { Avatar } from '@material-ui/core';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { firestore } from '../../firebase/utils';
import './style_UserProfile.scss';

const UserProfile = props => {
  const { userID } = props;
  const [userInfo, setUserInfo] = useState([])

  useEffect(() => {
    firestore.collection("users").doc(userID).get().then((snapshot) => {
      setUserInfo({
        userId: snapshot.id,
        displayName: snapshot.data().displayName,
        thumbnail: snapshot.data().thumbnail,
      })
    })
  },[userID])  

  return (
    <div className="userProfile">
      <ul>
        <li>
          <div className="img">
            <Avatar src={userInfo ? userInfo.thumbnail : null} />
          </div>
        </li>
        <li>
          <span className="displayName">
            {userInfo ? userInfo.displayName : null}
          </span>
        </li>
      </ul>
    </div>
  );
}

export default UserProfile;