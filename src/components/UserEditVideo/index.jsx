import { FormControl, FormControlLabel, Radio, RadioGroup } from '@material-ui/core'
import { deleteObject } from 'firebase/storage'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { firestore, storage } from '../../firebase/utils'
import Button from '../Forms/Button'
import FormInput from '../Forms/FormInput'
import FormTextArea from '../Forms/FormTextArea'
import "./style_userEditVideo.scss"

const mapState = ({ user }) => ({
    currentUser: user.currentUser
  })

function UserEditVideo() {
    const {currentUser} = useSelector(mapState)
    const { videoID } = useParams()
    const { userID } = useParams()
    const [video, setVideo] = useState([])
    const history = useHistory()
    const [tags, setTags] = useState([])
    const [tempTag, setTempTag] = useState('')

    const [tiers, setTiers] = useState([])
    const [newTitle, setNewTitle] = useState('')
    const [newDesc, setNewDesc] = useState('')
    const [progressThumbnail, setProgressThumbnail] = useState(0);
    const [fileImageUrl, setFileImageUrl] = useState('');
    const [images, setImages] = useState([]);
    const [tierChoice, setTierChoice] = React.useState('');
    const [privacyChoice, setPrivacyChoice] = React.useState('public');

    useEffect(() => {
        if (currentUser && videoID && currentUser.id == userID && video.length == 0) {
            firestore.collection("videos").doc(videoID).get().then((snapshot) => {
                try {
                    setVideo([{
                        vid: snapshot.id, 
                        title: snapshot.data().title,
                        views: snapshot.data().views,
                        privacy: snapshot.data().privacy,
                        desc: snapshot.data().desc,
                        category: snapshot.data().category,
                        sourceLink: snapshot.data().sourceLink,
                        thumbnail: snapshot.data().thumbnail,
                        createdDate: snapshot.data().createdDate,
                        videoAdminUID: snapshot.data().videoAdminUID,
                        tier: snapshot.data().tier,
                        tags: snapshot.data().tags,
                    }])
                } catch (error) {
                    
                }
            }) 
        }
    }, [videoID])

    useEffect(() => {
        if (currentUser && videoID && currentUser.id == userID && tiers.length == 0) {
            
            firestore.collection("tiers").where("uid", "==", currentUser.id).get().then((snapshot) => {
                setTiers(snapshot.docs.map(doc => ({
                    tid: doc.id, 
                    uid: doc.data().uid,
                    tier: doc.data().tier,
                    cost: doc.data().cost,
                    desc: doc.data().desc,
                  })
                ))
            })
        }

        if(video.length > 0) {
            writeInfo()
        }
    }, [video])

    useEffect(() => { //===================THIS USE EFFECT FOR UPLOADING THUMBNAIL
        const promises = [];
        if(images == '') return
        const number = Math.random();
        images.map((image) => {
            const name = images[0].name
            const uploadTask = storage.ref(`thumbnails/${currentUser.id}_thumbnails/${name}_${number}/${image.name}`).put(image);
            promises.push(uploadTask);
            uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgressThumbnail(progress);
            },
            (error) => {
                console.log(error);
            },
            async () => {
                await storage
                .ref(`thumbnails/${currentUser.id}_thumbnails/${name}_${number}`)
                .child(image.name)
                .getDownloadURL()
                .then((urls) => {
                    var sourceThumbnail = urls
                    setFileImageUrl(sourceThumbnail)
                });
            }
            );
        });
        
        Promise.all(promises)
            .then(() => 

        console.log(fileImageUrl),
        setProgressThumbnail(0)
        

        ).catch((err) => console.log(err));
    }, [images])

    useEffect(() => {
        if(fileImageUrl == '') {
            setProgressThumbnail(0)
        }
    }, [fileImageUrl])

    //=========================================THE EDITING THING

    if (currentUser && currentUser.id !== userID) return (
        <div>
            Opps... c?? v??? ????y l?? n??i kh??ng thu???c v??? b???n...
        </div>
    )

    const writeInfo = () => {
        if(video.length > 0) {
            setNewTitle(video[0].title)
            setNewDesc(video[0].desc)
            setTierChoice(video[0].tier)
            setTags(video[0].tags)
        }
    }

    const resetForm = () => {
        setImages([])
        setFileImageUrl('')
    }

    const onKeyDownHandler = e => {
        if (e.keyCode === 13) {
            setTags([...tags, tempTag])
            setTempTag('')
        }
    };

    const handleChangeTierChoice = (event) => {
        setTierChoice(event.target.value);
    };

    const handleChangePrivacyChoice = (event) => {
        setPrivacyChoice(event.target.value);
    };

    const handleChangeFileImage = (e) => {
        for (let i = 0; i < e.target.files.length; i++) {
            const newImage = e.target.files[i];
            newImage["id"] = Math.random();
            setImages((prevState) => [newImage])
        }
    }

    const handleDeleteThumbnail = (url) => {
        var desertRef = storage.refFromURL(url);

        deleteObject(desertRef).then(() => {
            setFileImageUrl('')
        }).catch((error) => {
            console.log(error)
        });
  
    }

    const handleDeleteTag = (tagName) => {
        var someArray = tags
        someArray = someArray.filter(tagThing => tagThing !== tagName)
        setTags(someArray)
    }

    const handleChange = () => {
        var tier = ""
        if(newTitle == '') { 
            alert("Xin nh???p t???a video") 
            return
        }
        if(tierChoice) { 
            tier = tierChoice
        }
        var titleForSearch = newTitle.toLowerCase()
        var titleForSearchRev = newTitle.split("").reverse().join("");
        if(fileImageUrl !== "" && video[0].thumbnail !== ""){
            firestore.collection('videos').doc(videoID).set({
                title: newTitle,
                desc: newDesc,
                thumbnail: fileImageUrl,
                tier: tier,
                tags: tags,
                privacy: privacyChoice,
                titleForSearch: titleForSearch,
                titleForSearchRev: titleForSearchRev,
            }, { merge: true }).then(
                handleDeleteThumbnail(video[0].thumbnail)
            )
        }
        if(fileImageUrl !== ""){
            firestore.collection('videos').doc(videoID).set({
                title: newTitle,
                desc: newDesc,
                thumbnail: fileImageUrl,
                tier: tier,
                tags: tags,
                privacy: privacyChoice,
                titleForSearch: titleForSearch,
                titleForSearchRev: titleForSearchRev,
            }, { merge: true }).then(
            )
        }
        if(fileImageUrl == ""){
            firestore.collection('videos').doc(videoID).set({
                title: newTitle,
                desc: newDesc,
                tier: tier,
                tags: tags,
                privacy: privacyChoice,
                titleForSearch: titleForSearch,
                titleForSearchRev: titleForSearchRev,
            }, { merge: true })
        }
        alert('C??c thay ?????i ???? ???????c ghi l???i!!')
        resetForm()
        history.goBack()
    }

    //=====================================END THE EDITING THING

    return (
        <div>
            <h2>
                S???a {newTitle}
            </h2>
            <FormInput 
                label="T???a"
                type="text"
                placeholder={"Nh???p t???a ?????"} 
                value={newTitle}
                handleChange={e => setNewTitle(e.target.value)}
            />
            <FormTextArea 
                label="M?? t???"
                placeholder={"Nh???p th??ng tin c???n hi???n th??? t???i ????y..."}
                handleChange={e => setNewDesc(e.target.value)}
                value={newDesc}
            />
            <div className='userVideos-videoCard-editThumbnail-container'>
                {progressThumbnail > 0 ?
                    <progress value={progressThumbnail} max="100" /> 
                    :
                        <FormInput 
                            label="H??nh ?????i di???n"
                            type="file"
                            accept="image/*"
                            handleChange={handleChangeFileImage}
                        />
                }    
                
                {fileImageUrl == '' ? null : 
                    <>
                        <div className='thumbnailPreview'> 
                            <img src={fileImageUrl} /> 
                            <span onClick={() => handleDeleteThumbnail(fileImageUrl)}>x</span>
                        </div>
                    </>
                } 
                        
            </div>

            <FormInput 
                label="Th??? (Tag)"
                type="text"
                placeholder={"Sau khi nh???p nh???n Enter ????? th??m tag."} 
                value={tempTag}
                onKeyDown={onKeyDownHandler}
                handleChange={e => setTempTag(e.target.value)}
            />

            <div className='showTags'>
                <span>
                    Tags:
                </span>
                {   tags ?
                    tags.map((tag) => {
                        return(
                            <>
                            <span key={tag} className='tag'>
                                {tag} 
                                <div onClick={() => handleDeleteTag(tag)} className='del-tag'>
                                    x
                                </div>
                            </span>
                            </>
                        )
                    }) : null
                }
            </div>

            <div className='userVideos-videoCard-container'>
                <FormControl className='userVideos-videoCard-radioBoxContainer' component="fieldset">
                    <label>C???p b???c</label>
                    <RadioGroup className='userVideos-videoCard-radioBox' aria-label="gender" name="gender1" value={tierChoice} onChange={handleChangeTierChoice}>
                        <FormControlLabel value="" control={<Radio />} label="C???p b???c 0" />
                        <FormControlLabel disabled={tiers.find(item => item.tier == "tier1") ? null : "disabled"} value="tier1" control={<Radio />} label="C???p b???c 1" />
                        <FormControlLabel disabled={tiers.find(item => item.tier == "tier2") ? null : "disabled"} value="tier2" control={<Radio />} label="C???p b???c 2" />
                        <FormControlLabel disabled={tiers.find(item => item.tier == "tier3") ? null : "disabled"} value="tier3" control={<Radio />} label="C???p b???c 3" />
                        <FormControlLabel disabled={tiers.find(item => item.tier == "tier4") ? null : "disabled"} value="tier4" control={<Radio />} label="C???p b???c 4" />
                        <FormControlLabel disabled={tiers.find(item => item.tier == "tier5") ? null : "disabled"} value="tier5" control={<Radio />} label="C???p b???c 5" />
                    </RadioGroup>
                </FormControl>
            </div>

            <div className='userVideos-videoCard-container'>
                <FormControl className='userVideos-videoCard-radioBoxContainer' component="fieldset">
                    <label>Quy???n ri??ng t??</label>
                    <RadioGroup className='userVideos-videoCard-radioBox' aria-label="privacy" name="privacy" value={privacyChoice} onChange={handleChangePrivacyChoice}>
                        <FormControlLabel value="public" control={<Radio />} label="C??ng khai" />
                        <FormControlLabel value="private" control={<Radio />} label="Ri??ng t??" />
                    </RadioGroup>
                </FormControl>
            </div>
            
            <div className='flex-thing'>
                <Button onClick={() => history.goBack()}>
                    H???y
                </Button>
                <Button onClick={() => handleChange()}>
                    S???a
                </Button>
            </div>
        </div>
    )
}

export default UserEditVideo