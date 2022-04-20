import React, { useEffect, useState } from 'react'
import { FormControl, FormControlLabel, Radio, RadioGroup } from '@material-ui/core'
import FormInput from "../Forms/FormInput"
import "./style_getPoint.scss"
import { auth } from '../../firebase/utils'
import { useParams } from 'react-router-dom'
import Button from '../Forms/Button'

function GetPoint() {
  const { cost } = useParams()
  const { userID } = useParams()
  const email = auth.currentUser.email
  const [paymentMethod, setPaymentMethod] = React.useState('vnPay');

  const handleChangeChoice = (event) => {
    setPaymentMethod(event.target.value);
  };

  return (
    <form action={`/payment/checkout/${cost}/${email}/${paymentMethod}/${userID}`} method="POST" className='getPoint' autocomplete>
        <div className='getPoint-left'>
          <FormInput 
            label="Tên"
          />

          <FormInput 
            label="Email"
            type="email"
            value={email}
            // name="customerEmail"
            name="email"
            disabled
          />

          <FormInput 
            label="Giá tiền"
            name="amount"
            value={cost*1}
            disabled
          />

          <Button type="submit" value="Checkout">
            Thanh toán
          </Button>
        </div>

        <div className='getPoint-right'>
          <FormControl className='userVideos-videoCard-radioBoxContainer' component="fieldset">
              <label>Hình thức thanh toán</label>
              <RadioGroup className='userVideos-videoCard-radioBox displaySomething' aria-label="gender" name="gender1" value={paymentMethod} onChange={handleChangeChoice}>
                  {/* <FormControlLabel className='displaySomething' value="onepayDomestic" control={<Radio />} name="paymentMethod" label="Onepay Domestic" />
                  <FormControlLabel className='displaySomething' value="onepayInternational" control={<Radio />} name="paymentMethod" label="Onepay International" />
                  <FormControlLabel className='displaySomething' value="sohaPay" control={<Radio />} name="paymentMethod" label="SohaPay" /> */}
                  <FormControlLabel className='displaySomething' value="vnPay" control={<Radio />} name="paymentMethod" label="VnPay" />
                  {/* <FormControlLabel className='displaySomething' value="nganluong" control={<Radio />} name="paymentMethod" label="Ngân Lượng (ATM)" />
                  <FormControlLabel className='displaySomething' value="nganluongvisa" control={<Radio />} name="paymentMethod" label="Ngân Lượng (VISA)" /> */}
              </RadioGroup>
          </FormControl>
        </div>
    </form>
  )
}

export default GetPoint