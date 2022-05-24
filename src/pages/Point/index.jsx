import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { auth, firestore } from '../../firebase/utils'
import "./style_point.scss"

import { doc, updateDoc, increment } from "firebase/firestore";
import Button from '../../components/Forms/Button'

const mapState = (state) => ({ //this thing can happen if use redux
  currentUser: state.user.currentUser,
})

function Point() {
  const { currentUser } = useSelector(mapState);
  const userId = currentUser.id
  const [userInfo, setUserInfo] = useState([])
  const [statShow, setStatShow] = useState(false)
  const [statShow2, setStatShow2] = useState(false)
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

  useEffect(() => {
    if(currentUser){
      getData()
    }
  }, [currentUser])

  const getData = () => {
    firestore.collection("users").doc(userId).get().then(snapshot => {
      setUserInfo([{
        id: snapshot.id,
        displayName: snapshot.data().displayName,
        point: snapshot.data().point,
        abilityShowMore: snapshot.data().abilityShowMore,
        abilityAdsBlock: snapshot.data().abilityAdsBlock,
      }])
    })
  }

  const handleUpdateAdsBlock = () => {
    var time = new Date()
    if(userInfo.length > 0){

      if(userInfo[0].point < 20000){
        alert("Xin lỗi, điểm của bạn không đủ để kích hoạt chức năng này...")
        return
      }

      if(userInfo[0].abilityAdsBlock && userInfo[0].abilityAdsBlock == "true"){
        alert("Bạn đã đăng ký chức năng này trước đó rồi!!")
        return
      }

      if(userInfo[0].abilityAdsBlock && userInfo[0].abilityAdsBlock == "false"){
        // const docz = doc(firestore, "users", userId);

        // // Atomically increment the population of the city by 50.
        // updateDoc(docz, {
        //     point: increment(-20000)
        // });

        firestore.collection("users").doc(userId).set({
          point: increment(-20000),
          abilityAdsBlock: "true",
          adsBlockActiveDay: time,
        }, {merge: true})
      }

      if(!userInfo[0].abilityAdsBlock){
        // const docz = doc(firestore, "users", userId);

        // // Atomically increment the population of the city by 50.
        // updateDoc(docz, {
        //     point: increment(-20000)
        // });

        firestore.collection("users").doc(userId).set({
          point: increment(-20000),
          abilityAdsBlock: "true",
          adsBlockActiveDay: time,
        }, {merge: true})
      }

      alert("Kích hoạt thành công!!")
      if(currentUser){
        getData()
      }
      setStatShow(!statShow)

    }
  }

  console.log(userInfo)

  const handleUpdateShowMore = () => {
    var time = new Date()
    if(userInfo.length > 0){

      if(userInfo[0].point < 50000){
        alert("Xin lỗi, điểm của bạn không đủ để kích hoạt chức năng này...")
        return
      }

      if(userInfo[0].abilityShowMore && userInfo[0].abilityShowMore == "true"){
        alert("Bạn đã đăng ký chức năng này trước đó rồi!!")
        return
      }

      if(userInfo[0].abilityShowMore && userInfo[0].abilityShowMore == "false"){
        // const docz = doc(firestore, "users", userId);

        // // Atomically increment the population of the city by 50.
        // updateDoc(docz, {
        //     point: increment(-50000)
        // });

        firestore.collection("users").doc(userId).set({
          point: increment(-50000),
          abilityShowMore: "true",
          showMoreActiveDay: time,
        }, {merge: true})
      }

      if(!userInfo[0].abilityShowMore){
        // const docz = doc(firestore, "users", userId);

        // // Atomically increment the population of the city by 50.
        // updateDoc(docz, {
        //     point: increment(-50000)
        // });

        firestore.collection("users").doc(userId).set({
          point: increment(-50000),
          abilityShowMore: "true",
          showMoreActiveDay: time,
        }, {merge: true})
      }

      alert("Kích hoạt thành công!!")
      if(currentUser){
        getData()
      }
      setStatShow2(!statShow2)
    }
  }

  return (
    <div className='point'>
        <div className='title'>
          Đóng góp - Donate - Thêm điểm (Tùy cách gọi của bạn)
        </div>
        <p>
          Đóng góp cho page bằng cách thêm điểm, như một món quả từ việc đóng góp của bạn page sẽ gửi bạn lại số điểm tương xứng với số tiền mà bạn donate
        </p>
      
        <div className="leftSide">
            
            <Link to={`/getPoint/20000/${userId}`}>
              <div className='leftSide_item'>
                <h2>20,000 điểm</h2>
                <p>20,000 VNĐ</p>
              </div>
            </Link>
            <Link to={`/getPoint/100000/${userId}`}>
              <div className='leftSide_item'>
                <h2>100,000 điểm</h2>
                <p>100,000 VNĐ</p>
              </div>
            </Link>
            <Link to={`/getPoint/200000/${userId}`}>
              <div className='leftSide_item'>
                <h2>200,000 điểm</h2>
                <p>200,000 VNĐ</p>
              </div>
            </Link>
            <Link to={`/getPoint/500000/${userId}`}>
              <div className='leftSide_item'>
                <h2>500,000 điểm</h2>
                <p>500,000 VNĐ</p>
              </div>
            </Link>
        </div>

        <div className='title'>
          Các chức năng bạn có thể sẽ thích
        </div>

        <p>
          Lưu ý rằng các chức năng này sẽ không tự động gia hạn khi hết hạn dùng
        </p>

        <div className="leftSide">
            
            
          <div className='leftSide_item' onClick={() => setStatShow(!statShow)}>
            <h2>Tắt quảng cáo</h2>
            <p>20,000 điểm / tuần</p>
            <p>Chỉ với 20,000 điểm bạn có thể tắt quảng cáo popup ở trang đầu, cùng các quảng cáo xuất hiện khi bạn xem nội dung</p>
          </div>
        
          <div className='leftSide_item' onClick={() => setStatShow2(!statShow2)}>
            <h2>Xuất hiện nhiều hơn</h2>
            <p>50,000 điểm / tháng</p>
            <p>Sau khi chọn chức này thì sau một tháng tới các nội dung của bạn sẽ được hiển thị nhiều hơn</p>
          </div>
            
            
        </div>

        <div className={statShow ? "tableShow active" : "tableShow"}>
          <h2>
            Xác nhận kích hoạt
          </h2>
          <p>
            Kích hoạt chức năng tắt quảng cáo
          </p>
          <p>Hãy nhấn nút xác nhận để thực hiện thao tác, hoặc nhấn hủy để hủy bỏ thao tác</p>
          <p>
            Lưu ý: Chức năng này sẽ không tự động gia hạn khi hết hạn dùng
          </p>
          <div className='button_flex'>
            <Button onClick={() => handleUpdateAdsBlock()}>
                Xác nhận
            </Button>
            <Button onClick={() => setStatShow(!statShow)}>
                Hủy
            </Button>
          </div>
        </div>

        <div className={statShow2 ? "tableShow2 active2" : "tableShow2"}>
          <h2>
            Xác nhận kích hoạt
          </h2>
          <p>
            Kích hoạt chức năng xuất hiện nhiều hơn
          </p>
          <p>Hãy nhấn nút xác nhận để thực hiện thao tác, hoặc nhấn hủy để hủy bỏ thao tác</p>
          <p>
            Lưu ý: Chức năng này sẽ không tự động gia hạn khi hết hạn dùng
          </p>
          <div className='button_flex'>
            <Button onClick={() => handleUpdateShowMore()}>
                Xác nhận
            </Button>
            <Button onClick={() => setStatShow2(!statShow2)}>
                Hủy
            </Button>
          </div>
        </div>
        
        {/* <div className="rightSide">
            <div className='title'>
              Đổi Điểm
            </div>
            <Link to={`/exchangePoint/20000/${userId}`}>
              <div className='rightSide_item'>
                <h2>20,000 VNĐ</h2>
                <p>20,000 điểm</p>
              </div>
            </Link>
            <Link to={`/exchangePoint/100000/${userId}`}>
              <div className='rightSide_item'>
                <h2>100,000 VNĐ</h2>
                <p>100,000 điểm</p>
              </div>
            </Link>
            <Link to={`/exchangePoint/200000/${userId}`}>
              <div className='rightSide_item'>
                <h2>200,000 VNĐ</h2>
                <p>200,000 điểm</p>
              </div>
            </Link>
            <Link to={`/exchangePoint/500000/${userId}`}>
              <div className='rightSide_item'>
                <h2>500,000 VNĐ</h2>
                <p>500,000 điểm</p>
              </div>
            </Link>
        </div> */}
      
    </div>
  )
}

export default Point