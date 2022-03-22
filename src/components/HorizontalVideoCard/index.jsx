import React, { useEffect, useState } from 'react'
import ReactPlayer from 'react-player'
import { Link } from 'react-router-dom'
import { firestore, storage } from '../../firebase/utils'
import moment from 'moment'
import 'moment/locale/vi';
import "./style_horizontalVideoCard.scss"
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import AlertModal from '../AlertModal'
import { useSelector } from 'react-redux'
import Button from '../Forms/Button'
import { deleteObject } from 'firebase/storage'
import VideoThumbnail from 'react-video-thumbnail'


const mapState = ({ user }) => ({
    currentUser: user.currentUser
  })

function HorizontalVideoCard(props) {
    const [channel, setChannel] = useState([])
    const {currentUser} = useSelector(mapState)
    const [hideModal, setHideModal] = useState(true)
    const toggleModal = () => setHideModal(!hideModal);
    const [tiers, setTiers] = useState()
    const [thumb, setThumb] = useState('')

    const configModal = {
        hideModal,
        toggleModal
    }

    useEffect(() => {
        if (props.video.videoAdminUID && channel.length == 0) {
            firestore.collection("users").doc(props.video.videoAdminUID).onSnapshot((snapshot) => {
                try {
                    setChannel([...channel,{
                        displayName: snapshot.data().displayName,
                        avatar: snapshot.data().avatar,
                        follow: snapshot.data().follow,
                    }])
                } catch (error) {
                    
                }
            }) 
        }
    }, [props.video.videoAdminUID])

    useEffect(() => {
        if(currentUser){
            firestore.collection('tiers').where('userSigned', 'array-contains', currentUser.id).where('uid', '==', props.video.videoAdminUID).onSnapshot(snapshot => {
                setTiers(snapshot.docs.map(doc => ({
                  id: doc.id, 
                  uid: doc.data().uid,
                  tier: doc.data().tier,
                  cost: doc.data().cost,
                  desc: doc.data().desc,
                  userSigned: doc.data().userSigned,
                })
              ))
            })
          }
    }, [currentUser])

    //=========================================SOME THING FOR THE THUMBNAIL

    // useEffect(() => {
    //     changeIntoThumb()
    // }, [props.video.sourceLink])

    // async function getThumbnailForVideo(videoUrl) {
    //     const video = document.createElement("video");
    //     const canvas = document.createElement("canvas");
    //     video.style.display = "none";
    //     canvas.style.display = "none";
      
    //     // Trigger video load
    //     await new Promise((resolve, reject) => {
    //       video.addEventListener("loadedmetadata", () => {
    //         video.width = video.videoWidth;
    //         video.height = video.videoHeight;
    //         canvas.width = video.videoWidth;
    //         canvas.height = video.videoHeight;
    //         // Seek the video to 25%
    //         video.currentTime = video.duration * 0.25;
    //       });
    //       video.addEventListener("seeked", () => resolve());
          
    //       video.src = videoUrl;
    //     });

    //     console.log(videoUrl)
      
    //     // Draw the thumbnailz
    //     canvas
    //       .getContext("2d")
    //       .drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    //     const imageUrl = canvas.toDataURL('image/png');
    //     console.log(imageUrl)
    //     return imageUrl;
    //   }
      
      // Set up application
    //  const img = document.querySelector("#img-thumb");
    //   const fileInput = document.querySelector("#input-video-file");
      
    //   fileInput.addEventListener("change", async e => {
    //     const [file] = e.target.files;
    //     const fileUrl = URL.createObjectURL(file);
    //     const thumbUrl = await getThumbnailForVideo(fileUrl);
    //     img.src = thumbUrl;
    //   });

    //   const changeIntoThumb = async () => {
    //     const fileUrl = props.video.sourceLink;
    //     const thumbUrl = await getThumbnailForVideo(fileUrl);
    //     setThumb(thumbUrl);
    //   }

    //=========================================THE DELETING THING

    const handleDelete = () => {
        var video = firestore.collection('contentStatus').where('contentId', '==', props.video.vid);
        var comment = firestore.collection('comments').where('videoId', '==', props.video.vid);
        
        video.get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                doc.ref.delete();
            });
        })

        comment.get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                doc.ref.delete();
            });
        })

        handleDeleteStorage()
        toggleModal()
    }

    const handleDeleteStorage = () => {
        var desertRef = storage.refFromURL(props.video.sourceLink);

        deleteObject(desertRef).then(() => {
            
        }).catch((error) => {
            console.log(error)
        });

        if(props.video.thumbnail !== ''){
            var desertRef2 = storage.refFromURL(props.video.thumbnail);

            deleteObject(desertRef2).then(() => {
                
            }).catch((error) => {
                console.log(error)
            });
        }
    }

    //=====================================END THE DELETING THING

    // if (props.video.tier !== "") return(
    //     <div className='horizontalVideoCard userVideos-videoCard tier-thing'>
    //         Something
    //     </div>
    // )


    return (
        <div className='horizontalVideoCard userVideos-videoCard'>

            {props.video.tier !== "" ? 
            tiers ?
                 props.video.tier !== tiers[0].tier ?
                <div className='tier-thing'>
                    {props.video.tier}
                </div> : null
            :   <div className='tier-thing'>
                    {props.video.tier}
                </div>
            : null
            }

            <Link to={
                props.video.tier == "" ? `/video/${props.video.vid}` : 
                tiers ? props.video.tier !== tiers[0].tier ? 
                `../${props.video.videoAdminUID}` : `/video/${props.video.vid}` :
                `../${props.video.videoAdminUID}`} 
                className='horizontalVideoCard_videoCardsThumbnail'>
                {props.video.thumbnail !== '' ? <img className='videoCards_img' src={props.video.thumbnail} />
                :
                <div className='thing'>
                    <div className='thing-thing'>
                    
                    </div>
                {/* <ReactPlayer 
                    className="react-player"
                    url={props.video.sourceLink} 
                    width="100%"
                    height="100%"
                /> */}

                {/* <img className='videoCards_img' src={thumbnail} crossorigin/> */}
                
                <div className='hideVideoThumbnail'>
                    <VideoThumbnail
                        videoUrl={props.video.sourceLink} 
                        thumbnailHandler={(thumbnail) => setThumb(thumbnail)}
                        // width={2000}
                        // height={1100}
                        // snapshotAtTime={5}
                        crossorigin
                    />
                </div>

                <img className='videoCards_img' src={thumb} />

                </div>
                }
            </Link>
            <div className='horizontalVideoCard_videoCardsInfo'>
                <div className="horizontalVideoCard_text">
                    <Link to={props.video.tier == "" ? `/video/${props.video.vid}` : 
                            tiers ? props.video.tier !== tiers[0].tier ? 
                            `../${props.video.videoAdminUID}` : `/video/${props.video.vid}` :
                            `../${props.video.videoAdminUID}`}>
                        <h4>{props.video.title}</h4>
                    </Link>

                    <Link to={props.video.tier == "" ? `/video/${props.video.vid}` : 
                                tiers ? props.video.tier !== tiers[0].tier ? 
                                `../${props.video.videoAdminUID}` : `/video/${props.video.vid}` :
                                `../${props.video.videoAdminUID}`} 
                                className="horizontalVideoCard_desc">
                        <p style={{whiteSpace: "pre-line"}}>{props.video.desc}</p>
                    </Link>
                    
                    <Link to={`/user/${props.video.videoAdminUID}`}>
                        <p>{channel.length > 0 ? channel[0].displayName : null}</p>
                    </Link>
                    <p>
                        {new Intl.NumberFormat('vi-VN', {
                        notation: "compact",
                        compactDisplay: "short"
                        }).format(props.video.views)} lượt xem • {moment(props.video.createdDate.toDate()).locale('vi').fromNow()}
                    </p>
                </div>
            </div>

            {
                currentUser && currentUser.id == props.video.videoAdminUID && [
                  <>
                  <div className='userVideos-videoCard-edit-option'>
                      <Link to={`/user/${props.video.videoAdminUID}/edit/${props.video.vid}`} className='userVideos-videoCard-edit-option-item'>
                          <EditIcon className='icon' />
                      </Link>
                      <div onClick={() => toggleModal()} className='userVideos-videoCard-edit-option-item'>
                          <DeleteForeverIcon className='icon' />
                      </div>
                  </div>
                  
                  <AlertModal {...configModal}>
                    <h2>
                        Xác nhận
                    </h2>
                    <p>
                        Bạn chắc chắn là sẽ xóa video này chứ?
                    </p>
                    <div className='flex-thing'>
                        <Button onClick={() => toggleModal()}>
                            Hủy
                        </Button>
                        <Button onClick={() => firestore
                                        .collection('videos')
                                        .doc(props.video.vid)
                                        .delete()
                                        .then( handleDelete ) }>
                            Xác nhận
                        </Button>
                    </div>
                  </AlertModal>
                  </>
                ]
              }
        </div>
    )
}

export default HorizontalVideoCard