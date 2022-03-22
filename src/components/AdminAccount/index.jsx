import React, { useState } from 'react'
import "./style_adminAccount.scss"
import FormInput from "../Forms/FormInput"
import Button from '../Forms/Button'
import { firestore, storage } from '../../firebase/utils'
import { Avatar } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { getAuth, deleteUser } from "firebase/auth";
import { deleteObject } from 'firebase/storage'
import { useSelector } from 'react-redux'
import Alert from './Alert'

const mapState = state => ({
  currentUser: state.user.currentUser,
})

function AdminAccount() {
  const { currentUser } = useSelector(mapState);
  const [searchWithId, setSearchWithId] = useState(false)
  const [searchWithDisplayName, setSearchWithDisplayName] = useState(false)
  const [searchId, setSearchId] = useState("")
  const [searchDisplayName, setSearchDisplayName] = useState("")
  const [searchData, setSearchData] = useState([])

  const onKeyDownHandler = e => {
    if (e.keyCode === 13) {
      var someArray = []
      firestore.collection("users").doc(searchId).get().then(snapshot => {
        try{
          someArray = ([...someArray,{
            id: snapshot.id,
            displayName: snapshot.data().displayName,
            avatar: snapshot.data().avatar,
            follow: snapshot.data().follow,
          }])
        
          setSearchData(someArray)
        }catch(err){
          setSearchData(someArray)
        }
      })
    }
  };

  const onKeyDownHandler2 = e => {
    if (e.keyCode === 13) {
      firestore.collection("users").where("displayName", "==", searchDisplayName).get().then(snapshot => {
        try{
          setSearchData(snapshot.docs.map(doc => ({
            id: doc.id,
            displayName: doc.data().displayName,
            avatar: doc.data().avatar,
            follow: doc.data().follow,
            })
            
          ))
        } catch(err) {
          
        }
      })
    }
  };

  const handleDelete = async (id) => {
    // deleteVideo(id)
    // deleteImage(id)
    // deleteComment(id)
    // deleteContentStatus(id)
    // deleteAccount(id)
    try{
      let results = await Promise.all([
        deleteVideo(id), 
        deleteImage(id), 
        deleteComment(id),
        deleteContentStatus(id),
        deleteTiers(id),
        handleAddDeleteLog(id),
        deleteAccount(id)
      ])
      setSearchData([])
      return alert("Hoàn tất!!!!")
    } catch (err) {

    }
  }

  const deleteAccount = (id) => { 
    
    // firestore.collection("users").doc(id).set({
    //   follow: [],
    //   userRoles: ["user", "blocked"],
    //   avatar: "",
    // }, { merge: true })

    firestore.collection("users").doc(id).delete()

    // const auth = getAuth();
    // const user = auth.currentUser;
    
    // deleteUser(user).then(() => {
    //   alert("done")
    // }).catch((error) => {
    //   console.log(error)
    // });
  }

  const handleAddDeleteLog = (id) => {
    var timestamp = new Date();
    firestore.collection("adminDeleteLog").add({
      userAdminUID: currentUser.id,
      deleteUserId: id,
      timestamp: timestamp,
    })
  }

  const deleteVideo = (id) => {
    var video = firestore.collection('videos').where('videoAdminUID', '==', id);

    
    video.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          // doc.ref.delete()
          try {
            handleDeleteStorage(doc.data().sourceLink, doc.data().thumbnail)
            doc.ref.delete()
            // doc.ref.set({
            //   sourceLink: "",
            //   thumbnail: "",
            //   tags: "",
            //   titleForSearch: "",
            //   views: "",
            //   desc: "",
            //   privacy: "blocked",
            // }, { merge: true });
          } catch (error) {
            
          }
      })
    
    })
  }

  const deleteImage = (id) => {
    var image = firestore.collection('images').where('imageAdminUID', '==', id);

    
    image.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          // doc.ref.delete()
          try {
            handleDeleteStorage(doc.data().sourceLink)
            doc.ref.delete()
            // doc.ref.set({
            //   sourceLink: "",
            //   tags: "",
            //   desc: "",
            //   privacy: "blocked",
            // }, { merge: true });
          } catch (error) {
            
          }
      })
    
    })
  }

  const deleteComment = (id) => {
    var comment = firestore.collection('comments').where('uid', '==', id);

    
    comment.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        try {
          doc.ref.delete()
        } catch (error) {
          
        }
      })
    
    })
  }

  const deleteContentStatus = (id) => {
    var contentStat = firestore.collection('contentStatus').where('userId', '==', id);

    
    contentStat.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        try {
          doc.ref.delete()
        } catch (error) {
          
        }
      })
    
    })
  }

  const deleteTiers = (id) => {
    var contentStat = firestore.collection('tiers').where('uid', '==', id);

    
    contentStat.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        try {
          doc.ref.delete()
        } catch (error) {
          
        }
      })
    
    })
  }

  // i will do it later if  i have time but im not :)
  // const deleteFollow = (id) => {

  // }

  // const handleDeleteStorageVideo = (id) => {
  //   var something = [];

  //   firestore.collection("videos").where("videoAdminUID", "==", id).get().then(snapshot => {
  //     something = snapshot.docs.map(doc => [...something, ({
  //       sourceLink: doc.data().sourceLink,
  //       })]
  //     )
  //   })

  //   console.log(something)
  //   // var desertRef = storage.refFromURL(props.video.sourceLink);

  //   // deleteObject(desertRef).then(() => {
        
  //   // }).catch((error) => {
  //   //     console.log(error)
  //   // });
    
  //   // const storageRef = storage.ref(`videos/${id}_videos`);
  //   // storageRef.listAll().then((listResults) => {
  //   //   const promises = listResults.items.map((item) => {
  //   //     return item.delete();
  //   //   });
  //   //   Promise.all(promises);
  //   // });  

  // }

  // const handleDeleteStorageImage = (id) => {
    
  //   const storageRef = storage.ref(`images/${id}_images`);
  //   storageRef.listAll().then((listResults) => {
  //     const promises = listResults.items.map((item) => {
  //       return item.delete();
  //     });
  //     Promise.all(promises);
  //   });  

  // }

  // const handleDeleteStorageThumbnail = (id) => {
    
  //   const storageRef = storage.ref(`thumbnails/${id}_thumbnails`);
  //   storageRef.listAll().then((listResults) => {
  //     const promises = listResults.items.map((item) => {
  //       return item.delete();
  //     });
  //     Promise.all(promises);
  //   });  

  // }

  const handleDeleteStorage = (arr, thArr) => {
    if(Array.isArray(arr)){
      arr.map(ar => {
        var desertRef = storage.refFromURL(ar);

        deleteObject(desertRef).then(() => {
            
        }).catch((error) => {
            console.log(error)
        });
      })
    } 
    
    else {
      var desertRef = storage.refFromURL(arr);

      deleteObject(desertRef).then(() => {
          
      }).catch((error) => {
          console.log(error)
      });

      if(thArr !== ''){
          var desertRef2 = storage.refFromURL(thArr);

          deleteObject(desertRef2).then(() => {
              
          }).catch((error) => {
              console.log(error)
          });
      }
    }

  }

  return (
    <div className='adminAccount'>
      Tìm kiếm bằng:
      <div className='adminAccount_displayTopButton'>
        <Button onClick={() => setSearchWithId(!searchWithId)}>
          Id
        </Button>
        <Button onClick={() => setSearchWithDisplayName(!searchWithDisplayName)}>
          Tên người dùng
        </Button>
      </div>

      {searchWithId && [
        <FormInput 
          type="text"
          placeholder="Nhập id tài khoản bạn muốn tương tác"        
          label="Tìm kiếm bằng Id"
          onKeyDown={onKeyDownHandler}
          onChange={(e) => setSearchId(e.target.value)}
        />
      ]}

      {searchWithDisplayName && [
        <FormInput 
          type="text"
          placeholder="Nhập tên người dùng bạn muốn tương tác"        
          label="Tìm kiếm bằng tên người dùng"
          onKeyDown={onKeyDownHandler2}
          onChange={(e) => setSearchDisplayName(e.target.value)}
        />
      ]}

      {searchData.map(sd => {
        return(
          <div key={sd.id} className="adminAccount_displaySearchData">
            <div className='adminAccount_infoContainer'>
              <Avatar />
              <div className='adminAccount_infoContainer_displayName'>
                {sd.displayName}
              </div>
            </div>
            <div>
              id: {sd.id}
            </div>
            <div className="adminAccount_buttonContainer">
              
              <Button>
                <Link to={`/user/${sd.id}`} target="_blank">
                  Xem trang cá nhân
                </Link>
              </Button>

              <Alert sd={sd} handleDelete={handleDelete} />
              
              {/* <Button onClick={() => handleDelete(sd.id)}>
                Xóa
              </Button> */}
            </div>
          </div>
        )
      })}


    </div>
  )
}

export default AdminAccount