import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {fetchImagesStart} from "../../../redux/Images/images.actions"
import LoadMore from '../../Forms/LoadMore';
import ImageCard from "../../ImageCard"

const mapState = ({imagesData, user}) => ({
    images: imagesData.images,
    currentUser: user.currentUser
})

function ImagesForBottom({ imageAdminId, tags, id }) {
    
    const dispatch = useDispatch()
    const { images, currentUser } = useSelector(mapState)
    const [pageSize, setPageSize] = useState(8)
    const { filterTypeTag } = useParams()
    const filterTypeTags = tags

    const { data, queryDoc, isLastPage } = images

    console.log(filterTypeTags)
    console.log(filterTypeTag)

    useEffect(() => {
        if(tags.length > 0) {
            dispatch(
                fetchImagesStart({filterTypeTags, pageSize})
            )
        } else {
            dispatch(
                fetchImagesStart({filterTypeTag, pageSize})
            )
        }
        
    }, [id])

    const handleLoadMore = () => {
        dispatch(
            fetchImagesStart({ 
                filterTypeTags, 
                filterTypeTag,
                pageSize,
                startAfterDoc: queryDoc,
                persistImages: data 
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
        <>
        <div className='imageDetails_showImagesBottom'>
            {data.map((image, pos) => {
                const { title, likes, privacy, sourceLink, desc, createdDate, imageAdminUID, documentID } = image
                if ( !title ) return null

                const configImage = {
                    ...image
                }
                
                return(
                    
                    <ImageCard key={documentID}
                        {...configImage}
                    />
                    
                )
            })}

            
        </div>

        {!isLastPage && (
            <LoadMore {...configLoadMore} />
        )}
        </>
    )
}

export default ImagesForBottom