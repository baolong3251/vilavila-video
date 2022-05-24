import React, { useState } from 'react'
import { firestore } from '../../../firebase/utils'
import Button from '../../Forms/Button'
import FormInput from '../../Forms/FormInput'
import {increment} from "firebase/firestore"

function AddPointAlert(props) {
    const [statShow, setStatShow] = useState(false)
    const [pointValue, setPointValue] = useState(0)

    const handleAddPoint = () => {
        if(pointValue == "") {
            alert("Xin nhập số điểm bạn muốn...")
            return
        }
        if(pointValue < 0){
            alert("Xin nhập số điểm lớn hơn 0")
            return
        }
        firestore.collection("users").doc(props.sd.id).set({
            point: increment(pointValue)
        }, {merge: true}).then(
            alert("Thêm điểm thành công!!"),
            setStatShow(!statShow)
        )
    }
    return (
        <>
        <Button onClick={() => setStatShow(!statShow)}>
            Thêm điểm
        </Button>
        <div className={statShow ? "tableShow active" : "tableShow"}>
            <h2>
                Thêm điểm
            </h2>
            <FormInput 
                type="number"
                className="inputText_adminAccount"
                value={pointValue}
                onChange={(e) => setPointValue(e.target.value)}
            />
            <p>{new Intl.NumberFormat().format(pointValue)}</p>
            <p>Hãy nhấn nút xác nhận để thực hiện thao tác, hoặc nhấn hủy để hủy bỏ thao tác</p>
            
            <div className='button_flex'>
            <Button onClick={() => handleAddPoint()}>
                Xác nhận
            </Button>
            <Button onClick={() => setStatShow(!statShow)}>
                Hủy
            </Button>
            </div>
        </div>
        </>
    )
}

export default AddPointAlert