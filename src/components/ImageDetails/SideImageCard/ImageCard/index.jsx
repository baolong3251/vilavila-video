import React from 'react'
import { Link } from 'react-router-dom'

import moment from 'moment'
import 'moment/locale/vi';
import { useEffect } from 'react';
import { useState } from 'react';
import { firestore } from '../../../../firebase/utils';

function ImageCard(props) {
  const [channel, setChannel] = useState([])

  useEffect(() => {
    if (props.image.imageAdminUID && channel.length == 0) {
        firestore.collection("users").doc(props.image.imageAdminUID).onSnapshot((snapshot) => {
            setChannel([...channel,{
                displayName: snapshot.data().displayName,
                avatar: snapshot.data().avatar,
                follow: snapshot.data().follow,
            }])
        }) 
    }
}, [props.image.imageAdminUID])

  return (
    <div className='imageDetails_rightSide_imageCards'>
        <Link to={`/image/${props.image.iid}`} className='imageDetails_rightSide_imageCardsThumbnail'>
            { 
              <img className='imageCards_img' src={props.image.sourceLink[0]} />
            }
        </Link>
        <div className='imageDetails_rightSide_imageCardsInfo'>
            <div className="imageCards_text">
                <Link to={`/image/${props.image.iid}`}>
                    <h4>{props.image.title}</h4>
                </Link>
                
                <Link to={`/user/${props.image.imageAdminUID}`}>
                    <p>{channel.length > 0 ? channel[0].displayName : null}</p>
                </Link>
                <p>
                    
                    {moment(props.image.createdDate.toDate()).locale('vi').fromNow()}
                </p>
            </div>
        </div>
    </div>
  )
}

export default ImageCard