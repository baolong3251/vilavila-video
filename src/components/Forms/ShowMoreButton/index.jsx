import React from 'react'
import "./style_showMoreButton.scss"

//This is for convert any of fucking text into a button

const ShowMoreButton = ({ children, ...otherProps }) => {
    return( 
        <button className="showmore_btn" {...otherProps}>
            {children}
        </button>
    )
}

export default ShowMoreButton
