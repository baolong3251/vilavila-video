import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import "./style_point.scss"

function Point() {
  // const [items, setItems] = useState([])

  // useEffect(() => {
  //   fetchItems()
  // }, [])

  // const fetchItems = async () => {
  //   const data = await fetch('/point')
  //   const itemss = await data.json()
  //   setItems(itemss)
  // }

  // console.log(items)

  return (
    <div className='point'>
      
        <div className="leftSide">
            <div className='title'>
              Thêm Điểm
            </div>
            <div className='leftSide_item'>
              <h2>10,000 point</h2>
              <p>10,000 VND</p>
            </div>
            <div className='leftSide_item'>
              <h2>10,000 point</h2>
              <p>10,000 VND</p>
            </div>
            <div className='leftSide_item'>
              <h2>10,000 point</h2>
              <p>10,000 VND</p>
            </div>
            <div className='leftSide_item'>
              <h2>10,000 point</h2>
              <p>10,000 VND</p>
            </div>
        </div>
        
        <div className="rightSide">
            <div className='title'>
              Đổi Điểm
            </div>
            <div className='rightSide_item'>
              <h2>10,000 VND</h2>
              <p>10,000 point</p>
            </div>
            <div className='rightSide_item'>
              <h2>10,000 VND</h2>
              <p>10,000 point</p>
            </div>
            <div className='rightSide_item'>
              <h2>10,000 VND</h2>
              <p>10,000 point</p>
            </div>
            <div className='rightSide_item'>
              <h2>10,000 VND</h2>
              <p>10,000 point</p>
            </div>
        </div>
      
    </div>
  )
}

export default Point