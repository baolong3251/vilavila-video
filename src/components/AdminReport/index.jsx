import React, { useEffect, useState } from 'react'
import "./style_adminReport.scss"
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { firestore, storage } from '../../firebase/utils';
import DataRow from './DataRow';
import { deleteObject } from 'firebase/storage'
import { deleteField } from "firebase/firestore";


const StyledTableCell = withStyles((theme) => ({
  head: {
    background: '#333333',
    color: "white",
    fontSize: 14,
  },
  body: {
    fontSize: 14,
  }
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      // backgroundColor: theme.palette.action.hover,
      backgroundColor: "rgba(75, 192, 192, 0.2)",
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

function AdminReport() {
  const classes = useStyles()
  const [contentArray, setContentArray] = useState([]);
  const [contentArraySorted, setContentArraySorted] = useState([]);
  const [contentSpam, setContentSpam] = useState([]);
  const [contentMean, setContentMean] = useState([]);
  const [contentNotRelate, setContentNotRelate] = useState([]);
  const [statShow, setStatShow] = useState(false)
  const [statShow2, setStatShow2] = useState(false)

  useEffect(() => {
    
    firestore.collection("contentStatus").where("reported", "==", "true").orderBy("reportedDate", "asc").onSnapshot(snapshot => {
      setContentArray(snapshot.docs.map(doc => ({
        id: doc.id, 
        contentId: doc.data().contentId,
        userId: doc.data().userId,
        reportDesc: doc.data().reportDesc,
      })))
    })
   
  }, [])

  // useEffect(() => {
    
  //   if(contentArray.length > 0){
  //     // var result = contentArray.map(a => a.contentId);
  //     // eliminateDuplicates(result)

  //     handleSort()
  //   }
   
  // }, [contentArray])

  // const eliminateDuplicates = (arr) => {
  //   var i,
  //       len = arr.length,
  //       out = [],
  //       obj = {};
  
  //   for (i = 0; i < len; i++) {
  //     obj[arr[i]] = 0;
  //   }
  //   for (i in obj) {
  //       out.push(i);
  //   }
  //   setContentArraySorted(out)
  // }

  // const handleSort = () =>{
  //   const result1 = contentArray.filter(word => word.reportDesc.includes("spam"));
  //   const result2 = contentArray.filter(word => word.reportDesc.includes("Nội dung hoặc bình luận có ý xúc phạm"));
  //   const result3 = contentArray.filter(word => word.reportDesc.includes("Không liên quan"));
    
  //   setContentSpam(result1)
  //   setContentMean(result2)
  //   setContentNotRelate(result3)
  // }

  const handleDeleteReport = (id, reportId, uid, userName, contentName) => {
    if(contentArraySorted.length == 1){
      setContentArraySorted([])
    }
    var cat = firestore.collection('contentStatus').where('contentId', '==', id);
    var time = new Date()

    cat.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          doc.ref.set({
            reported: "false",
            reportDesc: "",
            reportedDate: deleteField(),
          }, { merge: true })
      });
    })

    firestore.collection("reportLog").add({
      reportId: reportId,
      time: time,
      contentId: id,
      userId: uid,
      userName: userName,
      contentName: contentName,
      method: "Hủy báo cáo",
    })

    reset()

    
  }

  const handleDeleteContent = (id, reportId, uid, userName, contentName) => {
    if(contentArraySorted.length == 1){
      setContentArraySorted([])
    }
    var stat = firestore.collection('contentStatus').where('contentId', '==', id);
    var comment = firestore.collection('comments').where('videoId', '==', id);
    var comment2 = firestore.collection('comments').where('imageId', '==', id);

    var someArrayVid = []
    var someArrayImg = []

    var time = new Date()

    firestore.collection("videos").doc(id).get().then(snapshot => {
      try{

        someArrayVid = [...someArrayVid, {
            id: snapshot.id, 
            sourceLink: snapshot.data().sourceLink,
            thumbnail: snapshot.data().thumbnail,
        }]
        handleDeleteStorage(someArrayVid[0].sourceLink, someArrayVid[0].thumbnail)

        comment.get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              doc.ref.delete()
          });
        })
        firestore.collection("videos").doc(id).delete()

      }catch(err){
        firestore.collection("images").doc(id).get().then(snapshot => {
          
          someArrayImg = [...someArrayImg, {
              id: snapshot.id, 
              sourceLink: snapshot.data().sourceLink,
          }]
          
          handleDeleteStorage(someArrayImg[0].sourceLink)

          comment2.get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                doc.ref.delete()
            });
          })
          firestore.collection("images").doc(id).delete()

        })
      }
    })

    stat.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          doc.ref.delete()
      });
    })

    firestore.collection("reportLog").add({
      reportId: reportId,
      time: time,
      contentId: id,
      userId: uid,
      userName: userName,
      contentName: contentName,
      method: "Xóa nội dung",
    })

    // if (someArrayVid.length > 0){
    //   comment.get().then(function(querySnapshot) {
    //     querySnapshot.forEach(function(doc) {
    //         doc.ref.delete()
    //     });
    //   })
    //   firestore.collection("videos").doc(id).delete()
    // }

    // if (someArrayImg.length > 0){
    //   comment2.get().then(function(querySnapshot) {
    //     querySnapshot.forEach(function(doc) {
    //         doc.ref.delete()
    //     });
    //   })
    //   firestore.collection("images").doc(id).delete()
    // }

    reset()

  }

  const reset = () => {
    setStatShow(false)
    setStatShow2(false)
  }

  console.log(contentArraySorted)

  const handleDeleteStorage = (arr, thArr) => {
    if(Array.isArray(arr)){
      arr.map(ar => {
        var desertRef = storage.refFromURL(ar);

        deleteObject(desertRef).then(() => {
            
        }).catch((error) => {
            console.log(error)
        });
      })
    } 
    
    else {
      var desertRef = storage.refFromURL(arr);

      deleteObject(desertRef).then(() => {
          
      }).catch((error) => {
          console.log(error)
      });

      if(thArr !== ''){
          var desertRef2 = storage.refFromURL(thArr);

          deleteObject(desertRef2).then(() => {
              
          }).catch((error) => {
              console.log(error)
          });
      }
    }

  }


  return (
    <div className='adminReport'>
      <div>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Tên nội dung</StyledTableCell>
                <StyledTableCell align="center">Id nội dung</StyledTableCell>
                <StyledTableCell align="center">Nội dung báo cáo</StyledTableCell>
                <StyledTableCell align="center">Tên người đăng</StyledTableCell>
                <StyledTableCell align="center"></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contentArray.length > 0 && [contentArray.map((data) => (
                <StyledTableRow key={data.id}>

                  <DataRow data={data.contentId} handleDeleteReport={handleDeleteReport} handleDeleteContent={handleDeleteContent} reportDesc={data.reportDesc} reportId={data.id}/>
                  
                </StyledTableRow>
              ))]}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      
      {/* <div>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Tên nội dung</StyledTableCell>
                <StyledTableCell align="center">Id nội dung</StyledTableCell>
                <StyledTableCell align="center">Nội dung báo cáo</StyledTableCell>
                <StyledTableCell align="center">Tên người đăng</StyledTableCell>
                <StyledTableCell align="center"></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contentMean.length > 0 && [contentMean.map((data) => (
                <StyledTableRow key={data.id}>

                  <DataRow data={data.contentId} handleDeleteReport={handleDeleteReport} handleDeleteContent={handleDeleteContent} reportDesc={data.reportDesc} reportId={data.id}/>
                  
                </StyledTableRow>
              ))]}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      
      <div>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Tên nội dung</StyledTableCell>
                <StyledTableCell align="center">Id nội dung</StyledTableCell>
                <StyledTableCell align="center">Nội dung báo cáo</StyledTableCell>
                <StyledTableCell align="center">Tên người đăng</StyledTableCell>
                <StyledTableCell align="center"></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contentNotRelate.length > 0 && [contentNotRelate.map((data) => (
                <StyledTableRow key={data.id}>

                  <DataRow data={data.contentId} handleDeleteReport={handleDeleteReport} handleDeleteContent={handleDeleteContent} reportDesc={data.reportDesc} reportId={data.id}/>
                  
                </StyledTableRow>
              ))]}
            </TableBody>
          </Table>
        </TableContainer>
      </div> */}
      
    </div>
  )
}

export default AdminReport