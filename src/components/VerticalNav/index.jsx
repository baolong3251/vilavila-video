import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import UserProfile from "../UserProfile"
import "./style_VerticalNav.scss"

const mapState = ({ user }) => ({
    currentUser: user.currentUser
})

const VerticalNav = ({ children }) => {
    const {currentUser} = useSelector(mapState)
    const { userID } = useParams()

    const configUserProfile = {
        userID
    }

    return (
        <div className="verticalNav">
            <UserProfile {...configUserProfile} />

            <div className="menu">
                {children}
            </div>
        </div>
    )
}

export default VerticalNav