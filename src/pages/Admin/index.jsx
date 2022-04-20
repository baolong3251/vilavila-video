import React, { useEffect, useState } from 'react'
import { firestore } from '../../firebase/utils'
import "./style_admin.scss"
import {Pie, Doughnut} from "react-chartjs-2"

function Admin() {
  const [category, setCategory] = useState([])
  const [notSortedArray, setNotSortedArray] = useState([])
  const [sortedArray, setSortedArray] = useState([])
  const [exchanges, setExchanges] = useState([])
  const [doneReported, setDoneReported] = useState([])

  useEffect(() => {
    
    handleGetData()
    handleGetData2()
    handleGetData3()
    handleGetData4()
   
  }, [])

  console.log(notSortedArray)

  useEffect(() => {
    
    if(notSortedArray.length > 0){
      var result = notSortedArray.map(a => a.contentId);
      eliminateDuplicates(result)
    }
   
  }, [notSortedArray])

  const handleGetData = () => {
    firestore.collection("category").orderBy("name").onSnapshot(snapshot => {
      setCategory(snapshot.docs.map(doc => ({
        id: doc.id, 
        name: doc.data().name,
        quantity: doc.data().quantity,
      })))
    })
  }

  const handleGetData2 = () => {
    firestore.collection("contentStatus").where("reported", "==", "true").onSnapshot(snapshot => {
      setNotSortedArray(snapshot.docs.map(doc => ({
        id: doc.id, 
        contentId: doc.data().contentId,
        reportDesc: doc.data().reportDesc,
      })))
    })
  }

  const handleGetData3 = () => {
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
  }

  const handleGetData4 = () => {
    firestore.collection("reportLog").onSnapshot(snapshot => {
      setDoneReported(snapshot.docs.map(doc => ({
        id: doc.id, 
        method: doc.data().method,
        contentId: doc.data().contentId,
        time: doc.data().time,
        contentName: doc.data().contentName,
        reportId: doc.data().reportId,
        userId: doc.data().userId,
      })))
    })
  }

  const eliminateDuplicates = (arr) => {
    var i,
        len = arr.length,
        out = [],
        obj = {};
  
    for (i = 0; i < len; i++) {
      obj[arr[i]] = 0;
    }
    for (i in obj) {
        out.push(i);
    }
    setSortedArray(out)
  }

  const countItem = (arr) => {
    var someArray = notSortedArray
    someArray = someArray.filter(element => element.contentId == arr)
    var number = someArray.length

    return(
      number
    )
  }

  return (
    <div className='admin'>

      {/* <div className='admin_container'>
        <h2>
          Các yêu cầu quy đổi
        </h2>
        {
          exchanges.map(exx => {
            return(
              <div className="containerForCat" key={exx.id}>
                <div className="">
                  {exx.id}
                </div>
                <div className="">
                  {exx.amount}
                </div>
              </div>
            )
          })
        }
      </div> */}

      {/* <div className='admin_container'>
        <h2>
          Thể loại
        </h2>
        {
          category.map(cat => {
            return(
              <div className="containerForCat" key={cat.id}>
                <div className="">
                  {cat.name}
                </div>
                <div className="">
                  {cat.quantity}
                </div>
              </div>
            )
          })
        }
      </div> */}
      <div className='admin_container'>
        <Doughnut 
          data={{
            labels: category.map(a => a.name),
            datasets: [{
              label: 'Thể loại',
              data: category.map(a => a.quantity),
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
            }]
          }}
          height={400}
          width={600}
          options={{
            color: ["white"],
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
            },
          }}
        />
      </div>

      <div className='admin_container'>
        <Doughnut 
          data={{
            labels: ["Báo cáo chờ xử lý", "Báo cáo đã xử lý"],
            datasets: [{
              label: 'Thể loại',
              data: [sortedArray.length, doneReported.length],
              backgroundColor: [
                  '#BB86FC',
                  '#03DAC6',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  '#BB86FC',
                  '#03DAC6',
                  'rgba(255, 206, 86, 0.5)',
                  'rgba(75, 192, 192, 0.5)',
                  'rgba(153, 102, 255, 0.5)',
                  'rgba(255, 159, 64, 0.5)'
              ],
              borderWidth: 1
            }]
          }}
          height={400}
          width={600}
          options={{
            color: ["white"],
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
            },
          }}
        />
      </div>

      {/* <div className='admin_container'>
        <h2>
          Báo cáo
        </h2>
        <p>Báo cáo chờ xử lý: {sortedArray.length}</p>
        <p>Báo cáo đã xử lý: {doneReported.length}</p> */}
        {/* {
          sortedArray.map(report => {
            
            return(
              <div className="containerForCat" key={report}>
                <div className="">
                  {report}
                </div>
                
                <div className="">
                  {countItem(report)}
                </div>
              </div>
            )
          })
        } */}
      {/* </div> */}
    </div>
  )
}

export default Admin