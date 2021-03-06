import React, { useEffect, useState } from 'react'
import "./style_adminCategory.scss"
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
import { firestore } from '../../firebase/utils';
import Alert from './Alert';

const StyledTableCell = withStyles((theme) => ({
  head: {
    background: '#333333',
    color: "white",
    fontSize: 14,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: "rgba(75, 192, 192, 0.2)",
    },
  },
}))(TableRow);

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

function AdminCategory() {
  const classes = useStyles();
  const [catAdded, setCatAdded] = useState("");
  const [catAddStat, setCatAddStat] = useState(false);
  const [category, setCategory] = useState([])
  
  useEffect(() => {
    
    firestore.collection("category").orderBy("name").onSnapshot(snapshot => {
      setCategory(snapshot.docs.map(doc => ({
        id: doc.id, 
        name: doc.data().name,
        quantity: doc.data().quantity,
      })))
    })
   
  }, [])

  const handleDelete = (id, name) => {
    if(name == "animation") return

    var cat = firestore.collection('videos').where('category', '==', name);

    firestore.collection("category").doc(id).delete().then(
      cat.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            doc.ref.set({
              category: "animation",
            }, { merge: true });
        });
      })
    )
  }

  const onKeyDownHandler = e => {
    if (e.keyCode === 13) {
      handleAddCat()
    }
  };

  const handleAddCat = () => {
    var someArray = category
    someArray = someArray.find(element => element.name == catAdded)

    if(someArray){
      alert("Th??? lo???i n??y ???? ???????c th??m tr?????c ????.")
      return
    }

    if(!someArray){
      firestore.collection("category").add({
        name: catAdded,
        quantity: "0",
      })

      setCatAdded('')
    }
  }

  return (
    <div className='adminCategory'>
        <div className="button-category">
          <Button onClick={() => setCatAddStat(!catAddStat)}>
            Th??m th??? lo???i
          </Button>
        </div>

        {catAddStat && [
          <div className='addCategory_container'>
            <FormInput
              type="text"
              placeholder="Nh???p th??? lo???i mu???n th??m"
              value={catAdded}
              onKeyDown={onKeyDownHandler}
              onChange={(e) => setCatAdded(e.target.value)}
            />
            <div className='addCategory_containerButtons'>
              <Button onClick={() => handleAddCat()}>
                Th??m
              </Button>
              <Button onClick={() => setCatAddStat(!catAddStat)}>
                H???y
              </Button>
            </div>
          </div>
        ]}

        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>T??n th??? lo???i</StyledTableCell>
                {/* <StyledTableCell align="right">Id th??? lo???i</StyledTableCell> */}
                <StyledTableCell align="left">S??? n???i dung s??? d???ng</StyledTableCell>
                <StyledTableCell align="right"></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {category.map((row) => (
                <StyledTableRow key={row.name}>
                  <StyledTableCell component="th" scope="row">
                    {row.name}
                  </StyledTableCell>
                  {/* <StyledTableCell align="right">{row.id}</StyledTableCell> */}
                  <StyledTableCell align="left">{row.quantity}</StyledTableCell>
                  <Alert row={row} handleDelete={handleDelete} />
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
    </div>
  )
}

export default AdminCategory