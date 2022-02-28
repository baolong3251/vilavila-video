import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'


const VideoLayout = props => {
    return (
        <div>
            <Header {...props}/>
            <div className="mainVideo">
                {props.children}
            </div>
            <Footer />
        </div>
    )
}

export default VideoLayout
