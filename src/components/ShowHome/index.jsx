import React from 'react'
import AdOnTop from '../DisplayAd/AdOnTop'
import FollowingVideo from '../FollowingVideo'
import "./style_showhome.scss"


function ShowHome() {
    return (
        <div className='homepage'>

            <FollowingVideo />

            <AdOnTop />

            <div className='container_video'>
                new random job
            </div>

            <div className='container_video'>
                picture
            </div>

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
