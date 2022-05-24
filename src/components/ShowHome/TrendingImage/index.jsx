import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";

import ImageCard from '../../ImageCard'
import { firestore } from '../../../firebase/utils';



function TrendingImage(props) {
    const [imagesThing, setImagesThing] = useState([])

    useEffect(() => {
        firestore.collection("images").where("tags", "array-contains", props.dataTagLog).where("tier", "==", "").where("privacy", "==", "public").orderBy("createdDate", "desc").limit(8).get().then(snapshot => {
            setImagesThing(snapshot.docs.map(doc => ({
              documentID: doc.id, 
              title: doc.data().title, 
              privacy: doc.data().privacy, 
              sourceLink: doc.data().sourceLink, 
              desc: doc.data().desc,
              createdDate: doc.data().createdDate, 
              imageAdminUID: doc.data().imageAdminUID, 
            })
          ))
        })
           
        
    }, [])


    if(!Array.isArray(imagesThing)) return null
    
    if (imagesThing.length < 1) {
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
                    Hình ảnh - {props.dataTagLog} <Link to={`/images/tag/${props.dataTagLog}`}>Xem thêm</Link>
                </h2>
                <div className='layout_video'>

                    {imagesThing.length !== 0 && [
                    imagesThing.map((image, pos) => {
                        const { title, privacy, sourceLink, desc, createdDate, imageAdminUID, documentID } = image
                        if ( !title ) return null

                        const configImage = {
                            ...image
                        }
                        
                        return(
                            
                            <ImageCard key={documentID}
                                {...configImage}
                            />
                            
                        )
                    })]}
                    

                </div>
            </div>
        </div>
    )
}

export default TrendingImage
