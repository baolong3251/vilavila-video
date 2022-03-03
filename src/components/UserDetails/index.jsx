import React, { useState } from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { firestore } from '../../firebase/utils'
import UserTierTables from '../UserTierTables'
import "./style_userDetails.scss"

const mapState = ({ user }) => ({
  currentUser: user.currentUser
})

function UserDetails() {
  const {currentUser} = useSelector(mapState)
  const { userID } = useParams()
  const [tiers, setTiers] = useState([])
  const [tierSigned, setTierSigned] = useState([])

  useEffect(() => {
    firestore.collection('tiers').where('uid', '==', userID).onSnapshot(snapshot => {
        setTiers(snapshot.docs.map(doc => ({
          id: doc.id, 
          uid: doc.data().uid,
          tier: doc.data().tier,
          cost: doc.data().cost,
          desc: doc.data().desc,
          userSigned: doc.data().userSigned,
        })
      ))
    })
  }, [userID])

  useEffect(() => {
    if(currentUser){
      firestore.collection('tiers').where('userSigned', 'array-contains', currentUser.id).where('uid', '==', userID).onSnapshot(snapshot => {
        setTierSigned(snapshot.docs.map(doc => ({
            id: doc.id, 
            uid: doc.data().uid,
            tier: doc.data().tier,
            cost: doc.data().cost,
            desc: doc.data().desc,
            userSigned: doc.data().userSigned,
          })
        ))
      })
    }
  }, [currentUser])

  return (
    <>
    <div className='userDetails_tierList'>
      {tiers.map(tier => {
        return(
          <div key={tier.id}>
            <UserTierTables tier={tier} tiers={tiers} tierSigned={tierSigned} />
          </div>
        )
      })}
    </div>
    </>
  )
}

export default UserDetails