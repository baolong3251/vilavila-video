import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'


const ImageLayout = props => {
    return (
        <div>
            <Header {...props}/>
            <div className="mainImage">
                {props.children}
            </div>
            <Footer />
        </div>
    )
}

export default ImageLayout
