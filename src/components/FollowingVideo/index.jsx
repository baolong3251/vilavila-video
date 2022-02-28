import React, { useEffect } from 'react'
import "./style_following_video.scss"
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { fetchVideosStart } from '../../redux/Videos/videos.actions';

import VideoCard from '../VideoCard'

const mapState = ({videosData}) => ({
    videos: videosData.videos
})

function FollowingVideo() {
    const dispatch = useDispatch()
    const history = useHistory()
    const { filterType } = useParams()
    const { videos } = useSelector(mapState)

    const { data, queryDoc, isLastPage } = videos

    useEffect(() => {
        dispatch(
            fetchVideosStart({filterType})
        )
    }, [filterType])
    
    console.log(data)

    const handleLoadMore = () => {
        dispatch(
            fetchVideosStart({ 
                filterType, 
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
    )
}

export default FollowingVideo
