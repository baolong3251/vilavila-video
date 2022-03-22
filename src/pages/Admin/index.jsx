import React, { useEffect, useState } from 'react'
import { firestore } from '../../firebase/utils'
import "./style_admin.scss"

function Admin() {
  const [category, setCategory] = useState([])
  const [notSortedArray, setNotSortedArray] = useState([])
  const [sortedArray, setSortedArray] = useState([])

  useEffect(() => {
    
    handleGetData()
    handleGetData2()
   
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
      <div className='admin_container'>
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
      </div>

      <div className='admin_container'>
        <h2>
          Báo cáo
        </h2>
        {
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
        }
      </div>
    </div>
  )
}

export default Admin