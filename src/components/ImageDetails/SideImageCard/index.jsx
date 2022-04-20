import React, { useState } from 'react'
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { firestore } from '../../../firebase/utils';
import ImageCard from './ImageCard';

const mapState = state => ({
    currentUser: state.user.currentUser,
})

function SideImageCard(props) {
    const { currentUser } = useSelector(mapState);
    const [images, setImages] = useState([])
    const { imageID } = useParams()

    useEffect(() => {
        if(props.imageAdminId){

            let ref = firestore.collection("images").where("imageAdminUID", "==", props.imageAdminId).where("privacy", "==", "public").orderBy("createdDate", "desc")
            
            ref.get().then(
                (snapshot) => {
                    setImages(snapshot.docs.map(doc => ({
                        iid: doc.id, 
                        title: doc.data().title, 
                        sourceLink: doc.data().sourceLink, 
                        privacy: doc.data().privacy,
                        createdDate: doc.data().createdDate,
                        tags: doc.data().tags,
                        imageAdminUID: doc.data().imageAdminUID,
                      })
                    ))
                }
            )
        }
    }, [props.imageAdminId])

    return (
        <div className='imageDetails_sideImageCard'>
            <p>Các nội dung khác:</p>
            {
                images.map(image => {
                    return(
                        <div key={image.iid}>
                            {image.iid !== imageID ? <ImageCard image={image} /> : null}
                        </div>
                    )
                })
            }
        </div>
    )
}

export default SideImageCard