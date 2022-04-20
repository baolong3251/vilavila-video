import React, { useEffect, useState } from 'react'
import { FormControl, FormControlLabel, Radio, RadioGroup } from '@material-ui/core'
import FormInput from "../Forms/FormInput"
import "./style_getPoint.scss"
import { auth, firestore } from '../../firebase/utils'
import { useParams } from 'react-router-dom'
import Button from '../Forms/Button'

function GetMoneyFromPoint() {
    const { cost } = useParams()
    const { userID } = useParams()
    const email = auth.currentUser.email
    const [paymentMethod, setPaymentMethod] = React.useState('vnPay');
    const [name, setName] = useState('')
    const [bankNumber, setBankNumber] = useState('')
    const [bankName, setBankName] = useState('')
    const [userInfo, setUserInfo] = useState([])

    useEffect(() => {

        firestore.collection('users').doc(userID).get().then(snapshot => {
            setUserInfo([...userInfo, {
                uid: snapshot.id,
                point: snapshot.data().point,
            }])
        })
           
        
    }, [])

    // const handleChangeChoice = (event) => {
    //     setPaymentMethod(event.target.value);
    // };

    const handleUpload = () => {
        if(name == "" || bankName == "" || bankNumber == ""){
            alert("Các khung nội dung không được để trống")
            return
        } 
        if(userInfo.length > 0 && cost > userInfo[0].point){
            alert("Số điểm không đủ để thực hiện yêu cầu")
            return
        } 
        var time = new Date()
        firestore.collection("MoneyExchange").add({
            uid: userID,
            amount: cost,
            time: time,
            email: email,
            name: name,
            bankName: bankName,
            bankNumber: bankNumber,
        }).then(
            alert("Thao tác thành công, các thông tin đã được ghi nhận lại và chờ admin xử lý"),
            reset()
        )
    }

    const reset = () => {
        setBankName('')
        setBankNumber('')
        setName('')
    }

    return (
        <div className='getPoint'>
            <div className='getPoint-left'>
                <FormInput 
                    label="Tên"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    label="Điểm quy đổi"
                    name="amount"
                    value={cost*1}
                    disabled
                />

                <FormInput 
                    label="Tài khoản ngân hàng"
                    name="bank"
                    value={bankNumber}
                    onChange={(e) => setBankNumber(e.target.value)}
                />

                <FormInput 
                    label="Tên ngân hàng"
                    name="bankName"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                />

                <p>Lưu ý: Xin hãy cẩn thận khi điền tài khoản ngân hàng và tên ngân hàng, chúng tôi sẽ không chịu trách nhiệm nếu như tiền không đến được tài khoản cùng số điểm đã mất của bạn, với lý do là ghi sai tài khoản hoặc ghi sai tên ngân hàng</p>

                <Button onClick={() => handleUpload()} value="Checkout">
                    Thanh toán
                </Button>
            </div>

            {/* <div className='getPoint-right'>
            <FormControl className='userVideos-videoCard-radioBoxContainer' component="fieldset">
                <label>Hình thức thanh toán</label>
                <RadioGroup className='userVideos-videoCard-radioBox displaySomething' aria-label="gender" name="gender1" value={paymentMethod} onChange={handleChangeChoice}> */}
                    {/* <FormControlLabel className='displaySomething' value="onepayDomestic" control={<Radio />} name="paymentMethod" label="Onepay Domestic" />
                    <FormControlLabel className='displaySomething' value="onepayInternational" control={<Radio />} name="paymentMethod" label="Onepay International" />
                    <FormControlLabel className='displaySomething' value="sohaPay" control={<Radio />} name="paymentMethod" label="SohaPay" /> */}
                    {/* <FormControlLabel className='displaySomething' value="vnPay" control={<Radio />} name="paymentMethod" label="VnPay" /> */}
                    {/* <FormControlLabel className='displaySomething' value="nganluong" control={<Radio />} name="paymentMethod" label="Ngân Lượng (ATM)" />
                    <FormControlLabel className='displaySomething' value="nganluongvisa" control={<Radio />} name="paymentMethod" label="Ngân Lượng (VISA)" /> */}
                {/* </RadioGroup>
            </FormControl>
            </div> */}
        </div>
    )
}

export default GetMoneyFromPoint