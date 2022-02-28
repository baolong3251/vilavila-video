import React from 'react';
import { Avatar, Button } from '@material-ui/core'
import FormInput from '../../Forms/FormInput';
import { Link, useParams } from "react-router-dom";
import {  useSelector } from "react-redux";

import { firestore, auth } from '../../../firebase/utils';
import {collection, query, where, orderBy, onSnapshot} from "firebase/firestore"
import { useState } from 'react';
import { useEffect } from 'react';
import CardComment from './CardComment';

const mapState = state => ({
    currentUser: state.user.currentUser,
})

function Comment() {
    const [commentText, setCommentText] = useState('')
    const [comments, setComments] = useState([])
    const { videoID } = useParams()
    const { currentUser } = useSelector(mapState);
    // console.log(comments)

    useEffect(() => {
        const q = query(collection(firestore, "comments"), where("replyId", "in", ["", "true"]), where("videoId", "==", videoID), orderBy('timestamp', 'desc'));
        onSnapshot(q, (snapshot) => {
            setComments(snapshot.docs.map(doc => ({
                cmid: doc.id, 
                videoId: doc.data().videoId, 
                comment: doc.data().comment, 
                uid: doc.data().uid,
                replyId: doc.data().replyId,
                time: doc.data().timestamp
            })))
        })
    }, [])

    const handleAddComment = (e) => {
        e.preventDefault();
        if(commentText == '') return
        const userid = auth.currentUser.uid
        const timestamp = new Date();
   
        try{
            firestore.collection('comments').add({
                uid: userid,
                videoId: videoID,
                comment: commentText,
                replyId: '',
                timestamp: timestamp
            })
            setCommentText('')
        }catch(err){
            console.log(err)
        }
        
    }


    return <>
        {currentUser && [
        <form className='videoDetails_comment' onSubmit={handleAddComment}>
            <div className='videoDetails_commentTextBox'>
                <FormInput
                    type="text"
                    placeholder="Nhập bình luận..."
                    value={commentText}
                    handleChange={e => setCommentText(e.target.value)}
                />
            </div>
            <div className='videoDetails_commentButton'>
                <Button type='submit'>
                    Bình luận
                </Button>
            </div>
        </form>
        ]}

        {!currentUser && [
        <form className='videoDetails_comment' onSubmit={handleAddComment}>
            <div className='videoDetails_commentTextBox'>
                Muốn bình luận? Nhấn vào đăng nhập&nbsp;<Link to={'/login'}>đăng nhập</Link>.
            </div>
        </form>
        ]}

        <div className='videoDetails_displayComment'>
            {comments.map((comment) => {
                    return(
                        <div>
                            <CardComment comment={comment}/>
                        </div>
                    )
                })
            }
        </div>

    </>;
}

export default Comment;
