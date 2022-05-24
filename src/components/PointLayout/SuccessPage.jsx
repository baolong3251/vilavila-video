import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import "./style_successPage.scss"

function SuccessPage() {
    const { results } = useParams()

    console.log(results)

    // const fetchData = async () => {
    //     const res = await fetch('/payment/:gateway/callback');
    //     const setData = await res.json();
    //     setData(data);
    // } 

    return (
        <div className='successPage'>
            <h2>
                Giao dịch thành công!!!
            </h2>

            <p className="">
                Số điểm của bạn đã được thay đổi.
                
            </p>
            <p className="">
                Cảm ởn vì sự đóng góp của bạn.
            </p>

            <p className="">
                Mọi thắc mắc xin liên hệ
                với admin.
            </p>
        </div>
    )
}

export default SuccessPage