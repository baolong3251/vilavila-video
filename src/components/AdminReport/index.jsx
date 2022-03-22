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
import Button from '../Forms/Button';
import FormInput from '../Forms/FormInput';
import { firestore, storage } from '../../firebase/utils';
import DataRow from './DataRow';
import { deleteObject } from 'firebase/storage'


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
      backgroundColor: "#a0e7d9",
    },
  },
}))(TableRow);

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

function AdminReport() {
  const classes = useStyles()
  const [contentArray, setContentArray] = useState([]);
  const [contentArraySorted, setContentArraySorted] = useState([]);
  const [contentData, setContentData] = useState([])
  const [statShow, setStatShow] = useState(false)
  const [statShow2, setStatShow2] = useState(false)

  useEffect(() => {
    
    firestore.collection("contentStatus").where("reported", "==", "true").onSnapshot(snapshot => {
      setContentArray(snapshot.docs.map(doc => ({
        id: doc.id, 
        contentId: doc.data().contentId,
        userId: doc.data().userId,
      })))
    })
   
  }, [])

  useEffect(() => {
    
    if(contentArray.length > 0){
      var result = contentArray.map(a => a.contentId);
      eliminateDuplicates(result)
    }
   
  }, [contentArray])

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
    setContentArraySorted(out)
  }

  const handleDeleteReport = (id) => {
    if(contentArraySorted.length == 1){
      setContentArraySorted([])
    }
    var cat = firestore.collection('contentStatus').where('contentId', '==', id);

    cat.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          doc.ref.set({
            reported: "false",
          }, { merge: true });
      });
    })

    reset()

    
  }

  const handleDeleteContent = (id) => {
    if(contentArraySorted.length == 1){
      setContentArraySorted([])
    }
    var stat = firestore.collection('contentStatus').where('contentId', '==', id);
    var comment = firestore.collection('comments').where('videoId', '==', id);
    var comment2 = firestore.collection('comments').where('imageId', '==', id);

    var someArrayVid = []
    var someArrayImg = []

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
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Tên nội dung</StyledTableCell>
              <StyledTableCell align="right">Id nội dung</StyledTableCell>
              <StyledTableCell align="right">Tên người đăng</StyledTableCell>
              <StyledTableCell align="right"></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contentArraySorted.length > 0 && [contentArraySorted.map((data) => (
              <StyledTableRow key={data}>

                <DataRow data={data} handleDeleteReport={handleDeleteReport} handleDeleteContent={handleDeleteContent} />
                
              </StyledTableRow>
            ))]}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default AdminReport