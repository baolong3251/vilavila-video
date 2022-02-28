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

    useEffect(() => {
        if (currentUser && videoID && currentUser.id == userID && video.length == 0) {
            firestore.collection("videos").doc(videoID).onSnapshot((snapshot) => {
                setVideo([...video,{
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
            }) 
        }
    }, [currentUser])

    useEffect(() => {
        if (currentUser && videoID && currentUser.id == userID && tiers.length == 0) {
            firestore.collection("tiers").where("uid", "==", currentUser.id).onSnapshot((snapshot) => {
                setTiers(snapshot.docs.map(doc => ({
                    tid: doc.id, 
                    uid: doc.data().uid,
                    tier: doc.data().tier,
                    cost: doc.data().cost,
                    desc: doc.data().desc,
                  })
                ))
            })
            
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
            Opps... có vẻ đây là nơi không thuộc về bạn...
        </div>
    )

    const writeInfo = () => {
        if(video.length != 0) {
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
            alert("Xin nhập tựa video") 
            return
        }
        if(tierChoice) { 
            tier = tierChoice
        }
        if(fileImageUrl !== ""){
            firestore.collection('videos').doc(videoID).set({
                title: newTitle,
                desc: newDesc,
                thumbnail: fileImageUrl,
                tier: tier,
                tags: tags,
            }, { merge: true }).then(
                handleDeleteThumbnail(fileImageUrl)
            )
        }
        if(fileImageUrl == ""){
            firestore.collection('videos').doc(videoID).set({
                title: newTitle,
                desc: newDesc,
                tier: tier,
                tags: tags,
            }, { merge: true })
        }
        alert('success')
        resetForm()
        history.goBack()
    }

    //=====================================END THE EDITING THING

    return (
        <div>
            <h2>
                Sửa {newTitle}
            </h2>
            <FormInput 
                label="Tựa"
                type="text"
                placeholder={"Nhập tựa đề"} 
                value={newTitle}
                handleChange={e => setNewTitle(e.target.value)}
            />
            <FormTextArea 
                label="Mô tả"
                placeholder={"Nhập thông tin cần hiển thị tại đây..."}
                handleChange={e => setNewDesc(e.target.value)}
                value={newDesc}
            />
            <div className='userVideos-videoCard-editThumbnail-container'>
                {progressThumbnail > 0 ?
                    <progress value={progressThumbnail} max="100" /> 
                    :
                        <FormInput 
                            label="Hình đại diện"
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
                label="Thẻ (Tag)"
                type="text"
                placeholder={"Sau khi nhập nhấn Enter để thêm tag."} 
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
                    <label>Tier</label>
                    <RadioGroup className='userVideos-videoCard-radioBox' aria-label="gender" name="gender1" value={tierChoice} onChange={handleChangeTierChoice}>
                        <FormControlLabel disabled={tiers.find(item => item.tier == "tier1") ? null : "disabled"} value="tier1" control={<Radio />} label="Tier 1" />
                        <FormControlLabel disabled={tiers.find(item => item.tier == "tier2") ? null : "disabled"} value="tier2" control={<Radio />} label="Tier 2" />
                        <FormControlLabel disabled={tiers.find(item => item.tier == "tier3") ? null : "disabled"} value="tier3" control={<Radio />} label="Tier 3" />
                        <FormControlLabel disabled={tiers.find(item => item.tier == "tier4") ? null : "disabled"} value="tier4" control={<Radio />} label="Tier 4" />
                        <FormControlLabel disabled={tiers.find(item => item.tier == "tier5") ? null : "disabled"} value="tier5" control={<Radio />} label="Tier 5" />
                    </RadioGroup>
                </FormControl>
            </div>
            
            <div className='flex-thing'>
                <Button onClick={() => history.goBack()}>
                    Hủy
                </Button>
                <Button onClick={() => handleChange()}>
                    Sửa
                </Button>
            </div>
        </div>
    )
}

export default UserEditVideo