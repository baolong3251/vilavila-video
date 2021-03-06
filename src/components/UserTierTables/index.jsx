import React, { useEffect, useState } from 'react'
import "./style_userTierTables.scss"
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { useSelector } from 'react-redux';
import AlertModal from "../AlertModal"
import Button from '../Forms/Button';
import FormModal from '../FormModal';
import FormInput from '../Forms/FormInput';
import FormTextArea from '../Forms/FormTextArea';
import { firestore } from '../../firebase/utils';
import { doc, arrayUnion, arrayRemove, updateDoc, increment} from "firebase/firestore"; 

const mapState = (state) => ({ //this thing can happen if use redux
    currentUser: state.user.currentUser,
})

function UserTierTables(props) {
    const { currentUser } = useSelector(mapState);
    const [newTierPoint, setNewTierPoint] = useState(props.tier.cost*1)
    const [desc, setDesc] = useState(props.tier.desc)
    const [userInfo, setUserInfo] = useState([])
    const [userOfTierInfo, setUserOfTierInfo] = useState([])
    const [arraySigned, setArraySigned] = useState([])
    const [statSigned, setStatSigned] = useState(false)
    const [tierUserSigned, setTierUserSigned] = useState([])
    const [tierUserSignedNum, setTierUserSignedNum] = useState(0)
    const [channelPoint, setChannelPoint] = useState(0)

    const [hideModal, setHideModal] = useState(true)
    const [hideModal2, setHideModal2] = useState(true)
    const [hideModal3, setHideModal3] = useState(true)
    const [hideModal4, setHideModal4] = useState(true)

    const toggleModal = () => setHideModal(!hideModal);
    const toggleModal2 = () => setHideModal2(!hideModal2);
    const toggleModal3 = () => setHideModal3(!hideModal3);
    const toggleModal4 = () => setHideModal4(!hideModal4);

    const configModal = {
        hideModal,
        toggleModal
    }

    useEffect(() => {
        if(currentUser) {
            firestore.collection("users").doc(currentUser.id).onSnapshot((snapshot) => {
                try {
                    setUserInfo([{
                        userId: snapshot.id,
                        displayName: snapshot.data().displayName,
                        thumbnail: snapshot.data().thumbnail,
                        point: snapshot.data().point,
                    }])
                } catch (error) {
                    
                }
            })
        }
    },[currentUser])

    useEffect(() => {
        checkSignUp()
    },[userInfo])

    useEffect(() => {
        setTierUserSigned(props.tierSigned)
    },[props.tierSigned])

    useEffect(() => {
        if(props.tier.uid) {
            firestore.collection("users").doc(props.tier.uid).onSnapshot((snapshot) => {
                setUserOfTierInfo([...userOfTierInfo, {
                    userId: snapshot.id,
                    displayName: snapshot.data().displayName,
                    thumbnail: snapshot.data().thumbnail,
                    point: snapshot.data().point,
                }])
            })
        }
    },[props.tier.uid])

    useEffect(() => {
        if(tierUserSigned && tierUserSigned.length > 0){
            var someString = tierUserSigned[0].tier
            someString = someString.slice(4)
            someString = someString * 1
            setTierUserSignedNum(someString)
        }
        if(tierUserSigned && tierUserSigned.length == 0){
            setTierUserSignedNum(0)
        }
    },[tierUserSigned])

    useEffect(() => {
        if(userOfTierInfo.length > 0){
            var someNumber = userOfTierInfo[0].point * 1
            if(someNumber > 0 || someNumber == 0){
                setChannelPoint(someNumber)
            }
        }
    },[userOfTierInfo])


    const handleDelete = () =>{
        var video = firestore.collection('videos').where('tier', '==', props.tier.tier).where('videoAdminUID', '==', props.tier.uid);
        var image = firestore.collection('images').where('tier', '==', props.tier.tier).where('imageAdminUID', '==', props.tier.uid);
        video.get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                doc.ref.set({
                    tier: "",
                }, { merge: true });
            });
        })

        image.get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                doc.ref.set({
                    tier: "",
                }, { merge: true });
            });
        })
    }

    const handleChange = () => {
        if(newTierPoint < 0) {
            alert("M???c ti??u hao kh??ng ???????c d?????i 0")
            return
        }
        var trueCost = newTierPoint.toString()
        firestore.collection('tiers').doc(props.tier.id).set({
            cost: trueCost,
            desc: desc,
        }, { merge: true })
        toggleModal2()
    }

    const checkSignUp = () => {
        if(currentUser) {
            var someArray = props.tier.userSigned
            if(!someArray) {
                setStatSigned(false)
            }
            if(someArray) {
            someArray = someArray.find(item => item == currentUser.id);

                if(someArray){
                    setStatSigned(true)
                }

                if(!someArray){
                    setStatSigned(false)
                }
            }
        }
    }

    // const handleSetAnotherTier = (tier) => {
    //     if(tier == "tier1") handleIfTier1()
    //     if(tier == "tier2") handleIfTier2()
    //     if(tier == "tier3") handleIfTier3()
    //     if(tier == "tier4") handleIfTier4()
    //     if(tier == "tier5") handleIfTier5()
    //     // switch(tier) {
    //     //     case "tier1":{
    //     //         handleIfTier1()
    //     //         break;
    //     //     }
    //     //     case "tier2":{
    //     //         handleIfTier2()
    //     //         break;
    //     //     }

    //     //     case "tier3":{
    //     //         handleIfTier3()
    //     //         break;
    //     //     }

    //     //     case "tier4":{
    //     //         handleIfTier4()
    //     //         break;
    //     //     }

    //     //     case "tier5":{
    //     //         handleIfTier5()
    //     //         break;
    //     //     }
    //     // }


    // }

    // ===================================== THIS WILL RUN IF PROPS.TIER.TIER IS TIER 1
    // const handleIfTier1 = () => {

    //     if(tierUserSignedNum > 1)
    //     {
    //         alert("1...")
            
    //         return
            
    //     }

        

    //     //firestore where (userSigned in currentuser.id) where(uid == props.tier.uid)

    // }

    // ===================================== THIS WILL RUN IF PROPS.TIER.TIER IS TIER 2
    const handleIfTier2 = () => {

        if(tierUserSignedNum < 2 && tierUserSignedNum > 0){
            // var someArray = tierUserSigned[0].userSigned
            // someArray = someArray.filter(item => item !== userInfo[0].userId)
            // firestore.collection("tiers").doc(tierUserSigned[0].id).set({
            //     userSigned: someArray,
            // }, { merge: true })

            const q = doc(firestore, "tiers", tierUserSigned[0].id);

            updateDoc(q, {
                userSigned: arrayRemove(userInfo[0].userId)
            })
        }


        //firestore where (userSigned in currentuser.id) where(uid == props.tier.uid)

    }

    // ===================================== THIS WILL RUN IF PROPS.TIER.TIER IS TIER 3
    const handleIfTier3 = () => {

        if(tierUserSignedNum < 3 && tierUserSignedNum > 0){
            // var someArray = tierUserSigned[0].userSigned
            // someArray = someArray.filter(item => item !== userInfo[0].userId)
            // firestore.collection("tiers").doc(tierUserSigned[0].id).set({
            //     userSigned: someArray,
            // }, { merge: true })

            const q = doc(firestore, "tiers", tierUserSigned[0].id);

            updateDoc(q, {
                userSigned: arrayRemove(userInfo[0].userId)
            })
        }

        //firestore where (userSigned in currentuser.id) where(uid == props.tier.uid)

    }

    // ===================================== THIS WILL RUN IF PROPS.TIER.TIER IS TIER 4
    const handleIfTier4 = () => {

        if(tierUserSignedNum < 4 && tierUserSignedNum > 0){
            // var someArray = tierUserSigned[0].userSigned
            // someArray = someArray.filter(item => item !== userInfo[0].userId)
            // firestore.collection("tiers").doc(tierUserSigned[0].id).set({
            //     userSigned: someArray,
            // }, { merge: true })

            const q = doc(firestore, "tiers", tierUserSigned[0].id);

            updateDoc(q, {
                userSigned: arrayRemove(userInfo[0].userId)
            })
        }

        //firestore where (userSigned in currentuser.id) where(uid == props.tier.uid)

    }

    // ===================================== THIS WILL RUN IF PROPS.TIER.TIER IS TIER 5
    const handleIfTier5 = () => {

        if(tierUserSignedNum < 5 && tierUserSignedNum > 0){
            // var someArray = tierUserSigned[0].userSigned
            // someArray = someArray.filter(item => item !== userInfo[0].userId)
            // firestore.collection("tiers").doc(tierUserSigned[0].id).set({
            //     userSigned: someArray,
            // }, { merge: true })

            const q = doc(firestore, "tiers", tierUserSigned[0].id);

            updateDoc(q, {
                userSigned: arrayRemove(userInfo[0].userId)
            })
        }

        //firestore where (userSigned in currentuser.id) where(uid == props.tier.uid)

    }

    const handleSignUp = () => {
        if(statSigned){
            // var someArray = props.tier.userSigned
            // someArray = someArray.filter(item => item != currentUser.id);
            // firestore.collection("tiers").doc(props.tier.id).set({
            //     userSigned: someArray,
            // }, { merge: true })
            const q = doc(firestore, "tiers", props.tier.id);

            updateDoc(q, {
                userSigned: arrayRemove(currentUser.id)
            })
            
            firestore.collection('tierLog').where('uid', '==', props.tier.uid).where('signedUserId', '==', userInfo[0].userId).get().then(
                
                function(querySnapshot) {
                    
                    querySnapshot.forEach(function(doc) {
                        doc.ref.delete()
                    });
                    
                }

            )
            
            setStatSigned(false)
            setTierUserSignedNum(0)
            toggleModal4()
        }

        if(!statSigned){

            if(userInfo[0].point >= newTierPoint){
                // handleSetAnotherTier(props.tier.tier)
                // if(!stat) return
                if(props.tier.tier == "tier1"){
                    if(tierUserSignedNum > 1)
                        {
                            alert("B???n ???? ????ng k?? c???p b???c l???n h??n tr?????c ???? r???i...")
                            
                            return
                            
                        }
                }

                if(props.tier.tier == "tier2"){
                    if(tierUserSignedNum > 2)
                        {
                            alert("B???n ???? ????ng k?? c???p b???c l???n h??n tr?????c ???? r???i...")
                            
                            return
                        }
                    handleIfTier2()
                }

                if(props.tier.tier == "tier3"){
                    if(tierUserSignedNum > 3)
                    {
                        alert("B???n ???? ????ng k?? c???p b???c l???n h??n tr?????c ???? r???i...")
                        return
                    }
                        handleIfTier3()
                }

                if(props.tier.tier == "tier4"){
                    if(tierUserSignedNum > 4)
                        {
                            alert("B???n ???? ????ng k?? c???p b???c l???n h??n tr?????c ???? r???i...")
                            
                            return
                            
                        }
                        handleIfTier4()
                }

                if(props.tier.tier == "tier5"){
                    
                        handleIfTier5()
                }
                
                var today = new Date();
                var pointThing = props.tier.cost*1
                // var currentUserPoint = userInfo[0].point
                // currentUserPoint = currentUserPoint - pointThing
                // var userOfTierPoint = channelPoint*1
                // userOfTierPoint = userOfTierPoint + pointThing
                // userOfTierPoint = userOfTierPoint.toString()
                // currentUserPoint = currentUserPoint.toString()
                var someArray = props.tier.userSigned
                if(!someArray) someArray = arraySigned
                var count = someArray.push(currentUser.id);
                firestore.collection("tiers").doc(props.tier.id).set({
                    userSigned: arrayUnion(currentUser.id),
                }, { merge: true }).then(
                    
                    firestore.collection("users").doc(userInfo[0].userId).set({
                        point: increment(-pointThing),
                    }, { merge: true }),

                    firestore.collection("users").doc(props.tier.uid).set({
                        point: increment(pointThing),
                    }, { merge: true }),

                    firestore.collection('tierLog').where('uid', '==', props.tier.uid).where('signedUserId', '==', userInfo[0].userId).get().then(
                    
                        function(querySnapshot) {
                            if(!querySnapshot.empty){
                                querySnapshot.forEach(function(doc) {
                                    doc.ref.set({
                                        lastUpdate: today,
                                    }, { merge: true });
                                });
                            }

                            else{
                                firestore.collection('tierLog').add({
                                    uid: props.tier.uid,
                                    signedUserId: userInfo[0].userId,
                                    lastUpdate: today,
                                })
                            }
                        }

                    )

                )
                toggleModal3()
                
            }

            if(userInfo[0].point < newTierPoint){
                alert("??i???m c???a b???n kh??ng ????? ????? th???c hi???n thao t??c.")
                return
            }
        }

        
    }

    return (
        <div className='userDetails_tierOption'>
            
            <h2>
                C???p b???c {props.tier.tier.slice(4)}
            </h2>
            <p>
                {new Intl.NumberFormat().format(props.tier.cost)} ??i???m
            </p>
            <p style={{whiteSpace: "pre-line"}}>
                {props.tier.desc}
            </p>

            {
                currentUser && currentUser.id == props.tier.uid && [
                    <div className='tier-edit-option'>
                        <div onClick={() => toggleModal2()}  className='tier-edit-option-item'>
                            <EditIcon className='icon' />
                        </div>
                        <div onClick={() => toggleModal()} className='tier-edit-option-item'>
                            <DeleteForeverIcon className='icon' />
                        </div>
                    </div>
                ]
            }

            {
                currentUser && currentUser.id !== props.tier.uid && [
                    <div >
                        {!statSigned && [ 
                        <Button onClick={() => toggleModal3()}>
                            ????ng k??
                        </Button> ]}

                        {statSigned && [
                        <Button onClick={() => toggleModal4()}>
                            H???y
                        </Button> ]}
                        
                        {/* =========================ALERT FOR SIGNED UP TIER */}
                        <AlertModal hideModal={hideModal3} toggleModal={toggleModal3}>
                            <h2>
                                X??c nh???n
                            </h2>
                            <p>
                                B???n ch???c ch???n l?? mu???n ????ng k?? c???p b???c n??y ch????
                            </p>
                            <div className='flex-thing'>
                                <Button onClick={() => toggleModal3()}>
                                    H???y
                                </Button>
                                <Button onClick={() => handleSignUp() }>
                                    X??c nh???n
                                </Button>
                            </div>
                        </AlertModal>

                        {/* =========================ALERT FOR CANCEL TIER */}
                        <AlertModal hideModal={hideModal4} toggleModal={toggleModal4}>
                            <h2>
                                X??c nh???n
                            </h2>
                            <p>
                                B???n ch???c ch???n l?? mu???n h???y b??? ????ng k?? c???p b???c n??y ch????
                            </p>
                            <p>
                                L??u ??: b???n s??? kh??ng ???????c ho??n ??i???m n???u nh?? h???y ????ng k?? n??y...
                            </p>
                            <div className='flex-thing'>
                                <Button onClick={() => toggleModal4()}>
                                    H???y
                                </Button>
                                <Button onClick={() => handleSignUp() }>
                                    X??c nh???n
                                </Button>
                            </div>
                        </AlertModal>
                    </div>
                ]
            }
            
            {currentUser && currentUser.id == props.tier.uid && [<>
            <FormModal hideModal={hideModal2} toggleModal={toggleModal2}>
                <h2>
                    S???a c???p b???c {props.tier.tier.slice(4)}
                </h2>
                <FormInput 
                    type="number"
                    placeholder={"Nh???p s??? ??i???m"} 
                    min="0"
                    step="20000"
                    value={newTierPoint}
                    handleChange={e => setNewTierPoint(e.target.value)}
                />
                {new Intl.NumberFormat().format(newTierPoint)}
                <FormTextArea 
                    placeholder={"Nh???p th??ng tin c???n hi???n th??? t???i ????y..."}
                    handleChange={e => setDesc(e.target.value)}
                    value={desc}
                />
                
                <Button onClick={() => handleChange()}>
                    S???a
                </Button>
            </FormModal>

            <AlertModal {...configModal}>
                <h2>
                    X??c nh???n
                </h2>
                <p>
                    B???n ch???c ch???n l?? s??? x??a c???p b???c n??y ch????
                </p>
                <div className='flex-thing'>
                    <Button onClick={() => toggleModal()}>
                        H???y
                    </Button>
                    <Button onClick={() => firestore
                                        .collection('tiers')
                                        .doc(props.tier.id)
                                        .delete()
                                        .then( handleDelete ) }>
                        X??c nh???n
                    </Button>
                </div>
            </AlertModal>
            </>
            ]}

        </div>
    )
}

export default UserTierTables