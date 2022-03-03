import React from 'react'
import AdOnTop from '../DisplayAd/AdOnTop'
import FollowingVideo from '../FollowingVideo'
import ImagesForHomePage from '../ImagesForHomePage'
import "./style_showhome.scss"


function ShowHome() {
    return (
        <div className='homepage'>

            <FollowingVideo />

            <AdOnTop />

            <div className='container_video'>
                new random job
            </div>

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
