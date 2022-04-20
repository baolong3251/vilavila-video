import React, { useEffect, useState } from 'react'
import {Bar} from "react-chartjs-2"
import Chart from 'chart.js/auto'
import { firestore } from "../../../firebase/utils"
import moment from 'moment'
import 'moment/locale/vi';
import "./style_reportAnalytics.scss"
import {CSVLink} from "react-csv"


function ReportAnalytics() {
  const [data, setData] = useState([])
  const [yearInData, setYearInData] = useState([])
  const [dataForShow, setDataForShow] = useState([])
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
    firestore.collection("reportLog").orderBy("time", "desc").get().then(snapshot => {
      setData(snapshot.docs.map(doc => ({
        id: doc.id, 
        time: doc.data().time,
        method: doc.data().method,
        contentName: doc.data().contentName,
        userName: doc.data().userName,
        contentId: doc.data().contentId,
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

  const deleteAll = () => {
    dataForShow.map(data => {
      firestore.collection("reportLog").doc(data.id).delete()
    })
    alert("Đã xóa!!!")
    getData()
  }

  const headers = [
    {label: 'ID', key: 'id'},
    {label: 'Thời gian', key: 'time'},
    {label: 'ID Nội dung', key: 'contentId'},
    {label: 'Tên nội dung đã xử lý', key: 'contentName'},
    {label: 'Tên tài khoản của nội dung', key: 'userName'},
    {label: 'Cách thức xử lý:', key: 'method'},
  ]

  const csvReport = {
    filename: `Report_${currentYear}.csv`,
    headers: headers,
    data: dataForShow,
  }

  console.log(monthlyData)

  // if(data.length > 0)
  // console.log(moment(data[0].time.toDate()).locale('vi').format("YYYY"))

  return (
    <div className='reportAnalytics'>
      <div className='reportAnalytics_top'>
        {yearInData.map(year => {
          return(
            <span onClick={() => changeDataShow(moment(year.time.toDate()).locale('vi').format("YYYY"))}>
              {moment(year.time.toDate()).locale('vi').format("YYYY")}
            </span>
          )
        })}
        
      </div>
      <div>
        <Bar 
          data={{
            labels: [ 'Tháng 1', 
                      'Tháng 2', 
                      'Tháng 3', 
                      'Tháng 4', 
                      'Tháng 5', 
                      'Tháng 6',
                      'Tháng 7', 
                      'Tháng 8', 
                      'Tháng 9', 
                      'Tháng 10', 
                      'Tháng 11', 
                      'Tháng 12',
                    ],
            datasets: [{
              label: 'Số báo cáo trong tháng',
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
                  },
                },
              ],
            },
          }}
        />
      </div>

      <div className='reportAnalytics_bottom'>
        <div className='reportAnalytics_bottom_label'>
          Tất cả báo cáo đã xử lý trong năm {currentYear}:
          <span onClick={() => deleteAll()}>
            Xóa toàn bộ
          </span>
          <span>
            <CSVLink {...csvReport}>Download</CSVLink>
          </span>
        </div>

        {dataForShow.map(d => {
          return(
            <div key={d.id} className='reportAnalytics_bottom_container'>
                <div className='reportAnalytics_bottom_item'>
                    <b>ID:</b> {d.id} • <b>Thời gian:</b> {moment(d.time.toDate()).locale('vi').calendar()}
                </div>
                <div className='reportAnalytics_bottom_item'>
                    <b>ID Nội dung:</b> {d.contentId} 
                </div>
                <div className='reportAnalytics_bottom_item'>
                    <b>Tên nội dung đã xử lý:</b> {d.contentName} 
                </div>
                <div className='reportAnalytics_bottom_item'>
                    <b>Tên tài khoản của nội dung:</b> {d.userName}
                </div>
                <div className='reportAnalytics_bottom_item'>
                    <b>Cách thức xử lý:</b> {d.method}
                </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}

export default ReportAnalytics