import React, { useState } from 'react'
import Button from "../../components/Forms/Button"
import "./style_userTiers.scss"
import FormModal from "../../components/FormModal"
import FormInput from "../../components/Forms/FormInput"
import FormSelect from "../../components/Forms/FormSelect"
import FormTextArea from "../../components/Forms/FormTextArea"
import { firestore } from '../../firebase/utils';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import UserTierTables from '../../components/UserTierTables';

function UserTiers() {
  const [hideModal, setHideModal] = useState(true)
  const toggleModal = () => setHideModal(!hideModal);
  const [newTier, setNewTier] = useState("tier1")
  const [newTierPoint, setNewTierPoint] = useState(0)
  const { userID } = useParams()
  const [desc, setDesc] = useState('')
  const [tiers, setTiers] = useState([])

  const configModal = {
      hideModal,
      toggleModal
  }

  useEffect(() => {
    firestore.collection('tiers').where('uid', '==', userID).onSnapshot(snapshot => {
        setTiers(snapshot.docs.map(doc => ({
          id: doc.id, 
          uid: doc.data().uid,
          tier: doc.data().tier,
          cost: doc.data().cost,
          desc: doc.data().desc,
        })
      ))
    })
  }, [userID])

  const handleAddTier = () => {
    const someArray = tiers
    const found = someArray.find(element => element.tier == newTier);

    if(found) {
      alert('Opps... có lỗi xảy ra, có vẻ như tier này đã được thêm vào trước đó rồi.')
      return
    }
    var realCost = newTierPoint.toString()
    firestore.collection('tiers').add({
      uid: userID,
      tier: newTier,
      cost: realCost,
      desc: desc,
      userSigned: [],
    });
    resetForm()
  }

  const resetForm = () => {
    setNewTierPoint(0)
    setDesc('')
    setHideModal(true)
  }
  

  return (
    <div>
        <div className="button-tier">
          <Button onClick={() => toggleModal()}>
            Thêm tier
          </Button>
        </div>

        <FormModal {...configModal}>
          <FormSelect 
            label="Tiers"
            options={[{
                value: "tier1",
                name: "Tier 1"
            }, {
                value: "tier2",
                name: "Tier 2"
            }, {
              value: "tier3",
              name: "Tier 3"
            }, {
              value: "tier4",
              name: "Tier 4"
            }]
          
            }
            handleChange={e => setNewTier(e.target.value)}
          />
          <FormInput 
              type="number"
              placeholder={"Nhập số điểm"} 
              min="0"
              step="20000"
              value={newTierPoint}
              handleChange={e => setNewTierPoint(e.target.value)}
          />
          {new Intl.NumberFormat().format(newTierPoint)}
          <FormTextArea 
              placeholder={"Nhập thông tin cần hiển thị tại đây..."}
              handleChange={e => setDesc(e.target.value)}
          />

          <Button onClick={() => handleAddTier()}>
            Thêm
          </Button>
        </FormModal>


        <div className='userDetails_tierList'>
            
            {tiers.map(tier => {
              return(
                <div key={tier.id}>
                  <UserTierTables tier={tier} />
                </div>
              )
            })}

        </div>

    </div>
  )
}

export default UserTiers