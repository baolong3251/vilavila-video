import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { firestore, storage } from '../../firebase/utils'
import moment from 'moment'
import 'moment/locale/vi';
import "./style_horizontalImageCard.scss"
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import AlertModal from '../AlertModal'
import { useSelector } from 'react-redux'
import Button from '../Forms/Button'
import { deleteObject } from 'firebase/storage'


const mapState = ({ user }) => ({
    currentUser: user.currentUser
  })

function HorizontalImageCard(props) {
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
        if (props.image.imageAdminUID && channel.length == 0) {
            firestore.collection("users").doc(props.image.imageAdminUID).onSnapshot((snapshot) => {
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
    }, [props.image.imageAdminUID])

    useEffect(() => {
        if(currentUser){
            firestore.collection('tiers').where('userSigned', 'array-contains', currentUser.id).where('uid', '==', props.image.imageAdminUID).onSnapshot(snapshot => {
                try {
                    setTiers(snapshot.docs.map(doc => ({
                        id: doc.id, 
                        uid: doc.data().uid,
                        tier: doc.data().tier,
                        cost: doc.data().cost,
                        desc: doc.data().desc,
                        userSigned: doc.data().userSigned,
                      })
                    ))
                } catch (error) {
                    
                }
            })
          }
    }, [currentUser])

    //=========================================THE DELETING THING

    const handleDelete = () => {
        var image = firestore.collection('contentStatus').where('contentId', '==', props.image.id);
        var comment = firestore.collection('comments').where('imageId', '==', props.image.id);
        
        image.get().then(function(querySnapshot) {
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
        var arr = props.image.sourceLink;
        if(Array.isArray(arr)){
            arr.map(ar => {
              var desertRef = storage.refFromURL(ar);
      
              deleteObject(desertRef).then(() => {
                  
              }).catch((error) => {
                  console.log(error)
              });
            })
        }
    }

    //=====================================END THE DELETING THING

    // if (props.video.tier !== "") return(
    //     <div className='horizontalVideoCard userVideos-videoCard tier-thing'>
    //         Something
    //     </div>
    // )


    return (
        <div className='horizontalImageCard userImages-imageCard'>

{ 
            props.image.tier !== "" ? 
            currentUser ? currentUser.id !== props.image.imageAdminUID ?
            tiers ?
                tiers.length !== 0 ?
                 props.image.tier > tiers[0].tier ?
                <div className='tier-thing'>
                    C???p b???c {props.image.tier.slice(4)}
                </div> : null
                :   <div className='tier-thing'>
                        C???p b???c {props.image.tier.slice(4)}
                    </div> 
            : <div className='tier-thing'>
                C???p b???c {props.image.tier.slice(4)}
            </div>
            : null
            : <div className='tier-thing'>
                C???p b???c {props.image.tier.slice(4)}
            </div>
            : null
            
            }

            <Link to={
                props.image.tier == "" ? `/image/${props.image.id}` : currentUser ? currentUser.id !== props.image.imageAdminUID ?
                tiers ? tiers.length !== 0 ? props.image.tier > tiers[0].tier ? 
                `../${props.image.imageAdminUID}` : `/image/${props.image.id}` :
                `../${props.image.imageAdminUID}` : `../${props.image.imageAdminUID}` : `/image/${props.image.id}` : `../${props.image.imageAdminUID}`} 
                className='horizontalImageCard_imageCardsThumbnail'>
    
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
                
            

                <img className='imageCards_img' src={props.image.sourceLink[0]} />

                </div>
                
            </Link>
            <div className='horizontalImageCard_imageCardsInfo'>
                <div className="horizontalImageCard_text">
                    <Link to={props.image.tier == "" ? `/image/${props.image.id}` : currentUser ? currentUser.id !== props.image.imageAdminUID ?
                            tiers ? tiers.length !== 0 ? props.image.tier > tiers[0].tier ? 
                            `../${props.image.imageAdminUID}` : `/image/${props.image.id}` :
                            `../${props.image.imageAdminUID}` : `../${props.image.imageAdminUID}` : `/image/${props.image.id}` : `../${props.image.imageAdminUID}`}>
                        <h4>{props.image.title == "" && props.image.privacy == "not-done" ? "Ch??a c?? t???a ?????" : props.image.title}</h4>
                    </Link>

                    <Link to={props.image.tier == "" ? `/image/${props.image.id}` : currentUser ? currentUser.id !== props.image.imageAdminUID ?
                            tiers ? tiers.length !== 0 ? props.image.tier > tiers[0].tier ? 
                            `../${props.image.imageAdminUID}` : `/image/${props.image.id}` :
                            `../${props.image.imageAdminUID}` : `../${props.image.imageAdminUID}` : `/image/${props.image.id}` : `../${props.image.imageAdminUID}`} 
                                className="horizontalImageCard_desc">
                        <p style={{whiteSpace: "pre-line"}}>{props.image.desc == "" && props.image.privacy == "not-done" ? "Ph???n m?? t??? ch??a thi???t l???p" : props.image.desc}</p>
                    </Link>
                    
                    <Link to={`/user/${props.image.imageAdminUID}`}>
                        <p>{channel.length > 0 ? channel[0].displayName : null}</p>
                    </Link>
                    <p>
                        {props.image.createdDate ? moment(props.image.createdDate.toDate()).locale('vi').fromNow() : null}
                    </p>
                </div>
            </div>

            {
                currentUser && currentUser.id == props.image.imageAdminUID && [
                  <>
                  <div className='userImages-imageCard-edit-option'>
                      <Link to={`/user/${props.image.imageAdminUID}/editImage/${props.image.id}`} className='userImages-imageCard-edit-option-item'>
                          <EditIcon className='icon' />
                      </Link>
                      <div onClick={() => toggleModal()} className='userImages-imageCard-edit-option-item'>
                          <DeleteForeverIcon className='icon' />
                      </div>
                      {props.image.tier !== "" ? 
                        <div className='userImages-imageCard-edit-option-item'>
                            {props.image.tier.slice(4)}
                        </div>
                        : null}
                  </div>
                  
                  <AlertModal {...configModal}>
                    <h2>
                        X??c nh???n
                    </h2>
                    <p>
                        B???n ch???c ch???n l?? s??? x??a h??nh ???nh n??y ch????
                    </p>
                    <div className='flex-thing'>
                        <Button onClick={() => toggleModal()}>
                            H???y
                        </Button>
                        <Button onClick={() => firestore
                                        .collection('images')
                                        .doc(props.image.id)
                                        .delete()
                                        .then( handleDelete ) }>
                            X??c nh???n
                        </Button>
                    </div>
                  </AlertModal>
                  </>
                ]
              }
        </div>
    )
}

export default HorizontalImageCard