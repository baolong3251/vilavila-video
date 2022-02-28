import React from 'react'
import ReactPlayer from 'react-player'
import { Link } from 'react-router-dom'
import VideoThumbnail from 'react-video-thumbnail';

import moment from 'moment'
import 'moment/locale/vi';
import { useEffect } from 'react';
import { useState } from 'react';
import { firestore } from '../../../../firebase/utils';

function VideoCard(props) {
    const [channel, setChannel] = useState([])

    useEffect(() => {
        if (props.video.videoAdminUID && channel.length == 0) {
            firestore.collection("users").doc(props.video.videoAdminUID).onSnapshot((snapshot) => {
                setChannel([...channel,{
                    displayName: snapshot.data().displayName,
                    avatar: snapshot.data().avatar,
                    follow: snapshot.data().follow,
                }])
            }) 
        }
    }, [props.video.videoAdminUID])

    return (
        <div className='videoDetails_rightSide_videoCards'>
            <Link className='videoDetails_rightSide_videoCardsThumbnail'>
                {props.video.thumbnail ? <img className='videoCards_img' src={props.video.thumbnail} />
                :
                <ReactPlayer 
                    className="react-player"
                    url={props.video.sourceLink} 
                    width="100%"
                    height="100%"
                />
                }
            </Link>
            <div className='videoDetails_rightSide_videoCardsInfo'>
                <div className="videoCards_text">
                    <Link>
                        <h4>{props.video.title}</h4>
                    </Link>
                    
                   <Link>
                        <p>{channel.length > 0 ? channel[0].displayName : null}</p>
                   </Link>
                    <p>
                        {new Intl.NumberFormat('vi-VN', {
                        notation: "compact",
                        compactDisplay: "short"
                        }).format(props.video.views)} lượt xem • 
                        {moment(props.video.createdDate.toDate()).locale('vi').fromNow()}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default VideoCard