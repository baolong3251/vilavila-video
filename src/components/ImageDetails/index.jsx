import React, { useEffect, useState } from 'react'
import "./style_imageDetails.scss"

import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchImageStart, setImage } from "../../redux/Images/images.actions";
import { firestore } from '../../firebase/utils';

import { Avatar, Button } from '@material-ui/core'
import { Link } from 'react-router-dom'
import Main from './Main';
import SideImageCard from './SideImageCard';
import Comment from './Comment';

const mapState = state => ({
    image: state.imagesData.image,
    currentUser: state.user.currentUser,
})

function ImageDetails() {
    const dispatch = useDispatch()
    const { imageID } = useParams()
    const { currentUser } = useSelector(mapState);
    const { image } = useSelector(mapState)
    const [channel, setChannel] = useState([])
    const [follow, setFollow] = useState(false)

    const {
        createdDate,
        desc,
        sourceLink,
        tags,
        title,
        imageAdminUID,
    } = image

    console.log(sourceLink)

    useEffect(() => {
        dispatch(
            fetchImageStart(imageID)
        )

        return () => {
            dispatch(
                setImage({})
            )
        }
    }, [imageID])

    useEffect(() => {
        if (imageAdminUID && channel.length == 0) {
            firestore.collection("users").doc(imageAdminUID).onSnapshot((snapshot) => {
                setChannel([...channel,{
                    displayName: snapshot.data().displayName,
                    avatar: snapshot.data().avatar,
                    follow: snapshot.data().follow,
                }])
            }) 
        }
    }, [imageAdminUID])

    useEffect(() => {
        if(channel.length > 0)
        checkFollow()
    }, [currentUser])

    useEffect(() => {
        if(channel.length > 0)
        checkFollow()
    }, [channel])

    const checkFollow = () => {
        if(currentUser && currentUser.id !== imageAdminUID){
            // Put the id of currentUser into the follow array
            const someArray = channel[0].follow
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
        if(currentUser && currentUser.id !== imageAdminUID){
            // Put the id of currentUser into the follow array
            const someArray = channel[0].follow
            const found = someArray.find(element => element == currentUser.id);
            if(!found){
                someArray.push(currentUser.id)
                firestore.collection('users').doc(imageAdminUID).set({
                    follow: someArray
                }, { merge: true })
            }

            if(found){
                const index = someArray.indexOf(currentUser.id);
                if (index > -1) {
                    someArray.splice(index, 1); // 2nd parameter means remove one item only
                }

                firestore.collection('users').doc(imageAdminUID).set({
                    follow: someArray
                }, { merge: true })
                
            }
        }
    }

    return (
        <div className='imageDetails'>

            <div className='imageDetails_top'>
                <div className='imageDetails_leftSide'>

                    <Main
                        id={imageID}
                        urls={sourceLink}
                        title={title}
                        desc={desc}
                        date={createdDate}
                        tags={tags}
                    />

                    <Comment />

                </div>

                <div className='imageDetails_rightSide'>

                    <div className='imageDetails_rightSide_info'>
                        <Avatar src={channel.length !== 0 ? channel[0].avatar : null} className='imageDetails_rightSideAvatar' />
                        <div className='imageDetails_rightSideText'>
                            <Link>
                                <h4>
                                    {channel.length !== 0 ? channel[0].displayName : null}
                                </h4>
                            </Link>
                            <p>{channel.length !== 0 ? channel[0].follow.length : null} lượt theo dõi</p>
                            {
                            !follow ? 
                            <Button onClick={() => handleFollow()} className='imageDetails_rightSideText_button'>+ Theo dõi</Button> : 
                            <Button onClick={() => handleFollow()} className='imageDetails_rightSideText_button'>- Bỏ theo dõi</Button>
                            }
                            
                        </div>
                    </div>

                    <SideImageCard />

                </div>

            </div>

            {/* THIS WILL SHOW WHEN REsPONSIVE */}
            <div className='imageDetails_bottom'>
                <div className='imageDetails_bottom'>
                    <Comment />
                </div>
            </div>

        </div>
    )
}

export default ImageDetails