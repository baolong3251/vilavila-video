import React from 'react'
import "./style_imageonscreen.scss"
import Image from "../../assets/EU8EmFeVAAAzemU_ccexpress.png"
import Image2 from "../../assets/My project.png"

function ImageOnScreen() {
    return (
        <>
        <div className='imgOnScreen_left'>
            <img className='imgOnScreen_img' src={Image} />
        </div>
        <div className='imgOnScreen_right'>
            <img className='imgOnScreen_img' src={Image2} />
        </div>
        </>
    )
}

export default ImageOnScreen
