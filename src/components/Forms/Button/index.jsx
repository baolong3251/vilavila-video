import React from 'react'
import "./style_Button.scss"

//This is for convert any of fucking text into a button

const Button = ({ children, ...otherProps }) => {
    return( 
        <button className="btn" {...otherProps}>
            {children}
        </button>
    )
}

export default Button
