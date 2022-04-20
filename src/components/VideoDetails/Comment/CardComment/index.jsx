import React from 'react';
import { useSelector, useDispatch } from "react-redux"
import { firestore, auth } from '../../../../firebase/utils';
import {collection, query, where, orderBy, onSnapshot} from "firebase/firestore"
import { Avatar } from '@material-ui/core';
import { useEffect } from 'react';
import { useState } from 'react';
import CardReplyComment from './CardReplyComment';
import FormInput from '../../../Forms/FormInput';
import Button from '../../../Forms/Button';
import ReplyIcon from '@material-ui/icons/Reply';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';

const mapState = state => ({
    currentUser: state.user.currentUser,
})

function CardComment(props) {
    const [userInfo, setUserInfo] = useState([])
    const [replyComments, setReplyComments] = useState([])
    const [replyText, setReplyText] = useState('')
    const [reply, setReply] = useState(false)
    const [editText, setEditText] = useState(props.comment.comment)
    const [edit, setEdit] = useState(false)
    const { currentUser } = useSelector(mapState);
    const [showMore, setShowMore] = useState(false)
    // console.log(props.comment.cmid)

    useEffect(() => {
        firestore.collection('users').doc(props.comment.uid).get().then((snapshot) => {
            setUserInfo({
                userId: snapshot.id,
                displayName: snapshot.data().displayName,
                avatar: snapshot.data().avatar,
            })
        })
    }, [props.comment.uid])

    useEffect(() => {
        
        handleLoadReply()
        
    }, [props.comment])

    const handleLoadReply = () => {
        // const q = query(collection(firestore, "comments"), where("replyId", "==", props.comment.cmid), orderBy('timestamp'));
        // onSnapshot(q, (snapshot) => {
        //     setReplyComments(snapshot.docs.map(doc => ({
        //         cmid: doc.id, 
        //         videoId: doc.data().videoId, 
        //         comment: doc.data().comment, 
        //         uid: doc.data().uid,
        //         replyId: doc.data().replyId,
        //         time: doc.data().timestamp
        //     })))
        // })
        
        //it like i will adding into the array when add reply then add it into the firestore, with the delete i will change it into the new previous coponent and delete the item from the array then update fire store

        firestore.collection("comments").where("replyId", "==", props.comment.cmid).orderBy('timestamp')
        .get().then(snapshot => {
            setReplyComments(snapshot.docs.map(doc => ({
                cmid: doc.id, 
                videoId: doc.data().videoId, 
                comment: doc.data().comment, 
                uid: doc.data().uid,
                replyId: doc.data().replyId,
                time: doc.data().timestamp
            })))
        })
    }

    useEffect(() => {
        setEditText(props.comment.comment)
    }, [props.comment.comment])

    const resetForm = () => {
        setReplyText('')
        setReply(false)
        setEdit(false)
    }

    const handleAddReply = (e) => {
        e.preventDefault();
        if(replyText == '') return
        const userid = auth.currentUser.uid
        const timestamp = new Date();
   
        try{
            firestore.collection('comments').add({
                uid: userid,
                videoId: props.comment.videoId,
                comment: replyText,
                replyId: props.comment.cmid,
                timestamp: timestamp
            }).then(
                firestore.collection('comments').doc(props.comment.cmid).set({
                    replyId: "true"
                }, { merge: true })
            )
            resetForm()
            handleLoadReply()
        }catch(err){
            console.log(err)
        }
        
    }

    const handleEditComment = (e) => {
        e.preventDefault();
        if(editText == '') return;
        //update the todo with the new input text
        firestore.collection('comments').doc(props.comment.cmid).set({
            comment: editText
        }, { merge: true });
        resetForm()
    }

    const handleDelete = () =>{
        var comment = firestore.collection('comments').where('replyId', '==', props.comment.cmid);
        comment.get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                doc.ref.delete();
            });
        })
    }

    const handleDeleteReply = (id) => {
        var someArray = replyComments
        someArray = someArray.filter(item => item.cmid != id);
        
        firestore
        .collection('comments')
        .doc(id)
        .delete()
        .then(setReplyComments(someArray))
    }

    return <>
    <div className='videoDetails_displayComment_container'>
        <div className='videoDetails_displayComment_avatar'>
            <Avatar src={userInfo.userId == props.comment.uid ? userInfo.avatar : null} />
        </div>
        <div className='videoDetails_displayComment_info'>
            <div className='videoDetails_displayComment_name'>
                {userInfo.userId == props.comment.uid ? userInfo.displayName : null}
            </div>
            <div className='videoDetails_displayComment_comment'>
                {props.comment.comment}
            </div>
            <div className='videoDetails_displayComment_buttons'>
                {!reply ? 
                <div className='videoDetails_displayComment_button' onClick={() => currentUser ? setReply(true) : null}>
                    <ReplyIcon className='videoDetails_displayComment_icon' />
                </div> : 
                <div className='videoDetails_displayComment_button' onClick={() => setReply(false)}>
                    <CancelIcon className='videoDetails_displayComment_icon' />
                </div> }

                {currentUser && props.comment.uid == currentUser.id ? <>
                    {!edit ? 
                        <div onClick={() => setEdit(true)} className='videoDetails_displayComment_button'>
                            <EditIcon className='videoDetails_displayComment_icon' />
                        </div> : 
                        <div onClick={() => setEdit(false)} className='videoDetails_displayComment_button'>
                            <CancelIcon className='videoDetails_displayComment_icon' />
                        </div>
                    }
                    <div onClick={() => firestore
                                        .collection('comments')
                                        .doc(props.comment.cmid)
                                        .delete()
                                        .then( handleDelete ) } className='videoDetails_displayComment_button'>
                        <DeleteIcon className='videoDetails_displayComment_icon' />
                    </div>
                </> : null
                }
            </div>
        </div>
    </div>

    {reply ? 
    <form className='videoDetails_comment reply_box' onSubmit={handleAddReply}>
        <div className='videoDetails_commentTextBox'>
            <FormInput
                type="text"
                placeholder="Nhập bình luận..."
                value={replyText}
                onChange={event => setReplyText(event.target.value)}
            />
        </div>
        <div className='videoDetails_commentButton'>
            <Button type='submit'>
                Bình luận
            </Button>
        </div>
    </form> : null}

    {edit ? 
    <form className='videoDetails_comment reply_box' onSubmit={handleEditComment}>
    <div className='videoDetails_commentTextBox'>
        <FormInput
            type="text"
            placeholder="Nhập bình luận..."
            value={editText}
            onChange={event => setEditText(event.target.value)}
        />
    </div>
    <div className='videoDetails_commentButton'>
        <Button type='submit'>
            Bình luận
        </Button>
    </div>
    </form> : null}

    {
        replyComments.map((replyComment) => {

            return(
                <>
                <div key={replyComment.cmid}>
                    {replyComment.replyId == props.comment.cmid ? (
                        <>
                            <CardReplyComment replyComment={replyComment} handleLoadReply={handleLoadReply} handleDeleteReply={handleDeleteReply}/>
                            {/* {currentUser && replyComment.uid == currentUser.id ? 
                            <div className='videoDetails_displayReplyComment_container outa'>
                                <div className='videoDetails_displayComment_info outainfo'>
                                    <div className='videoDetails_displayComment_buttons'>
                                        <div className='videoDetails_displayComment_button' onClick={() => handleDeleteReply(replyComment.cmid)}>
                                            <DeleteIcon className='videoDetails_displayComment_icon' />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            : null } */}
                        </>
                        )
                    : null}
                </div>
                </>
            )
        })
    }
    
    </>;
}

export default CardComment;
