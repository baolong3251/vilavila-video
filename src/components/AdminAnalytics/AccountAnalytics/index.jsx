import React, { useEffect, useState } from 'react'
import {Bar} from "react-chartjs-2"
import Chart from 'chart.js/auto'
import { firestore } from "../../../firebase/utils"
import moment from 'moment'
import 'moment/locale/vi';
import "./style_accountAnalytics.scss"
import {CSVLink} from "react-csv"


function AccountAnalytics() {
  const [data, setData] = useState([])
  const [yearInData, setYearInData] = useState([])
  const [dataForShow, setDataForShow] = useState([])
  const [dataForDownload1, setDataForDownload1] = useState([])
  const [monthlyData, setMonthlyData] = useState([])
  const [currentYear, setCurrentYear] = useState('')

  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {
    if(data.length > 0){
      handleGetYear()
    }
  }, [data])

  useEffect(() => {
    if(dataForShow.length > 0){
      dataForEachMonth()
      dataForDownload()
    }
  }, [dataForShow])

  const handleGetYear = () => {
    if(data.length > 0){
      var newArrYear = eliminateDuplicatesObject(data)
      changeDataShow(moment(newArrYear[0].time.toDate()).locale('vi').format("YYYY"))
      setYearInData(newArrYear)
    }
  }

  const eliminateDuplicatesObject = (arr) => {
    const uniqueObjects = [...new Map(arr.map(item => [moment(item.time.toDate()).locale('vi').format("YYYY"), item])).values()]
    return uniqueObjects
  }

  const getData = () => {
    firestore.collection("adminDeleteLog").orderBy("timestamp", "desc").get().then(snapshot => {
      setData(snapshot.docs.map(doc => ({
        id: doc.id, 
        time: doc.data().timestamp,
        deleteUserId: doc.data().deleteUserId,
        userAdminUID: doc.data().userAdminUID,
        email: doc.data().email,
      })))
    })
  }
  
  const changeDataShow = (year) => {
    const result = data.filter(item => moment(item.time.toDate()).locale('vi').format("YYYY") == year);
    setDataForShow(result)
    setCurrentYear(year)
  }

  const dataForEachMonth = () => {
    const monthCountArr = new Array(12).fill(0); 
    dataForShow.forEach(({ time }) => monthCountArr[new Date(time.toDate()).getMonth()] += 1);
    setMonthlyData(monthCountArr)
  }

  const dataForDownload = () => {
    var data = dataForShow
    var data = data.map(x => ({
      id: x.id, 
      time: x.time.toDate(),
      deleteUserId: x.deleteUserId,
      userAdminUID: x.userAdminUID,
      email: x.email}))
    setDataForDownload1(data) 
  }

  const deleteAll = () => {
    dataForShow.map(data => {
      firestore.collection("reportLog").doc(data.id).delete()
    })
    alert("???? x??a!!!")
    getData()
  }

  const headers = [
    {label: 'ID', key: 'id'},
    {label: 'Th???i gian', key: 'time'},
    {label: 'ID Th??nh vi??n ???? x??a', key: 'deleteUserId'},
    {label: 'ID Admin th???c hi???n', key: 'userAdminUID'},
    {label: 'Email c???a th??nh vi??n ???? x??a', key: 'email'},
  ]

  const csvReport = {
    filename: `Account_${currentYear}.csv`,
    headers: headers,
    data: dataForDownload1,
  }

  console.log(monthlyData)

  // if(data.length > 0)
  // console.log(moment(data[0].time.toDate()).locale('vi').format("YYYY"))

  return (
    <div className='accountAnalytics'>
      <div className='accountAnalytics_top'>
        {yearInData.map(year => {
          return(
            <span className={moment(year.time.toDate()).locale('vi').format("YYYY") == currentYear ? "color" : "not-color"} onClick={() => changeDataShow(moment(year.time.toDate()).locale('vi').format("YYYY"))}>
              {moment(year.time.toDate()).locale('vi').format("YYYY")}
            </span>
          )
        })}
        
      </div>
      <div>
        <Bar 
          data={{
            labels: [ 'Th??ng 1', 
                      'Th??ng 2', 
                      'Th??ng 3', 
                      'Th??ng 4', 
                      'Th??ng 5', 
                      'Th??ng 6',
                      'Th??ng 7', 
                      'Th??ng 8', 
                      'Th??ng 9', 
                      'Th??ng 10', 
                      'Th??ng 11', 
                      'Th??ng 12',
                    ],
            datasets: [{
              label: 'S??? t??i kho???n ???? x??? l?? trong th??ng',
              data: monthlyData,
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
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    precision: 0,
                  },
                },
              ],
            },
          }}
        />
      </div>

      <div className='accountAnalytics_bottom'>
        <div className='accountAnalytics_bottom_label'>
          T???t c??? b??o c??o ???? x??? l?? trong n??m {currentYear}:
          <span onClick={() => deleteAll()}>
            X??a to??n b???
          </span>
          <span>
            <CSVLink {...csvReport}>Download</CSVLink>
          </span>
        </div>

        {dataForShow.map(d => {
          return(
            <div key={d.id} className='accountAnalytics_bottom_container'>
                <div className='accountAnalytics_bottom_item'>
                    <b>ID:</b> {d.id} ??? <b>Th???i gian:</b> {moment(d.time.toDate()).locale('vi').calendar()}
                </div>
                <div className='accountAnalytics_bottom_item'>
                    <b>ID Th??nh vi??n ???? x??a:</b> {d.deleteUserId} 
                </div>
                <div className='accountAnalytics_bottom_item'>
                    <b>ID Admin th???c hi???n:</b> {d.userAdminUID} 
                </div>
                <div className='accountAnalytics_bottom_item'>
                    <b>Email c???a th??nh vi??n ???? x??a:</b> {d.email} 
                </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}

export default AccountAnalytics