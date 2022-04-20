import React, { useState } from 'react'
import Button from '../../Forms/Button'

function Alert(props) {
    const [statShow, setStatShow] = useState(false)
    return (
        <>
        <Button onClick={() => setStatShow(!statShow)}>
            Xóa
        </Button>
        <div className={statShow ? "tableShow active" : "tableShow"}>
            <h2>
                Xóa người dùng?
            </h2>
            <p>
                Bạn chắc chắn là sẽ thực hiện điều này chứ?
            </p>
            <p>Hãy nhấn nút xác nhận để thực hiện thao tác, hoặc nhấn hủy để hủy bỏ thao tác</p>
            
            <div className='button_flex'>
            <Button onClick={() => props.handleDelete(props.sd.id, props.sd.email)}>
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

export default Alert