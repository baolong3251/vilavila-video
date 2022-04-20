import React from 'react'
import AdMiddle from '../../components/DisplayAd/AdMiddle'
import UserDetails from '../../components/UserDetails'
import Image from "../../assets/16526305592141308214.png"

function User() {
  return (
    <div>
        <UserDetails />

        <AdMiddle 
          Image={Image}
          Link="https://gamersupps.gg/?afmc=213&cmp_id=15872452240&adg_id=131805543003&kwd=&device=c&gclid=CjwKCAjw3cSSBhBGEiwAVII0Z-7utscsbxqYYMa4h3QCALZ_DkChfECxDVhp-K8eNBP0MTEPUvzBFxoCUIAQAvD_BwE"
        />
    </div>
  )
}

export default User