import React, { useEffect, useState } from 'react'
import "./style_videoDetails.scss"
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchVideoStart, setVideo } from "../../redux/Videos/videos.actions";

import { firestore, auth } from "../../firebase/utils";
import {collection, query, where, orderBy, onSnapshot} from "firebase/firestore"

import { Avatar, Button } from '@material-ui/core'
import { Link } from 'react-router-dom'
import Main from './Main';
import Comment from './Comment';
import SideVideoCard from './SideVideoCard';

const mapState = state => ({
    video: state.videosData.video,
    currentUser: state.user.currentUser,
})

function VideoDetails() {
    const dispatch = useDispatch()
    const history = useHistory()
    const { videoID } = useParams()
    const { currentUser } = useSelector(mapState);
    const { video } = useSelector(mapState)
    const [channel, setChannel] = useState([])
    const [follow, setFollow] = useState(false)

    const {
        category,
        createdDate,
        desc,
        sourceLink,
        tags,
        title,
        videoAdminUID,
        views,
    } = video

    useEffect(() => {
        dispatch(
            fetchVideoStart(videoID)
        )

        return () => {
            dispatch(
                setVideo({})
            )
        }
    }, [videoID])

    useEffect(() => {
        if (videoAdminUID && channel.length == 0) {
            firestore.collection("users").doc(videoAdminUID).onSnapshot((snapshot) => {
                setChannel([...channel,{
                    displayName: snapshot.data().displayName,
                    avatar: snapshot.data().avatar,
                    follow: snapshot.data().follow,
                }])
            }) 
        }
    }, [videoAdminUID])

    useEffect(() => {
        if(channel.length > 0)
        checkFollow()
    }, [currentUser])

    useEffect(() => {
        if(channel.length > 0)
        checkFollow()
    }, [channel])

    const checkFollow = () => {
        if(currentUser && currentUser.id !== videoAdminUID){
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
        if(currentUser && currentUser.id !== videoAdminUID){
            // Put the id of currentUser into the follow array
            const someArray = channel[0].follow
            const found = someArray.find(element => element == currentUser.id);
            if(!found){
                someArray.push(currentUser.id)
                firestore.collection('users').doc(videoAdminUID).set({
                    follow: someArray
                }, { merge: true })
            }

            if(found){
                const index = someArray.indexOf(currentUser.id);
                if (index > -1) {
                    someArray.splice(index, 1); // 2nd parameter means remove one item only
                }

                firestore.collection('users').doc(videoAdminUID).set({
                    follow: someArray
                }, { merge: true })
                
            }
        }
    }

    return (
        <div className='videoDetails'>

            <div className='videoDetails_top'>
                <div className='videoDetails_leftSide'>

                    <Main
                        id={videoID}
                        url={sourceLink}
                        title={title}
                        views={views}
                        desc={desc}
                        date={createdDate}
                        tags={tags}
                    />

                    <Comment />

                </div>

                <div className='videoDetails_rightSide'>

                    <div className='videoDetails_rightSide_info'>
                        <Avatar src={channel.length !== 0 ? channel[0].avatar : null} className='videoDetails_rightSideAvatar' />
                        <div className='videoDetails_rightSideText'>
                            <Link>
                                <h4>
                                    {channel.length !== 0 ? channel[0].displayName : null}
                                </h4>
                            </Link>
                            <p>{channel.length !== 0 ? channel[0].follow.length : null} lượt theo dõi</p>
                            {
                            !follow ? 
                            <Button onClick={() => handleFollow()} className='videoDetails_rightSideText_button'>+ Theo dõi</Button> : 
                            <Button onClick={() => handleFollow()} className='videoDetails_rightSideText_button'>- Bỏ theo dõi</Button>
                            }
                            
                        </div>
                    </div>

                    <hr></hr>

                    <SideVideoCard 
                        category={category}
                        tags={tags}
                    />

                </div>

            </div>

            {/* THIS WILL SHOW WHEN REsPONSIVE */}
            <div className='videoDetails_bottom'>
                <div className='videoDetails_bottom'>
                    <Comment />
                </div>
            </div>

        </div>
    )
}

export default VideoDetails
