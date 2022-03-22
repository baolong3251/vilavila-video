import "./style_imageCard.scss"
import { Avatar } from '@material-ui/core'
import React, {useEffect,useState} from 'react'
import ReactPlayer from 'react-player'
import { firestore, auth } from '../../firebase/utils'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import 'moment/locale/vi';

function ImageCard(image) {
    const [dataChannel, setDataChannel] = useState([])
    const dispatch = useDispatch()
    const [quantity, setQuantity] = useState(1)
    const history = useHistory()

    const {
        title, 
        createdDate,
        privacy,
        desc,
        imageAdminUID,
        sourceLink,
        documentID,
        tags,
        tier,
    } = image

    useEffect(() => {
        handleLoadThing()
    },[image])

    if (!documentID || !sourceLink || !title) return null

    const handleLoadThing = () => {
        firestore.collection('users').doc(imageAdminUID).onSnapshot(snapshot => {
            try {
                setDataChannel({
                    id: snapshot.id, 
                    displayName: snapshot.data().displayName,
                    channelImage: snapshot.data().avatar,
                })
            } catch (error) {
                
            }
            
        })
    }

    return (
        <div className="imageCard">
            <Link to={`/image/${documentID}`} className='imageCard_thumbnail'>
                {sourceLink !== '' ? 
                    <img src={sourceLink[0]}  /> : 
                    null
                }
                
            </Link>

            <div className='imageCard_info'>
                <Avatar 
                    className='imageCard_avatar' 
                    alt={dataChannel.displayName}
                    src={dataChannel.channelImage} 
                />
                <div className="imageCard_text">
                    <Link to={`/image/${documentID}`}>
                        <h4>{title}</h4>
                    </Link>
                    
                    <Link to={`/user/${imageAdminUID}`}><p>{dataChannel.displayName} • {moment(createdDate.toDate()).locale('vi').fromNow()} </p></Link>
                </div>
            </div>
        </div>
    )
}

export default ImageCard