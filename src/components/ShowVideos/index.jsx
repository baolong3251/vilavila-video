import React, { useEffect, useState } from 'react'
import "./style_showVideos.scss"
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { fetchVideosStart } from '../../redux/Videos/videos.actions';

import VideoCard from '../VideoCard'
import { firestore } from '../../firebase/utils';
import LoadMore from '../Forms/LoadMore';

const mapState = ({videosData, user}) => ({
    videos: videosData.videos,
    currentUser: user.currentUser
})

function ShowVideos() {
    const dispatch = useDispatch()
    const history = useHistory()
    const { filterType } = useParams()
    const { filterTypeTag } = useParams()
    const { videos, currentUser } = useSelector(mapState)
    const [userInfo, setUserInfo] = useState([])
    const [pageSize, setPageSize] = useState(8)

    const { data, queryDoc, isLastPage } = videos

    console.log(videos)

    useEffect(() => {
        dispatch(
            fetchVideosStart({filterType, pageSize})
        )
    }, [filterType])

    useEffect(() => {
        dispatch(
            fetchVideosStart({filterTypeTag, pageSize})
        )
    }, [filterTypeTag])

    // useEffect(() => {
    //     if(currentUser) {
    //         firestore.collection("users").where('follow', 'array-contains', currentUser.id).onSnapshot((snapshot) => {
    //             setUserInfo(snapshot.docs.map(doc => ({
    //                 userId: doc.id,
    //             })))
    //         })
    //     }
    // },[currentUser])

    // useEffect(() => {
    //     if(userInfo.length > 0){
    //         var currentUserId = userInfo.map(a => a.userId);
    //         console.log(currentUserId)
    //         dispatch(
    //             fetchVideosStart({currentUserId})
    //         )
    //     }
    // }, [userInfo])


    const handleLoadMore = () => {
        dispatch(
            fetchVideosStart({ 
                filterType,
                filterTypeTag,
                pageSize,
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
        <div className='container_video'>
            <div className='upper'>
                <h2 className='label_video_type'>
                    {filterTypeTag || filterType ? "Kết quả tìm kiếm cho " : "Tất cả video"}
                    {filterTypeTag ? filterTypeTag : filterType}
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

                {!isLastPage && (
                    <LoadMore {...configLoadMore} />
                )}
            </div>
        </div>
    )
}

export default ShowVideos
