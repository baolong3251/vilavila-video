import React from 'react'
import AdCard from '../../AdCard'

function AdOnTop({Image, Link}) {
    return (
        <div>
            <AdCard 
                image={Image}
                link={Link}
            />
        </div>
    )
}

export default AdOnTop
