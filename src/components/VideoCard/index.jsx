import { Avatar } from '@material-ui/core'
import React, {useEffect,useState} from 'react'
import ReactPlayer from 'react-player'
import { firestore, auth } from '../../firebase/utils'
import "./style_videocard.scss"
import { Link, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import 'moment/locale/vi';


function VideoCard(video) {
    const [dataChannel, setDataChannel] = useState([])
    const dispatch = useDispatch()
    const [quantity, setQuantity] = useState(1)
    const history = useHistory()
    const {
        title,
        views, 
        createdDate, 
        thumbnail,
        likes,
        privacy,
        desc,
        videoAdminUID,
        sourceLink,
        documentID,
    } = video

    useEffect(() => {
        handleLoadThing()
    },[video])

    if (!documentID || !sourceLink || !title ||
        typeof views === 'undefined') return null

    const handleLoadThing = () => {
        firestore.collection('users').doc(videoAdminUID).onSnapshot(snapshot => {
            
            setDataChannel({
                    id: snapshot.id, 
                    displayName: snapshot.data().displayName,
                    channelImage: snapshot.data().channelImage,
            })
            
        })
    }

    console.log(videoAdminUID)
    console.log(dataChannel)

    return (
        <div className='videoCard'>
            
            <Link to={`/video/${documentID}`} className='videoCard_thumbnail'>
                {thumbnail !== '' ? 
                    <img src={thumbnail}  /> : 
                <ReactPlayer 
                    className="react-player"
                    url={sourceLink} 
                    width="100%"
                    height="100%"
                /> }
                
            </Link>
            {/* <img className='videoCard_thumbnail' src={image}  /> */}
            
            <div className='videoCard_info'>
                <Avatar 
                    className='videoCard_avatar' 
                    alt={dataChannel.displayName}
                    src={dataChannel.channelImage} 
                />
                <div className="videoCard_text">
                    <Link to={`/video/${documentID}`}>
                        <h4>{title}</h4>
                    </Link>
                    
                    <Link to={`/user/${videoAdminUID}`}><p>{dataChannel.displayName}</p></Link>
                    <p>
                        {new Intl.NumberFormat('vi-VN', {
                        notation: "compact",
                        compactDisplay: "short"
                        }).format(views)} lượt xem • {moment(createdDate.toDate()).locale('vi').fromNow()} 
                        {/* calendar */}
                    </p>
                </div>
            </div>
                
        </div>
    )
}

export default VideoCard
