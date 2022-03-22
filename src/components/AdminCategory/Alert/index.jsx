import React, { useState } from 'react'
import Button from '../../Forms/Button'
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';

const StyledTableCell = withStyles((theme) => ({
    head: {
      background: '#333333',
      color: "white",
      fontSize: 14,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);

function Alert(props) {
    const [statShow, setStatShow] = useState(false)

    return (
            <StyledTableCell align="right">
                <div className='delete_button' onClick={() => setStatShow(!statShow)}>
                    Xóa
                </div>

                <div className={statShow ? "tableShow active" : "tableShow"}>
                    <h2>
                    Xóa thể loại?
                    </h2>
                    <p>
                    Bạn chắc chắn là sẽ thực hiện điều này chứ?
                    </p>
                    <p>Hãy nhấn nút xác nhận để thực hiện thao tác, hoặc nhấn hủy để hủy bỏ thao tác</p>
                    <p>
                    Lưu ý: Thể loại animation sẽ không thể bị xóa khỏi hệ thống
                    </p>
                    <div className='button_flex'>
                    <Button onClick={() => props.handleDelete(props.row.id, props.row.name)}>
                        Xác nhận
                    </Button>
                    <Button onClick={() => setStatShow(!statShow)}>
                        Hủy
                    </Button>
                    </div>
                </div>
            </StyledTableCell>
    )
}

export default Alert