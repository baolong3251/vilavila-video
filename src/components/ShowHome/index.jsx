import React from 'react'
import AdOnTop from '../DisplayAd/AdOnTop'
import FollowingVideo from '../FollowingVideo'
import ImagesForHomePage from '../ImagesForHomePage'
import "./style_showhome.scss"
import Image from "../../assets/TikTok-Banner.png"
import { useSelector } from 'react-redux'

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

            <div className='container_video'>
                random job
            </div>

            <div className='homepage_column'>
                <div className='homepage_columnTag'>
                    <FollowingVideo />
                </div>
                <div className='homepage_columnRanking'>
                    <h2 className='label_video_type'>Top trending</h2>
                    <div>
                        Top 1: something
                    </div>
                    <div>
                        Top 1: something
                    </div>
                    <div>
                        Top 1: something
                    </div>
                </div>
            </div>

            <FollowingVideo />
            <FollowingVideo />

            <ImagesForHomePage />

            <div className='container_video'>
                music
            </div>

            <div className='container_video'>
                animation
            </div>

            <div className='container_video'>
                meme
            </div>

        </div>
    )
}

export default ShowHome
