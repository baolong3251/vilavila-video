import React, { useEffect, useState } from 'react'
import "./style_showVideos.scss"
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { fetchVideosStart } from '../../redux/Videos/videos.actions';
import { doc, updateDoc, increment } from "firebase/firestore";

import VideoCard from '../VideoCard'
import { firestore } from '../../firebase/utils';
import LoadMore from '../Forms/LoadMore';

import Image from "../../assets/16526305592141308214.png"
import AdOnTop from '../DisplayAd/AdOnTop';

import moment from "moment-timezone"
import 'moment/locale/vi';

const mapState = ({videosData, user}) => ({
    videos: videosData.videos,
    currentUser: user.currentUser
})

function ShowVideos() {
    const dispatch = useDispatch()
    const history = useHistory()
    const { filterType } = useParams()
    const { filterTypeTag } = useParams()
    const { videos, currentUser } = useSelector(mapState)
    const [userInfo, setUserInfo] = useState([])
    const [pageSize, setPageSize] = useState(8)
    const [dataForTagLog, setDataForTagLog] = useState([])
    const [statGo, setStatGo] = useState(false)

    const { data, queryDoc, isLastPage } = videos

    console.log(videos)

    useEffect(() => {
        dispatch(
            fetchVideosStart({filterType, pageSize})
        )
    }, [filterType])

    useEffect(() => {
        if(!filterType && filterTypeTag) {
            dispatch(
                fetchVideosStart({filterTypeTag, pageSize})
            )
            handleGetData()
        }
        
    }, [filterTypeTag])

    const handleGetData = () => {
        firestore.collection("tagLog").where("tag", "==", filterTypeTag).where("contentType", "==", "video").where("contentType", "==", "video").get().then(snapshot => {
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
                contentType: "video",
                    
            })
        }
    }

    // useEffect(() => {
    //     if(currentUser) {
    //         firestore.collection("users").where('follow', 'array-contains', currentUser.id).onSnapshot((snapshot) => {
    //             setUserInfo(snapshot.docs.map(doc => ({
    //                 userId: doc.id,
    //             })))
    //         })
    //     }
    // },[currentUser])

    // useEffect(() => {
    //     if(userInfo.length > 0){
    //         var currentUserId = userInfo.map(a => a.userId);
    //         console.log(currentUserId)
    //         dispatch(
    //             fetchVideosStart({currentUserId})
    //         )
    //     }
    // }, [userInfo])


    const handleLoadMore = () => {
        dispatch(
            fetchVideosStart({ 
                filterType,
                filterTypeTag,
                pageSize,
                startAfterDoc: queryDoc,
                persistVideos: data 
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
            <div className='showVideos_ad'>
                <AdOnTop
                    Image={Image}
                    Link="https://gamersupps.gg/?afmc=213&cmp_id=15872452240&adg_id=131805543003&kwd=&device=c&gclid=CjwKCAjw3cSSBhBGEiwAVII0Z-7utscsbxqYYMa4h3QCALZ_DkChfECxDVhp-K8eNBP0MTEPUvzBFxoCUIAQAvD_BwE"
                />
            </div>

            <div className='container_video'>
                
                <div className='upper'>
                    <h2 className='label_video_type'>
                        {filterTypeTag || filterType ? "Kết quả tìm kiếm cho " : "Tất cả video"}
                        {filterTypeTag ? filterTypeTag : filterType}
                    </h2>
                    <div className='layout_video'>

                        {data.map((video, pos) => {
                            const { thumbnail, title, views, likes, privacy, sourceLink, desc, createdDate, videoAdminUID, documentID } = video
                            if ( !title || 
                                typeof views === 'undefined') return null

                            const configVideo = {
                                ...video
                            }
                            
                            return(
                                
                                <VideoCard 
                                    {...configVideo}
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

export default ShowVideos
