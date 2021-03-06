import React, { useEffect, useState } from 'react'
import {Bar} from "react-chartjs-2"
import Chart from 'chart.js/auto'
import { firestore } from "../../../firebase/utils"
import moment from 'moment'
import 'moment/locale/vi';
import "./style_reportAnalytics.scss"
import {CSVLink} from "react-csv"
import FormInput from '../../Forms/FormInput'


function ReportAnalytics() {
  const [data, setData] = useState([])
  const [yearInData, setYearInData] = useState([])
  const [dataForShow, setDataForShow] = useState([])
  const [dataForDownload1, setDataForDownload1] = useState([])
  const [monthlyData, setMonthlyData] = useState([])
  const [currentYear, setCurrentYear] = useState('')
  const [searchId, setSearchId] = useState("")
  const [showNumber, setShowNumber] = useState(0)
  const [showNumber1, setShowNumber1] = useState(0)
  const [showNumber2, setShowNumber2] = useState(0)

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
    firestore.collection("reportLog").orderBy("time", "desc").get().then(snapshot => {
      setData(snapshot.docs.map(doc => ({
        id: doc.id, 
        time: doc.data().time,
        method: doc.data().method,
        contentName: doc.data().contentName,
        userId: doc.data().userId,
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

  const dataForDownload = () => {
    var data = dataForShow
    var data = data.map(x => ({
      id: x.id, 
      time: x.time.toDate(),
      contentId: x.contentId,
      contentName: x.contentName,
      userName: x.userName,
      method: x.method,
    }))
    setDataForDownload1(data) 
  }

  const deleteAll = () => {
    dataForShow.map(data => {
      firestore.collection("reportLog").doc(data.id).delete()
    })
    alert("???? x??a!!!")
    getData()
  }

  const onKeyDownHandler = e => {
    if (e.keyCode === 13) {
      var data = dataForShow
      data = data.filter(x => x.userId == searchId)
      var data1 = data.filter(x => x.method == "H???y b??o c??o")
      var data2 = data.filter(x => x.method == "X??a n???i dung")
      setShowNumber(data.length)
      setShowNumber1(data1.length)
      setShowNumber2(data2.length)
    }
  };

  const headers = [
    {label: 'ID', key: 'id'},
    {label: 'Th???i gian', key: 'time'},
    {label: 'ID N???i dung', key: 'contentId'},
    {label: 'T??n n???i dung ???? x??? l??', key: 'contentName'},
    {label: 'T??n t??i kho???n c???a n???i dung', key: 'userName'},
    {label: 'C??ch th???c x??? l??:', key: 'method'},
  ]

  const csvReport = {
    filename: `Report_${currentYear}.csv`,
    headers: headers,
    data: dataForDownload1,
  }

  console.log(monthlyData)

  // if(data.length > 0)
  // console.log(moment(data[0].time.toDate()).locale('vi').format("YYYY"))

  return (
    <div className='reportAnalytics'>
      <div className='reportAnalytics_top'>
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
              label: 'S??? b??o c??o trong th??ng',
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
                    stepSize: 1,
                    precision: 0,
                  },
                },
              ],
            },
          }}
        />
      </div>

      <div className='reportAnalytics_bottom'>
        <div className='reportAnalytics_bottom_label'>
          T???t c??? b??o c??o ???? x??? l?? trong n??m {currentYear}:
          <span onClick={() => deleteAll()}>
            X??a to??n b???
          </span>
          <span>
            <CSVLink {...csvReport}>Download</CSVLink>
          </span>
          <span>
            <input
              type="text"
              placeholder="Nh???p id t??i kho???n"        
              onKeyDown={onKeyDownHandler}
              onChange={(e) => setSearchId(e.target.value)}
            />
          </span>
          <span className='not-underLine'>
            {showNumber > 0 ? "S??? l???n xu???t hi???n: " + showNumber + ", H???y b??o c??o: " + showNumber1 + ", X??a n???i dung: " + showNumber2 : null}
          </span>
        </div>

        {dataForShow.map(d => {
          return(
            <div key={d.id} className='reportAnalytics_bottom_container'>
                <div className='reportAnalytics_bottom_item'>
                    <b>ID:</b> {d.id} ??? <b>Th???i gian:</b> {moment(d.time.toDate()).locale('vi').calendar()}
                </div>
                <div className='reportAnalytics_bottom_item'>
                    <b>ID N???i dung:</b> {d.contentId} 
                </div>
                <div className='reportAnalytics_bottom_item'>
                    <b>T??n n???i dung ???? x??? l??:</b> {d.contentName} 
                </div>
                <div className='reportAnalytics_bottom_item'>
                    <b>T??n t??i kho???n c???a n???i dung:</b> {d.userName}
                </div>
                <div className='reportAnalytics_bottom_item'>
                    <b>C??ch th???c x??? l??:</b> {d.method}
                </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}

export default ReportAnalytics