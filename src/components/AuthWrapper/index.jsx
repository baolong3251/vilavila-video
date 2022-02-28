import React from 'react'
import './style_AuthWrapper.scss'

const AuthWrapper = ({ headline, children }) => {
    return (
        <div className="authWrapper">
            <div className="wrap_authWrapper">
                {headline && <h2>{headline}</h2>}

                <div className="children">
                    {children && children}
                </div>
            </div>
        </div>
    )
}

export default AuthWrapper
