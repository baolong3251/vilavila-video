import React, { useEffect, useState } from 'react'
import "./style_videoDetails.scss"
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchVideoStart, setVideo } from "../../redux/Videos/videos.actions";

import Image from "../../assets/17820985376758488689.png"
import Image2 from "../../assets/16526305592141308214.png"

import { firestore, auth } from "../../firebase/utils";
import {collection, query, where, orderBy, onSnapshot, arrayUnion, arrayRemove} from "firebase/firestore"

import { Avatar, Button } from '@material-ui/core'
import { Link } from 'react-router-dom'
import Main from './Main';
import Comment from './Comment';
import SideVideoCard from './SideVideoCard';
import AdSide from '../DisplayAd/AdSide';
import AdMiddle from '../DisplayAd/AdMiddle';


const mapState = state => ({
    video: state.videosData.video,
    currentUser: state.user.currentUser,
})

function VideoDetails() {
    const dispatch = useDispatch()
    const history = useHistory()
    const { videoID } = useParams()
    const { currentUser } = useSelector(mapState);
    const { video } = useSelector(mapState)
    const [channel, setChannel] = useState([])
    const [follow, setFollow] = useState(false)
    const [userInfo, setUserInfo] = useState([])

    const {
        category,
        createdDate,
        desc,
        sourceLink,
        tags,
        title,
        videoAdminUID,
        views,
        point,
    } = video

    useEffect(() => {
        reset()
        dispatch(
            fetchVideoStart(videoID)
        )

        return () => {
            dispatch(
                setVideo({})
            )
        }
    }, [videoID])

    useEffect(() => {
        if (videoAdminUID) {

            firestore.collection("users").doc(videoAdminUID).onSnapshot((snapshot) => {
                try {
                    setChannel([{
                        displayName: snapshot.data().displayName,
                        avatar: snapshot.data().avatar,
                        follow: snapshot.data().follow,
                        abilityShowMore: snapshot.data().abilityShowMore,
                        abilityAdsBlock: snapshot.data().abilityAdsBlock,
                    }])
                } catch (error) {
                    
                }
            }) 
        }
    }, [videoAdminUID])

    console.log(channel)

    useEffect(() => {

        if(currentUser){
            firestore.collection("users").doc(currentUser.id).onSnapshot((snapshot) => {
                try {
                    setUserInfo([{
                        displayName: snapshot.data().displayName,
                        avatar: snapshot.data().avatar,
                        follow: snapshot.data().follow,
                        abilityShowMore: snapshot.data().abilityShowMore,
                        abilityAdsBlock: snapshot.data().abilityAdsBlock,
                    }])
                } catch (error) {
                    
                }
            }) 
        }
    }, [currentUser])

    useEffect(() => {
        if(channel.length > 0)
        checkFollow()
    }, [channel])

    const checkFollow = () => {
        if(currentUser && currentUser.id !== videoAdminUID){
            // Put the id of currentUser into the follow array
            const someArray = channel[0].follow
            const found = someArray.find(element => element == currentUser.id);
            if(!found){
                setFollow(false)
            }

            if(found){
                setFollow(true)
            }
        }
    }

    const handleFollow = () => {
        if(!currentUser) {
            alert("Không thể thực theo dõi, xin vui lòng đăng nhập...")
        }
        if(currentUser && currentUser.id !== videoAdminUID){
            // Put the id of currentUser into the follow array
            const someArray = channel[0].follow
            const found = someArray.find(element => element == currentUser.id);
            if(!found){
                // someArray.push(currentUser.id)
                firestore.collection('users').doc(videoAdminUID).set({
                    follow: arrayUnion(currentUser.id)
                }, { merge: true })
            }

            if(found){
                // const index = someArray.indexOf(currentUser.id);
                // if (index > -1) {
                //     someArray.splice(index, 1); // 2nd parameter means remove one item only
                // }

                firestore.collection('users').doc(videoAdminUID).set({
                    follow: arrayRemove(currentUser.id)
                }, { merge: true })
                
            }
        }
    }

    const reset = () => {
        setFollow(false)
    }

    return (
        <div className='videoDetails'>

            <div className='videoDetails_top'>
                <div className='videoDetails_leftSide'>

                    <Main
                        id={videoID}
                        url={sourceLink}
                        title={title}
                        views={views}
                        desc={desc}
                        date={createdDate}
                        tags={tags}
                        category={category}
                        videoAdminUID={videoAdminUID}
                        abilityShowMore={channel.length !== 0 ? channel[0].abilityShowMore ? channel[0].abilityShowMore : "false" : null}
                        abilityAdsBlock={userInfo.length !== 0 ? userInfo[0].abilityAdsBlock ? userInfo[0].abilityAdsBlock : "false" : null}
                        point={point}
                    />

                    <Comment />

                </div>

                <div className='videoDetails_rightSide'>

                    <div className='videoDetails_rightSide_info'>
                        <Avatar src={channel.length !== 0 ? channel[0].avatar : null} className='videoDetails_rightSideAvatar' />
                        <div className='videoDetails_rightSideText'>
                            <Link to={`/user/${videoAdminUID}`}>
                                <h4>
                                    {channel.length !== 0 ? channel[0].displayName : null}
                                </h4>
                            </Link>
                            <p>{channel.length !== 0 ? channel[0].follow.length : null} lượt theo dõi</p>
                            {
                            !follow ? 
                                <Button onClick={() => handleFollow()} className='videoDetails_rightSideText_button'>+ Theo dõi</Button> : 
                                <Button onClick={() => handleFollow()} className='videoDetails_rightSideText_button'>- Bỏ theo dõi</Button>
                            }
                            
                        </div>
                    </div>
                    
                    {userInfo.length !== 0 ? 
                        userInfo[0].abilityAdsBlock == "true" ? null
                        :   <div>
                                <AdSide
                                    Image={Image}
                                    Link="https://gamersupps.gg/?afmc=213&cmp_id=15872452240&adg_id=131805543003&kwd=&device=c&gclid=CjwKCAjw3cSSBhBGEiwAVII0Z-7utscsbxqYYMa4h3QCALZ_DkChfECxDVhp-K8eNBP0MTEPUvzBFxoCUIAQAvD_BwE"
                                />
                            </div> 
                        :   <div>
                                <AdSide
                                    Image={Image}
                                    Link="https://gamersupps.gg/?afmc=213&cmp_id=15872452240&adg_id=131805543003&kwd=&device=c&gclid=CjwKCAjw3cSSBhBGEiwAVII0Z-7utscsbxqYYMa4h3QCALZ_DkChfECxDVhp-K8eNBP0MTEPUvzBFxoCUIAQAvD_BwE"
                                />
                            </div> 
                    }
                    

                    <SideVideoCard 
                        category={category}
                        tags={tags ? tags : []}
                    />

                </div>

            </div>

            {/* THIS WILL SHOW WHEN REsPONSIVE */}
            <div className='videoDetails_bottom'>
                <div className='videoDetails_bottom'>
                    <Comment />
                </div>
            </div>
            {userInfo.length > 0 ? 
                userInfo[0].abilityAdsBlock == "true" ? null
                : <>
                    <div className='videoDetails_bottomAd'>
                        <AdSide
                            Image={Image}
                            Link="https://gamersupps.gg/?afmc=213&cmp_id=15872452240&adg_id=131805543003&kwd=&device=c&gclid=CjwKCAjw3cSSBhBGEiwAVII0Z-7utscsbxqYYMa4h3QCALZ_DkChfECxDVhp-K8eNBP0MTEPUvzBFxoCUIAQAvD_BwE"
                        />
                        <AdSide
                            Image={Image}
                            Link="https://gamersupps.gg/?afmc=213&cmp_id=15872452240&adg_id=131805543003&kwd=&device=c&gclid=CjwKCAjw3cSSBhBGEiwAVII0Z-7utscsbxqYYMa4h3QCALZ_DkChfECxDVhp-K8eNBP0MTEPUvzBFxoCUIAQAvD_BwE"
                        />
                        <AdSide
                            Image={Image}
                            Link="https://gamersupps.gg/?afmc=213&cmp_id=15872452240&adg_id=131805543003&kwd=&device=c&gclid=CjwKCAjw3cSSBhBGEiwAVII0Z-7utscsbxqYYMa4h3QCALZ_DkChfECxDVhp-K8eNBP0MTEPUvzBFxoCUIAQAvD_BwE"
                        />
                        <AdSide
                            Image={Image}
                            Link="https://gamersupps.gg/?afmc=213&cmp_id=15872452240&adg_id=131805543003&kwd=&device=c&gclid=CjwKCAjw3cSSBhBGEiwAVII0Z-7utscsbxqYYMa4h3QCALZ_DkChfECxDVhp-K8eNBP0MTEPUvzBFxoCUIAQAvD_BwE"
                        />
                    </div>

                    <AdMiddle 
                        Image={Image2}
                        Link="https://gamersupps.gg/?afmc=213&cmp_id=15872452240&adg_id=131805543003&kwd=&device=c&gclid=CjwKCAjw3cSSBhBGEiwAVII0Z-7utscsbxqYYMa4h3QCALZ_DkChfECxDVhp-K8eNBP0MTEPUvzBFxoCUIAQAvD_BwE"
                    /> 

                </>

            : <>
                <div className='videoDetails_bottomAd'>
                    <AdSide
                        Image={Image}
                        Link="https://gamersupps.gg/?afmc=213&cmp_id=15872452240&adg_id=131805543003&kwd=&device=c&gclid=CjwKCAjw3cSSBhBGEiwAVII0Z-7utscsbxqYYMa4h3QCALZ_DkChfECxDVhp-K8eNBP0MTEPUvzBFxoCUIAQAvD_BwE"
                    />
                    <AdSide
                        Image={Image}
                        Link="https://gamersupps.gg/?afmc=213&cmp_id=15872452240&adg_id=131805543003&kwd=&device=c&gclid=CjwKCAjw3cSSBhBGEiwAVII0Z-7utscsbxqYYMa4h3QCALZ_DkChfECxDVhp-K8eNBP0MTEPUvzBFxoCUIAQAvD_BwE"
                    />
                    <AdSide
                        Image={Image}
                        Link="https://gamersupps.gg/?afmc=213&cmp_id=15872452240&adg_id=131805543003&kwd=&device=c&gclid=CjwKCAjw3cSSBhBGEiwAVII0Z-7utscsbxqYYMa4h3QCALZ_DkChfECxDVhp-K8eNBP0MTEPUvzBFxoCUIAQAvD_BwE"
                    />
                    <AdSide
                        Image={Image}
                        Link="https://gamersupps.gg/?afmc=213&cmp_id=15872452240&adg_id=131805543003&kwd=&device=c&gclid=CjwKCAjw3cSSBhBGEiwAVII0Z-7utscsbxqYYMa4h3QCALZ_DkChfECxDVhp-K8eNBP0MTEPUvzBFxoCUIAQAvD_BwE"
                    />
                </div>

                <AdMiddle 
                    Image={Image2}
                    Link="https://gamersupps.gg/?afmc=213&cmp_id=15872452240&adg_id=131805543003&kwd=&device=c&gclid=CjwKCAjw3cSSBhBGEiwAVII0Z-7utscsbxqYYMa4h3QCALZ_DkChfECxDVhp-K8eNBP0MTEPUvzBFxoCUIAQAvD_BwE"
                /> 

            </>}

        </div>
    )
}

export default VideoDetails
