import React, { useEffect, useState } from 'react'
import { firestore } from '../../firebase/utils'
import "./style_adminExchange.scss"

import { doc, updateDoc, increment } from "firebase/firestore";

import moment from 'moment'
import 'moment/locale/vi';

function AdminExchange() {

    const [exchanges, setExchanges] = useState([])

    useEffect(() => {
    
        firestore.collection("MoneyExchange").orderBy("time", "asc").onSnapshot(snapshot => {
            setExchanges(snapshot.docs.map(doc => ({
                id: doc.id, 
                amount: doc.data().amount,
                bankNumber: doc.data().bankNumber,
                bankName: doc.data().bankName,
                email: doc.data().email,
                name: doc.data().name,
                time: doc.data().time,
                uid: doc.data().uid,
            })))
        })
       
    }, [])

    const handleUpdate = (id, point, docId) => {
        const washingtonRef = doc(firestore, "users", id);

        // Atomically increment the population of the city by 50.
        updateDoc(washingtonRef, {
            point: increment(-point)
        });

        firestore.collection("MoneyExchange").doc(docId).delete()

    }

    const getData = (id) => {
        
    }

    return (
        <div className='adminExchange'>

            {exchanges.map(exx => {
                return(
                    <div key={exx.id} className='adminExchange_container'>
                        <div className='adminExchange_item'>
                            <b>ID:</b> {exx.uid} • <b>Tên:</b> {exx.name} • <b>Thời gian:</b> {moment(exx.time.toDate()).locale('vi').calendar()}
                        </div>
                        <div className='adminExchange_item'>
                            <b>Email:</b> {exx.email} 
                        </div>
                        <div className='adminExchange_item'>
                            <b>Số tài khoản:</b> {exx.bankNumber}
                        </div>
                        <div className='adminExchange_item'>
                            <b>Tên ngân hàng:</b> {exx.bankName}
                        </div>
                        <div className='adminExchange_item'>
                            <b>Số điểm quy đổi:</b> {new Intl.NumberFormat().format(exx.amount)}
                        </div>
                        <div onClick={() => handleUpdate(exx.uid, exx.amount, exx.id)} className='button'>
                            Xác nhận đã xử lý
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default AdminExchange