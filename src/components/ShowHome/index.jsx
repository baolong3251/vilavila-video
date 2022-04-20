import React from 'react'
import AdOnTop from '../DisplayAd/AdOnTop'
import FollowingVideo from '../FollowingVideo'
import ImagesForHomePage from '../ImagesForHomePage'
import "./style_showhome.scss"
import Image from "../../assets/TikTok-Banner.png"
import { useSelector } from 'react-redux'
import RankingTable from './RankingTable'
import AnimationVideo from '../CategoryGroup/AnimationVideo'
import RandomVideo from './RandomVideo'
import HandleCheckTierLog from './HandleCheckTierLog'
import ShowMoreVideos from './ShowMoreVideos'
import HandleCheckAbility from './HandleCheckAbility'

const mapState = ({user}) => ({
    currentUser: user.currentUser
})


function ShowHome() {
    const { currentUser } = useSelector(mapState)
    return (
        <div className='homepage'>

            {currentUser && [
                <FollowingVideo />
            ]}

            <AdOnTop 
                Image={Image}
                Link="https://www.tiktok.com/en/"
            />

            <RandomVideo />

            <ShowMoreVideos />

            <RankingTable />
            
            <AdOnTop 
                Image={Image}
                Link="https://www.tiktok.com/en/"
            />

            <ImagesForHomePage />

            <AnimationVideo />

            {currentUser && [
                <HandleCheckTierLog />
            ]}

            {currentUser && [
                <HandleCheckAbility />
            ]}

        </div>
    )
}

export default ShowHome
