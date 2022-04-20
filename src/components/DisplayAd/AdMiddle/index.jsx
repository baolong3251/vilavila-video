import React from 'react'
import "./style_adMiddle.scss"

function AdMiddle({Image, Link}) {
    return (
        <div className='adMiddle'>

            <div className='adMiddle_adCard'>
                        
                <div className='adMiddle_adCard_img'>
                    <a href={Link} target="_blank">
                        <img src={Image} />
                    </a>
                </div>
                
            </div>
        </div>
    )
}

export default AdMiddle
