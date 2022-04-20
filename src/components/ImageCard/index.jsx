import "./style_imageCard.scss"
import { Avatar } from '@material-ui/core'
import React, {useEffect,useState} from 'react'
import ReactPlayer from 'react-player'
import { firestore, auth } from '../../firebase/utils'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import moment from 'moment'
import 'moment/locale/vi';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    root: {
      maxWidth: 250,
    },
});

function ImageCard(image) {
    const [dataChannel, setDataChannel] = useState([])
    const dispatch = useDispatch()
    const [quantity, setQuantity] = useState(1)
    const history = useHistory()
    const classes = useStyles();

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
            {/* <Link to={`/image/${documentID}`} className='imageCard_thumbnail'>
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
            </div> */}


        <Card className={classes.root}>
            <CardActionArea>
                <Link to={`/image/${documentID}`} className='imageCard_thumbnail'>
                    <CardMedia
                        component="img"
                        alt="Contemplative Reptile"
                        height="140"
                        image=  {sourceLink !== '' ? 
                                    sourceLink[0]: 
                                    null
                                }
                        title="Contemplative Reptile"
                    />
                </Link>
                <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                    {title}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                <div className='imageCard_info2'>
                    <Avatar 
                        className='imageCard_avatar' 
                        alt={dataChannel.displayName}
                        src={dataChannel.channelImage} 
                    />
                    <div className="imageCard_text2">
                        
                        
                        <Link to={`/user/${imageAdminUID}`}><p>{dataChannel.displayName} • {moment(createdDate.toDate()).locale('vi').fromNow()} </p></Link>
                    </div>
                </div>
                </Typography>
                </CardContent>
            </CardActionArea>
            {/* <CardActions>
                <Button size="small" color="primary">
                Share
                </Button>
                <Button size="small" color="primary">
                Learn More
                </Button>
            </CardActions> */}
        </Card>
        </div>
    )
}

export default ImageCard