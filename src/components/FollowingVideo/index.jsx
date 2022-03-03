import React, { useEffect, useState } from 'react'
import "./style_following_video.scss"
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { fetchVideosStart } from '../../redux/Videos/videos.actions';

import VideoCard from '../VideoCard'
import { firestore } from '../../firebase/utils';

const mapState = ({videosData, user}) => ({
    videos: videosData.videos,
    currentUser: user.currentUser
})

function FollowingVideo() {
    const dispatch = useDispatch()
    const history = useHistory()
    const { filterType } = useParams()
    const { videos, currentUser } = useSelector(mapState)
    const [pageSize, setPageSize] = useState(8)
    const [currentUserId, setCurrentUserId] = useState([])
    const [userInfo, setUserInfo] = useState([])

    const { data, queryDoc, isLastPage } = videos

    // useEffect(() => {
    //     dispatch(
    //         fetchVideosStart({filterType})
    //     )
    // }, [filterType])

    useEffect(() => {
        if(currentUser) {
            firestore.collection("users").where('follow', 'array-contains', currentUser.id).onSnapshot((snapshot) => {
                setUserInfo(snapshot.docs.map(doc => ({
                    userId: doc.id,
                })))
            })
        }
    },[currentUser])

    useEffect(() => {
        if(userInfo.length > 0){
            var currentUserId = userInfo.map(a => a.userId);
            console.log(currentUserId)
            dispatch(
                fetchVideosStart({currentUserId, pageSize})
            )
            setCurrentUserId(currentUserId)
        }
    }, [userInfo])

    const handleLoadMore = () => {
        dispatch(
            fetchVideosStart({ 
                currentUserId, 
                startAfterDoc: queryDoc,
                persistVideos: data 
            })
        )
    }

    const configLoadMore = {
        onLoadMoreEvt: handleLoadMore,
    }

    if(!Array.isArray(data)) return null
    
    if (data.length < 1) {
        return (
            <div className="container_video">    
                <p>
                    Opps... không có gì ở đây cả...
                </p>

            </div>
        )
    }

    return (
        <div className='container_video following-thing'>
            <div className='upper'>
                <h2 className='label_video_type'>
                    Kênh theo dõi
                </h2>
                <div className='layout_video'>

                    {data.map((video, pos) => {
                        const { thumbnail, title, views, likes, privacy, sourceLink, desc, createdDate, videoAdminUID, documentID } = video
                        if ( !title || 
                            typeof views === 'undefined') return null

                        const configVideo = {
                            ...video
                        }
                        
                        return(
                            
                            <VideoCard 
                                {...configVideo}
                            />
                            
                        )
                    })}
                    

                </div>
            </div>
        </div>
    )
}

export default FollowingVideo
