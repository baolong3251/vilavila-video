import React from 'react'
import "./style_footer.scss"
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import InstagramIcon from '@material-ui/icons/Instagram';

import Image from "../../assets/16526305592141308214.png"
import AdMiddle from '../DisplayAd/AdMiddle';

const Footer = props => {
    return (
        <footer className="footer">
            <div className="wrap">
                © Zesta 2021
            </div>
            <div className='wrap-ad'>
                <AdMiddle 
                    Image={Image}
                    Link="https://gamersupps.gg/?afmc=213&cmp_id=15872452240&adg_id=131805543003&kwd=&device=c&gclid=CjwKCAjw3cSSBhBGEiwAVII0Z-7utscsbxqYYMa4h3QCALZ_DkChfECxDVhp-K8eNBP0MTEPUvzBFxoCUIAQAvD_BwE"
                />
            </div>          
            <div className='wrap-icons'>
                <a href='https://www.facebook.com/' target={"_blank"}>
                    <FacebookIcon className='wrap-icon' />
                </a>
                <a href='https://twitter.com/home' target={"_blank"}>
                    <TwitterIcon className='wrap-icon' />
                </a>
                <a href='https://www.instagram.com/' target={"_blank"}>
                    <InstagramIcon className='wrap-icon' />
                </a>
            </div>
        </footer>
    )
}

export default Footer
