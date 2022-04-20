import React from 'react';
import {collection, query, where, orderBy, onSnapshot} from "firebase/firestore"
import { Avatar } from '@material-ui/core';
import { useEffect } from 'react';
import { useState } from 'react';
import { firestore, auth } from '../../../../../firebase/utils';
import FormInput from '../../../../Forms/FormInput';
import Button from '../../../../Forms/Button';
import { useSelector } from 'react-redux';
import ReplyIcon from '@material-ui/icons/Reply';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';

const mapState = state => ({
    currentUser: state.user.currentUser,
})

function CardReplyComment(props) {
  const [userInfo, setUserInfo] = useState([])
  const [replyText, setReplyText] = useState('')
  const [reply, setReply] = useState(false)
  const [comment, setComment] = useState(props.replyComment.comment)
  const [editText, setEditText] = useState(props.replyComment.comment)
  const [edit, setEdit] = useState(false)
  const { currentUser } = useSelector(mapState);

  useEffect(() => {
    firestore.collection('users').doc(props.replyComment.uid).onSnapshot((snapshot) => {
        setUserInfo({
            displayName: snapshot.data().displayName,
            avatar: snapshot.data().avatar,
        })
    })
  }, [props.replyComment.cmid])

  useEffect(() => {
    setEditText(props.replyComment.comment)
  }, [props.replyComment.comment])

  const resetForm = () => {
    setReplyText('')
    setReply(false)
    setEdit(false)
    setComment(editText)
  }

  const handleAddReply = (e) => {
    e.preventDefault();
    if(replyText == '') return
    const userid = auth.currentUser.uid
    const timestamp = new Date();

    try{
        firestore.collection('comments').add({
            uid: userid,
            videoId: props.replyComment.videoId,
            comment: replyText,
            replyId: props.replyComment.replyId,
            timestamp: timestamp
        })
        resetForm()
        props.handleLoadReply()
    }catch(err){
        console.log(err)
    }
    
  }

  const handleEditComment = (e) => {
    e.preventDefault();
    if(editText == '') return;
    //update the todo with the new input text
    firestore.collection('comments').doc(props.replyComment.cmid).set({
        comment: editText
    }, { merge: true });
    resetForm()
  }

  return <>
    <div className='videoDetails_displayReplyComment_container'>
        <div className='videoDetails_displayComment_avatar'>
            <Avatar src={userInfo.avatar} />
        </div>
        <div className='videoDetails_displayComment_info'>
            <div className='videoDetails_displayComment_name'>
                {userInfo.displayName}
            </div>
            <div className='videoDetails_displayComment_comment'>
                {comment}
            </div>
            <div className='videoDetails_displayComment_buttons'>
                {!reply ? 
                    <div className='videoDetails_displayComment_button' onClick={() => currentUser ? setReply(true) : null}>
                        <ReplyIcon className='videoDetails_displayComment_icon' />
                    </div> : 
                    <div className='videoDetails_displayComment_button' onClick={() => setReply(false)}>
                        <CancelIcon className='videoDetails_displayComment_icon' />
                    </div> 
                }

                {currentUser && props.replyComment.uid == currentUser.id ? <>
                    {!edit ? 
                        <div onClick={() => setEdit(true)} className='videoDetails_displayComment_button'>
                            <EditIcon className='videoDetails_displayComment_icon' />
                        </div> : 
                        <div onClick={() => setEdit(false)} className='videoDetails_displayComment_button'>
                            <CancelIcon className='videoDetails_displayComment_icon' />
                        </div>
                    }
                    <div onClick={() => props.handleDeleteReply(props.replyComment.cmid)} className='videoDetails_displayComment_button'>
                        <DeleteIcon className='videoDetails_displayComment_icon' />
                    </div>
                    {/* <div onClick={() => firestore
                                        .collection('comments')
                                        .doc(props.replyComment.cmid)
                                        .delete()} className='videoDetails_displayComment_button'>
                        <DeleteIcon className='videoDetails_displayComment_icon' />
                    </div> */}
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
  </>;

}

export default CardReplyComment;
