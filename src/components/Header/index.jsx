import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { signOutUserStart } from '../../redux/User/user.action'
import { Link } from "react-router-dom"
import "./style_header.scss"

import SearchIcon from '@material-ui/icons/Search';
import VideoCallIcon from '@material-ui/icons/VideoCall';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AddIcon from '@material-ui/icons/Add';
import ImageIcon from '@material-ui/icons/Image';
import { firestore } from '../../firebase/utils'

const mapState = (state) => ({ //this thing can happen if use redux
    currentUser: state.user.currentUser,
})

function Header() {
    const dispatch = useDispatch();
    const { currentUser } = useSelector(mapState);
    const [inputSearch, setInputSearch] = useState("")
    const [open, setOpen] = useState(false)
    const [open2, setOpen2] = useState(false)
    const [point, setPoint] = useState(0)
    const [userInfo, setUserInfo] = useState([])

    const signOut = () => {
        dispatch(signOutUserStart());
    }

    useEffect(() => {
        if(currentUser) {
            firestore.collection("users").doc(currentUser.id).onSnapshot((snapshot) => {
                setUserInfo([...userInfo, {
                    userId: snapshot.id,
                    displayName: snapshot.data().displayName,
                    thumbnail: snapshot.data().thumbnail,
                    point: snapshot.data().point,
                }])
            })
        }
    },[currentUser])

    useEffect(() => {
        getPoint()
    },[userInfo])

    const getPoint = () => {
        if(userInfo.length > 0) {
            var testPoint = userInfo[0].point
            if(testPoint){
                var thing = userInfo[0].point * 1
                setPoint(thing)
            }
        }
    }

    const handleOnclick = () => {
        if(open2){
            setOpen(!open)
            setOpen2(false)
        }

        if(!open2){
            setOpen(!open)
            setOpen2(false)
        }
    }

    const handleOnclick2 = () => {
        if(open){
            setOpen(false)
            setOpen2(!open2)
        }

        if(!open){
            setOpen(false)
            setOpen2(!open2)
        }
    }

    return (
        <div className='header'>
            <div className='wrap'>
                
                <div className='header_optionLeft'>
                    <ul>
                        <li className='header_optionLeft_icon'>
                            <Link to={`/`}>
                                VilaVila-Video
                            </Link>
                        </li>
                        
                        <li>
                            <Link to={`/videos`}>
                                Videos
                            </Link>
                        </li>

                        <li>
                            <Link to={`/images`}>
                                Hình ảnh
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className='header_search_bar'>
                    
                    <input 
                        onChange={e => setInputSearch(e.target.value)} 
                        value={inputSearch} 
                        placeholder='Tìm kiếm' 
                        className='search_bar' 
                    />
                    
                    
                    <div className='search_icon'>
                        <Link to={`/search/${inputSearch}`}>
                            <SearchIcon className='search_icon_inside' />
                        </Link>
                    </div>
                
                </div>

                <div className='header_optionRight'>
                    <ul>

                        {currentUser && [

                                <li>
                                    <a href='javascript:void(0)' onClick={() => handleOnclick()}>
                                        <div className='header_optionRight_box'>
                                            <AddIcon className='header_optionRight_icon' />
                                        </div>
                                    </a>

                                    {open && [
                                        <div className="dropdown">
                                            <Link to={`/uploadvideo`} className="dropdown_menuItem">
                                                <div className='dropdown_menuItemIcon_Container'>
                                                    <VideoCallIcon className='dropdown_menuItemIcon' /> 
                                                </div>
                                                Đăng Video
                                            </Link>
                                            <Link to={`/uploadimage`} className="dropdown_menuItem">
                                                <div className='dropdown_menuItemIcon_Container'>
                                                    <ImageIcon className='dropdown_menuItemIcon' /> 
                                                </div>
                                                Đăng Hình
                                            </Link>
                                        </div>
                                    ]}
                                </li>,    
                                <li>
                                    <a href='javascript:void(0)' onClick={() => handleOnclick2()}> 
                                        <div className='header_optionRight_box'>
                                            <AccountBoxIcon className='header_optionRight_icon' />
                                        </div>
                                    </a>
                                    {/* to={`/user/${currentUser.id}`} */}
                                    {open2 && [
                                        <div className="dropdown">
                                            <Link to={`/user/${currentUser.id}`} className="dropdown_menuItem">
                                                <div className='dropdown_menuItemIcon_Container'>
                                                    <AccountBoxIcon className='dropdown_menuItemIcon' /> 
                                                </div>
                                                Trang cá nhân
                                            </Link>
                                            <Link to={`/point/${currentUser.id}`} className="dropdown_menuItem">
                                                Điểm hiện tại: {new Intl.NumberFormat().format(point)} điểm
                                                (+)
                                            </Link>
                                        </div>
                                    ]}
                                </li>,
                                <li>
                                    <span onClick={() => signOut()}>
                                        <div className='header_optionRight_box'>
                                            <ExitToAppIcon className='header_optionRight_icon' />
                                        </div>
                                    </span>
                                </li>
                            
                        ]}

                        {!currentUser && [
                                
                                <li>
                                    <Link to="/registration">
                                        Đăng ký
                                    </Link>
                                </li>,
                                <li>
                                    <Link to="/login">
                                        Đăng nhập
                                    </Link>
                                </li>
                            
                        ]}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Header
