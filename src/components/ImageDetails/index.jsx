import React, { useEffect, useState } from 'react'
import "./style_imageDetails.scss"

import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchImageStart, setImage } from "../../redux/Images/images.actions";
import { firestore } from '../../firebase/utils';
import {arrayUnion, arrayRemove} from "firebase/firestore"

import Image from "../../assets/17820985376758488689.png"
import Image2 from "../../assets/16526305592141308214.png"

import { Avatar, Button } from '@material-ui/core'
import { Link } from 'react-router-dom'
import Main from './Main';
import SideImageCard from './SideImageCard';
import Comment from './Comment';
import AdSide from '../DisplayAd/AdSide';
import AdMiddle from '../DisplayAd/AdMiddle';
import ImagesForBottom from './ImagesForBottom';

const mapState = state => ({
    image: state.imagesData.image,
    currentUser: state.user.currentUser,
})

function ImageDetails() {
    const dispatch = useDispatch()
    const { imageID } = useParams()
    const { currentUser } = useSelector(mapState);
    const { image } = useSelector(mapState)
    const [channel, setChannel] = useState([])
    const [follow, setFollow] = useState(false)
    const [userInfo, setUserInfo] = useState([])

    const {
        createdDate,
        desc,
        sourceLink,
        tags,
        title,
        imageAdminUID,
    } = image

    console.log(sourceLink)

    useEffect(() => {
        dispatch(
            fetchImageStart(imageID)
        )

        return () => {
            dispatch(
                setImage({})
            )
        }
    }, [imageID])

    useEffect(() => {
        if (imageAdminUID && channel.length == 0) {
            firestore.collection("users").doc(imageAdminUID).onSnapshot((snapshot) => {
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
    }, [imageAdminUID])

    useEffect(() => {
        if(channel.length > 0)
        checkFollow()

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
        if(currentUser && currentUser.id !== imageAdminUID){
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
        if(currentUser && currentUser.id !== imageAdminUID){
            // Put the id of currentUser into the follow array
            const someArray = channel[0].follow
            const found = someArray.find(element => element == currentUser.id);
            if(!found){
                // someArray.push(currentUser.id)
                firestore.collection('users').doc(imageAdminUID).set({
                    follow: arrayUnion(currentUser.id)
                }, { merge: true })
            }

            if(found){
                // const index = someArray.indexOf(currentUser.id);
                // if (index > -1) {
                //     someArray.splice(index, 1); // 2nd parameter means remove one item only
                // }

                firestore.collection('users').doc(imageAdminUID).set({
                    follow: arrayRemove(currentUser.id)
                }, { merge: true })
                
            }
        }
    }

    return (
        <div className='imageDetails'>

            <div className='imageDetails_top'>
                <div className='imageDetails_leftSide'>

                    <Main
                        id={imageID}
                        urls={sourceLink}
                        title={title}
                        desc={desc}
                        date={createdDate}
                        tags={tags}
                        imageAdminUID={imageAdminUID}
                        abilityShowMore={channel.length !== 0 ? channel[0].abilityShowMore ? channel[0].abilityShowMore : "false" : null}
                        abilityAdsBlock={userInfo.length !== 0 ? userInfo[0].abilityAdsBlock ? userInfo[0].abilityAdsBlock : "false" : null}
                    />

                    <Comment />

                </div>

                <div className='imageDetails_rightSide'>

                    <div className='imageDetails_rightSide_info'>
                        <Avatar src={channel.length !== 0 ? channel[0].avatar : null} className='imageDetails_rightSideAvatar' />
                        <div className='imageDetails_rightSideText'>
                            <Link>
                                <h4>
                                    {channel.length !== 0 ? channel[0].displayName : null}
                                </h4>
                            </Link>
                            <p>{channel.length !== 0 ? channel[0].follow.length : null} lượt theo dõi</p>
                            {
                            !follow ? 
                            <Button onClick={() => handleFollow()} className='imageDetails_rightSideText_button'>+ Theo dõi</Button> : 
                            <Button onClick={() => handleFollow()} className='imageDetails_rightSideText_button'>- Bỏ theo dõi</Button>
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

                    <SideImageCard imageAdminId = {imageAdminUID} />

                </div>

            </div>

            {/* THIS WILL SHOW WHEN REsPONSIVE */}
            <div className='imageDetails_bottom'>
                <div className='imageDetails_bottom'>
                    <Comment />
                </div>
            </div>

            <div>
                {imageAdminUID ? 
                    <ImagesForBottom  
                        imageAdminId = {imageAdminUID}
                        tags = {tags ? tags : []}
                        id = {imageID} 
                    />
                : null}
            </div>


            {userInfo.length > 0 ? 
                userInfo[0].abilityAdsBlock == "true" ? null
                : <>
                    <div className='imageDetails_bottomAd'>
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
                <div className='imageDetails_bottomAd'>
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

export default ImageDetails