import React, { useEffect, useState } from 'react'
import moment from 'moment'
import 'moment/locale/vi';
import { firestore } from '../../../firebase/utils';
import { useSelector } from 'react-redux';

import { doc, arrayUnion, arrayRemove, updateDoc} from "firebase/firestore"; 

const mapState = ({user}) => ({
    currentUser: user.currentUser
})

function HandleCheckAbility() {
    const [userInfo, setUserInfo] = useState([])
    const { currentUser } = useSelector(mapState)

    useEffect(() => {
        firestore.collection('users').doc(currentUser.id).get().then(snapshot => {
            setUserInfo([{
                id: snapshot.id,
                abilityAdsBlock: snapshot.data().abilityAdsBlock,
                abilityShowMore: snapshot.data().abilityShowMore,
                adsBlockActiveDay: snapshot.data().adsBlockActiveDay,
                showMoreActiveDay: snapshot.data().showMoreActiveDay,
            }])
          
        })
           
        
    }, [])

    useEffect(() => {
        
        if(userInfo.length > 0){
            
            if(userInfo[0].adsBlockActiveDay){
                var time = moment(userInfo[0].adsBlockActiveDay.toDate()).locale('vi').fromNow()
                if(time == "7 ngày trước"){
                    firestore.collection('users').doc(userInfo[0].id).set({
                        abilityAdsBlock: "false",
                    }, {merge: true})
                }
            }
            
            if(userInfo[0].showMoreActiveDay){
                var time2 = moment(userInfo[0].showMoreActiveDay.toDate()).locale('vi').fromNow()
                if(time2 == "một tháng trước"){
                    firestore.collection('users').doc(userInfo[0].id).set({
                        abilityShowMore: "false",
                    }, {merge: true})
                }
            }   
            
            
        }
        
    }, [userInfo])

    return null

}

export default HandleCheckAbility