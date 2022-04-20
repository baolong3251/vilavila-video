import React from 'react'
import "./style_adSide.scss"

function AdSide({Image, Link}) {
    return (
        <div className='adSide'>

            <div className='adSide_adCard'>
                        
                <div className='adSide_adCard_img'>
                    <a href={Link} target="_blank">
                        <img src={Image} />
                    </a>
                </div>
                
            </div>
        </div>
    )
}

export default AdSide
