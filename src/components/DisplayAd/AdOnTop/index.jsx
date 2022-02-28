import React from 'react'
import AdCard from '../../AdCard'
import Image from "../../../assets/TikTok-Banner.png"

function AdOnTop() {
    return (
        <div>
            <AdCard 
                image={Image}
                link="https://www.tiktok.com/en/"
            />
        </div>
    )
}

export default AdOnTop
