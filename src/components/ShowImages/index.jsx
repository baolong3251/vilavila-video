import React, { useEffect, useState } from 'react'
import "./style_showImages.scss"

import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { fetchImagesStart } from '../../redux/Images/images.actions';
import ImageCard from '../ImageCard';
import LoadMore from '../Forms/LoadMore';

import { doc, updateDoc, increment } from "firebase/firestore";
import { firestore } from '../../firebase/utils';


import moment from "moment-timezone"
import 'moment/locale/vi';


import Image from "../../assets/16526305592141308214.png"
import AdOnTop from '../DisplayAd/AdOnTop';

const mapState = ({imagesData, user}) => ({
    images: imagesData.images,
    currentUser: user.currentUser
})

function ShowImages() {
    const dispatch = useDispatch()
    const history = useHistory()
    const { filterType } = useParams()
    const { filterTypeTag } = useParams()
    const { images, currentUser } = useSelector(mapState)
    const [pageSize, setPageSize] = useState(8)
    const [dataForTagLog, setDataForTagLog] = useState([])
    const [statGo, setStatGo] = useState(false)

    const { data, queryDoc, isLastPage } = images

    useEffect(() => {
        dispatch(
            fetchImagesStart({filterType, pageSize})
        )
    }, [filterType])

    useEffect(() => {
        if(!filterType && filterTypeTag) {
            dispatch(
                fetchImagesStart({filterTypeTag, pageSize})
            )
            handleGetData()
        }
    }, [filterTypeTag])

    const handleGetData = () => {
        firestore.collection("tagLog").where("tag", "==", filterTypeTag).where("contentType", "==", "image").get().then(snapshot => {
            setDataForTagLog(snapshot.docs.map(doc => ({
                    id: doc.id, 
                    tag: doc.data().tag,
                    lastUpdate: doc.data().lastUpdate,
                })
            ))
        })

        setStatGo(true)
    }

    useEffect(() => {
        if(statGo) {
            handleUpdateTrending()
        }
        
    }, [dataForTagLog])

    const handleUpdateTrending = () => {
        var someArray = dataForTagLog
        someArray = someArray.find(element => element.tag == filterTypeTag)
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        // var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        if(someArray){
            var newArr = someArray.lastUpdate
            var time4 = moment(date).locale('vi').format("D")
            var time5 = moment(newArr.toDate()).locale('vi').format("D")
            if(time4 !== time5){
                const tagRef = doc(firestore, "tagLog", someArray.id);

                updateDoc(tagRef, {
                    NumOfInteractions: increment(1)
                });
            }

        } else {
            firestore.collection("tagLog").add({
                
                tag: filterTypeTag,
                NumOfInteractions: 1,
                lastUpdate: firstDay,
                contentType: "image",
                    
            })
        }
    }

    const handleLoadMore = () => {
        dispatch(
            fetchImagesStart({ 
                filterType, 
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
            <div className='showImages_ad'>
                <AdOnTop
                    Image={Image}
                    Link="https://gamersupps.gg/?afmc=213&cmp_id=15872452240&adg_id=131805543003&kwd=&device=c&gclid=CjwKCAjw3cSSBhBGEiwAVII0Z-7utscsbxqYYMa4h3QCALZ_DkChfECxDVhp-K8eNBP0MTEPUvzBFxoCUIAQAvD_BwE"
                />
            </div>

            <div className='container_video'>
                <div className='upper'>
                    <h2 className='label_video_type'>
                        Tất cả hình ảnh
                    </h2>
                    <div className='layout_video'>

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
                </div>
            </div>
        </>
    )
}

export default ShowImages