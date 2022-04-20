import React, { useEffect, useState } from 'react'
import moment from 'moment'
import 'moment/locale/vi';
import { firestore } from '../../../firebase/utils';
import { useSelector } from 'react-redux';

import { doc, arrayUnion, arrayRemove, updateDoc} from "firebase/firestore"; 

const mapState = ({user}) => ({
    currentUser: user.currentUser
})

function HandleCheckTierLog() {
    const [videosThing, setVideosThing] = useState([])
    const { currentUser } = useSelector(mapState)

    useEffect(() => {
        firestore.collection('tierLog').where('signedUserId', '==', currentUser.id).get().then(snapshot => {
            setVideosThing(snapshot.docs.map(doc => ({
                id: doc.id,
                uid: doc.data().uid,
                signedUserId: doc.data().signedUserId,
                lastUpdate: doc.data().lastUpdate,
            })
          ))
        })
           
        
    }, [])

    useEffect(() => {
        
        if(videosThing.length > 0){
            videosThing.map(video => {
                var time = moment(video.lastUpdate.toDate()).locale('vi').fromNow()
                if(time == "một tháng trước"){
                    firestore.collection('tierLog').doc(video.id).delete()
                    firestore.collection("tiers").where('userSigned', 'array-contains', currentUser.id).where('uid', '==', video.uid).get().then(
                    
                        function(querySnapshot) {
                            
                            querySnapshot.forEach(function(docs) {

                                const q = doc(firestore, "tiers", docs.ref.id);

                                updateDoc(q, {
                                    userSigned: arrayRemove(currentUser.id)
                                })
                            });
                            
                        }
                    )
                }
            })
            
            
        }
        
    }, [videosThing])

    return null

}

export default HandleCheckTierLog