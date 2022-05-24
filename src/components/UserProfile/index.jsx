import { Avatar } from '@material-ui/core';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { firestore, storage } from '../../firebase/utils';
import './style_UserProfile.scss';
import EditIcon from '@material-ui/icons/Edit';
import Button from '../Forms/Button';
import FormInput from '../Forms/FormInput';
import { deleteObject } from 'firebase/storage';
import {arrayUnion, arrayRemove} from "firebase/firestore"
import { Link } from 'react-router-dom';

const mapState = ({ user }) => ({
  currentUser: user.currentUser
})

const UserProfile = props => {
  const {currentUser} = useSelector(mapState)
  const { userID } = props;
  const [userInfo, setUserInfo] = useState(false)
  const [show, setShow] = useState(false)
  const [follow, setFollow] = useState(false)
  const [fileImageUrl, setFileImageUrl] = useState('');
  const [images, setImages] = useState([]);
  const [displayName, setDisplayName] = useState("")
  const [progressAvatar, setProgressAvatar] = useState(0);
  

  useEffect(() => {
    firestore.collection("users").doc(userID).get().then((snapshot) => {
      setUserInfo({
        userId: snapshot.id,
        displayName: snapshot.data().displayName,
        avatar: snapshot.data().avatar,
        follow: snapshot.data().follow,
      })
    })
  },[userID])  
  
  useEffect(() => {
    if(userInfo){
      writeInfo()
    }
  },[userInfo])

  useEffect(() => { //===================THIS USE EFFECT FOR UPLOADING THUMBNAIL
    const promises = [];
    if(images == '') return
    const number = Math.random();
    images.map((image) => {
      if(image.size > 10e6) {
        alert('file của bạn đã vượt quá 10MB xin hãy chọn file khác')
        return
      }
      const name = images[0].name
      const uploadTask = storage.ref(`avatars/${currentUser.id}_avatars/${name}_${number}/${image.name}`).put(image);
      promises.push(uploadTask);
      uploadTask.on(
      "state_changed",
      (snapshot) => {
          const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgressAvatar(progress);
      },
      (error) => {
          console.log(error);
      },
      async () => {
          await storage
          .ref(`avatars/${currentUser.id}_avatars/${name}_${number}`)
          .child(image.name)
          .getDownloadURL()
          .then((urls) => {
              var sourceThumbnail = urls
              setFileImageUrl(sourceThumbnail)
          });
      }
      );
    });
    
    Promise.all(promises)
        .then(() => 

    console.log(fileImageUrl),
    setProgressAvatar(0)
    

    ).catch((err) => console.log(err));
  }, [images])

  useEffect(() => {
    if(fileImageUrl == '') {
      setProgressAvatar(0)
    }
  }, [fileImageUrl])

  const writeInfo = () => {
    setDisplayName(userInfo.displayName)
    if(currentUser) {
      checkFollow()
    }
  }

  const checkFollow = () => {
    if(currentUser && currentUser.id !== userID){
        // Put the id of currentUser into the follow array
        const someArray = userInfo.follow
        const found = someArray.find(element => element == currentUser.id);
        if(!found){
            setFollow(false)
        }

        if(found){
            setFollow(true)
        }
    }
  }

  const handleFollow = () => {
    if(currentUser && currentUser.id !== userID){
        
        const someArray = userInfo.follow
        const found = someArray.find(element => element == currentUser.id);
        if(!found){
            
            firestore.collection('users').doc(userID).set({
                follow: arrayUnion(currentUser.id)
            }, { merge: true })
            fetchData()
        }

        if(found){
            

            firestore.collection('users').doc(userID).set({
                follow: arrayRemove(currentUser.id)
            }, { merge: true })
            fetchData()
        }
    }
  }


  const fetchData = () => {
    firestore.collection("users").doc(userID).get().then((snapshot) => {
      setUserInfo({
        userId: snapshot.id,
        displayName: snapshot.data().displayName,
        avatar: snapshot.data().avatar,
        follow: snapshot.data().follow,
      })
    })
  }

  const handleChangeFileImage = (e) => {
    for (let i = 0; i < e.target.files.length; i++) {
        const newImage = e.target.files[i];
        newImage["id"] = Math.random();
        setImages((prevState) => [newImage])
    }
  }

  const handleDeleteAvatar = (url) => {
    var desertRef = storage.refFromURL(url);

    deleteObject(desertRef).then(() => {
        setFileImageUrl('')
    }).catch((error) => {
        console.log(error)
    });

  }

  const handleCancel = () => {
    if(fileImageUrl !== "") {
      handleDeleteAvatar(fileImageUrl)
    }
    setShow(!show)
  }

  const reset = () => {
    setFileImageUrl('')
    setShow(!show)
  }

  const handleChange = () => {
    if(displayName == ""){
      alert("Tên tài khoản không được để trống")
      return
    }

    if(userInfo && userInfo.avatar !== "" && fileImageUrl !== ""){
      firestore.collection('users').doc(currentUser.id).set({
        displayName: displayName,
        avatar: fileImageUrl,
        
      }, { merge: true }).then(
        handleDeleteAvatar(userInfo.avatar)
      )
    }

    if(userInfo && userInfo.avatar == "" && fileImageUrl !== ""){
      firestore.collection('users').doc(currentUser.id).set({
        displayName: displayName,
        avatar: fileImageUrl,
        
      }, { merge: true }).then(
        
      )
    }

    if(fileImageUrl == ""){
      firestore.collection('users').doc(currentUser.id).set({
        displayName: displayName,
        
      }, { merge: true }).then(
        
      )
    }

    fetchData()
    reset()
  }

  return (
    <div className="userProfile">
      <ul>
        <li>
          <div className="img">
            <Avatar className='img-avatar' src={userInfo ? userInfo.avatar : null} />
          </div>
        </li>
        <li>
          <span className="displayName">
            {userInfo ? userInfo.displayName : null}
          </span>
        </li>
        {currentUser && currentUser.id == userInfo.userId ? 
        <li>
          <span className="displayEdit">
            <div className='displayEdit-container' onClick={() => setShow(!show)}>
              <EditIcon className='displayEdit-icon' />
            </div>
          </span>
          
          <div className={show ? "tableShow active" : "tableShow"}>
            <h2>
                Chỉnh sửa
            </h2>
            <FormInput
              label="Tên tài khoản"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            <div className='userProfile-editAvatar-container'>
              {progressAvatar > 0 ?
                  <progress value={progressAvatar} max="100" /> 
                  :
                      <FormInput 
                          label="Hình đại diện"
                          type="file"
                          accept="image/*"
                          handleChange={handleChangeFileImage}
                      />
              }    
              
              {fileImageUrl == '' ? null : 
                  <>
                      <div className='avatarPreview'> 
                          <Avatar className='avatarPreview-avatar' src={fileImageUrl} /> 
                          <span onClick={() => handleDeleteAvatar(fileImageUrl)}>x</span>
                      </div>
                  </>
              }
            </div>
            <p>Hãy nhấn nút xác nhận để thực hiện thao tác, hoặc nhấn hủy để hủy bỏ thao tác</p>
            
            <div className='button_flex'>
            <Button onClick={() => handleChange()}>
                Xác nhận
            </Button>
            <Button onClick={() => handleCancel()}>
                Hủy
            </Button>
            </div>
          </div>
        </li> : null}

        <li>
          <span className="follow">
            <Link to={`/user/follower/${userID}`}>{userInfo ? userInfo.follow.length : null} lượt theo dõi</Link> {currentUser ? 
              <span onClick={() => handleFollow()} className="followButton">
                {!follow ? "+ Theo dõi" : "- Bỏ theo dõi"}
              </span>
              : null }
          </span>
        </li>
      </ul>
    </div>
  );
}

export default UserProfile;