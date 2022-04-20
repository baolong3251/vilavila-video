import React from 'react'
import "./style_adcard.scss"

function AdCard({image, link}) {
    return (
        <div className='adCard'>
            
            <div className='adCard_img'>
                <a href={link} target="_blank">
                    <img src={image} />
                </a>
            </div>
            
        </div>
    )
}

export default AdCard
