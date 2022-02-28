import React from 'react'
import { Link } from 'react-router-dom'
import "./style_adcard.scss"

function AdCard({image, link}) {
    return (
        <div className='adCard'>
            
            <div className='adCard_img'>
                <a href={link}>
                    <img src={image} />
                </a>
            </div>
            
        </div>
    )
}

export default AdCard
