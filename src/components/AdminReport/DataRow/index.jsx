import React, { useEffect, useState } from 'react'
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { firestore } from '../../../firebase/utils';
import { Link } from 'react-router-dom'
import Button from '../../Forms/Button';

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

function DataRow(props) {
    const classes = useStyles()
    const [dataArray, setDataArray] = useState([])
    const [channel, setChannel] = useState([])
    const [statShow, setStatShow] = useState(false)
    const [statShow2, setStatShow2] = useState(false)

    console.log(dataArray)

    useEffect(() => {
        
        firestore.collection("videos").doc(props.data).get().then(snapshot => {
            try{
                setDataArray([...dataArray, {
                    id: snapshot.id, 
                    title: snapshot.data().title,
                    videoAdminUID: snapshot.data().videoAdminUID,
                }])
            }catch(err){
                getArray()
            }
        })
       
    }, [props.data])

    useEffect(() => {
        
        if (dataArray.length > 0) {

            if(dataArray[0].videoAdminUID){
                firestore.collection("users").doc(dataArray[0].videoAdminUID).onSnapshot((snapshot) => {
                    setChannel([{
                        id: snapshot.id,
                        displayName: snapshot.data().displayName,
                        avatar: snapshot.data().avatar,
                    }])
                })
            } 

            if(dataArray[0].imageAdminUID){
                firestore.collection("users").doc(dataArray[0].imageAdminUID).onSnapshot((snapshot) => {
                    setChannel([{
                        id: snapshot.id,
                        displayName: snapshot.data().displayName,
                        avatar: snapshot.data().avatar,
                    }])
                })
            } 

        }
    }, [dataArray])

    const getArray = () => {
        
        firestore.collection("images").doc(props.data).get().then(snapshot => {
            setDataArray([...dataArray, {
                id: snapshot.id, 
                title: snapshot.data().title,
                imageAdminUID: snapshot.data().imageAdminUID,
            }])
        }) 
        
    }

    return (
        <>
            <StyledTableCell component="th" scope="row">
                <Link to={dataArray.length > 0 ? dataArray[0].videoAdminUID ? `/video/${props.data}`
                        : `/image/${props.data}`
                        : null} target={"_blank"}
                >
                    {dataArray.length > 0 && [dataArray[0].title]}
                </Link>
            </StyledTableCell>
            {/* <StyledTableCell align="center">{props.data}</StyledTableCell> */}
            <StyledTableCell align="center"><b>{props.reportDesc}</b></StyledTableCell>
            <StyledTableCell align="center">{channel.length > 0 && [<Link to={`/user/${channel[0].id}`} target={"_blank"}>{channel[0].displayName}</Link>]}</StyledTableCell>
            <StyledTableCell align="center">
                <div  onClick={() => setStatShow(!statShow)} 
                    className='delete_button'>
                H???y b??o c??o
                </div>
                <div  onClick={() => setStatShow2(!statShow2)}
                    className='delete_button'>
                X??a n???i dung
                </div>

                <div className={statShow ? "tableShow active" : "tableShow"}>
                <h2>
                    H???y b??o c??o n???i dung?
                </h2>
                <p>
                    B???n ch???c ch???n l?? s??? th???c hi???n ??i???u n??y ch????
                </p>
                <p>H??y nh???n n??t x??c nh???n ????? th???c hi???n thao t??c, ho???c nh???n h???y ????? h???y b??? thao t??c</p>
                <div className='button_flex'>
                    {channel.length > 0 && dataArray.length > 0 && [
                    <Button onClick={() => props.handleDeleteReport(props.data, props.reportId, channel[0].id, channel[0].displayName, dataArray[0].title)}>
                        X??c nh???n
                    </Button>
                    ]}
                    <Button onClick={() => setStatShow(!statShow)}>
                        H???y
                    </Button>
                </div>
                </div>

                <div className={statShow2 ? "tableShow active" : "tableShow"}>
                <h2>
                    X??a n???i dung?
                </h2>
                <p>
                    B???n ch???c ch???n l?? s??? th???c hi???n ??i???u n??y ch????
                </p>
                <p>H??y nh???n n??t x??c nh???n ????? th???c hi???n thao t??c, ho???c nh???n h???y ????? h???y b??? thao t??c</p>
                <div className='button_flex'>
                    {channel.length > 0 && dataArray.length > 0 && [
                    <Button onClick={() => props.handleDeleteContent(props.data, props.reportId, channel[0].id, channel[0].displayName, dataArray[0].title)}>
                        X??c nh???n
                    </Button>
                    ]}
                    <Button onClick={() => setStatShow2(!statShow2)}>
                        H???y
                    </Button>
                </div>
                </div>
            </StyledTableCell>
        </>
    )
}

export default DataRow