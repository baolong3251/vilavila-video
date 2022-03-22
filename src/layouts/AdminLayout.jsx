import React from "react"
import { Link } from "react-router-dom"

import Header from "../components/Header"
import VerticalNav from "../components/VerticalNav"
import Footer from "../components/Footer"

const AdminLayout = props => {

    return (
        <div className="adminLayout">
            <Header />
            <div className="controlPanel">
                <div className="sidebar">
                    <VerticalNav>
                        <ul>
                            <li>
                                <Link to="/admin">
                                    Trang chủ
                                </Link>
                            </li>
                            <li>
                                <Link to="/admin/categorys">
                                    Quản lý thể loại
                                </Link>
                            </li>
                            <li>
                                <Link to="/admin/reports">
                                    Các báo cáo
                                </Link>
                            </li>
                            <li>
                                <Link to="/admin/accounts">
                                    Quản lý tài khoản
                                </Link>
                            </li>
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