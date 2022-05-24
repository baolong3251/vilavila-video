import React from "react"
import { Link, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { signOutUserStart } from "../redux/User/user.action"

import Header from "../components/Header"
import VerticalNav from "../components/VerticalNav"
import Footer from "../components/Footer"

const mapState = ({ user }) => ({
    currentUser: user.currentUser
})

const AdminLayout = props => {
    const dispatch = useDispatch();
    const {currentUser} = useSelector(mapState)
    const { userID } = useParams()

    const signOut = () => {
        dispatch(signOutUserStart());
    }

    console.log(userID)

    return (
        <div className="adminLayout">
            <Header />
            <div className="controlPanel">
                <div className="sidebar">
                    <VerticalNav>
                        <ul>
                            <li>
                                <Link to={`/user/${userID}`}>
                                    Trang chủ
                                </Link>
                            </li>
                            <li>
                                <Link to={`/user/videos/${userID}`}>
                                    Videos
                                </Link>
                            </li>
                            <li>
                                <Link to={`/user/images/${userID}`}>
                                    Hình ảnh
                                </Link>
                            </li>
                            {currentUser ?
                                currentUser.id == userID ? 
                                    <li>
                                        <Link to={`/user/tiers/${userID}`}>
                                            Cấp bậc
                                        </Link>
                                    </li> : null 
                                : null
                            }
                            {currentUser ?
                                currentUser.id == userID ? 
                                    <li>
                                        <Link to={`/user/liked/${userID}`}>
                                            Nội dung đã thích
                                        </Link>
                                    </li> : null 
                                : null
                            }
                            {currentUser ?
                                currentUser.id == userID ? 
                                    <li>
                                        <Link to={`/user/saved/${userID}`}>
                                            Nội dung đã lưu
                                        </Link>
                                    </li> : null 
                                : null
                            }
                            {currentUser ?
                                currentUser.id == userID ? 
                                    <li>
                                        <Link to={`/user/private/${userID}`}>
                                            Riêng tư
                                        </Link>
                                    </li> : null 
                                : null
                            }

                            {/* <li>
                                <span className="signOut" onClick={() => signOut()}>
                                    Sign Out
                                </span>
                            </li> */}
                        </ul>
                    </VerticalNav>
                    
                    
                </div>
                
                <div className="content">
                    {props.children}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default AdminLayout