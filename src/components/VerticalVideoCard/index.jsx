import React, { useEffect, useState } from 'react'
import ReactPlayer from 'react-player'
import { Link } from 'react-router-dom'
import { firestore } from '../../firebase/utils'
import moment from 'moment'
import 'moment/locale/vi';
import "./style_verticalVideoCard.scss"

function VerticalVideoCard(props) {
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
        <div className='verticalVideoCard'>
            <Link className='verticalVideoCard_videoCardsThumbnail'>
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
            <div className='verticalVideoCard_videoCardsInfo'>
                <div className="verticalVideoCard_text">
                    <Link>
                        <h4>{props.video.title}</h4>
                    </Link>

                    <Link className="verticalVideoCard_desc">
                        <p>{props.video.desc}</p>
                    </Link>
                    
                    <Link>
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
        </div>
    )
}

export default VerticalVideoCard