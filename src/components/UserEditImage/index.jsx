import { FormControl, FormControlLabel, Radio, RadioGroup } from '@material-ui/core'
import { deleteObject } from 'firebase/storage'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { firestore, storage } from '../../firebase/utils'
import Button from '../Forms/Button'
import FormInput from '../Forms/FormInput'
import FormTextArea from '../Forms/FormTextArea'
import "./style_userEditImage.scss"

const mapState = ({ user }) => ({
    currentUser: user.currentUser
  })

function UserEditImage() {
    const {currentUser} = useSelector(mapState)
    const { imageID } = useParams()
    const { userID } = useParams()
    const [image, setImage] = useState([])
    const history = useHistory()
    const [tags, setTags] = useState([])
    const [tempTag, setTempTag] = useState('')

    const [tiers, setTiers] = useState([])
    const [newTitle, setNewTitle] = useState('')
    const [newDesc, setNewDesc] = useState('')
    const [sourceLink, setSourceLink] = useState([])
    const [progressThumbnail, setProgressThumbnail] = useState(0);
    const [fileImageUrl, setFileImageUrl] = useState([]);
    const [images, setImages] = useState([]);
    const [tierChoice, setTierChoice] = React.useState('');
    const [privacyChoice, setPrivacyChoice] = React.useState('public');
    const [urlForDelete, setUrlForDelete] = useState([])

    useEffect(() => {
        if (currentUser && imageID && currentUser.id == userID && image.length == 0) {
            firestore.collection("images").doc(imageID).get().then((snapshot) => {
                try {
                    setImage([{
                        id: snapshot.id, 
                        title: snapshot.data().title,
                        privacy: snapshot.data().privacy,
                        desc: snapshot.data().desc,
                        sourceLink: snapshot.data().sourceLink,
                        createdDate: snapshot.data().createdDate,
                        imageAdminUID: snapshot.data().videoAdminUID,
                        tier: snapshot.data().tier,
                        tags: snapshot.data().tags,
                    }])
                } catch (error) {
                    
                }
            }) 
        }
    }, [imageID])

    useEffect(() => {
        if (currentUser && imageID && currentUser.id == userID && tiers.length == 0) {
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
        }

        if(image.length > 0){
            writeInfo()
        }
    }, [image])

    useEffect(() => { //===================THIS USE EFFECT FOR UPLOADING IMAGES
        const promises = [];
        if(images == '') return
        const number = Math.random();
        images.map((image) => {
            const name = images[0].name
            const uploadTask = storage.ref(`images/${currentUser.id}_images/${name}_${number}/${image.name}`).put(image);
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
                .ref(`images/${currentUser.id}_images/${name}_${number}`)
                .child(image.name)
                .getDownloadURL()
                .then((urls) => {
                    var sourceImage = urls
                    setFileImageUrl((prevState) => [...prevState, sourceImage])
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
        if(image.length !== 0) {
            setNewTitle(image[0].title)
            setNewDesc(image[0].desc)
            setTierChoice(image[0].tier)
            setTags(image[0].tags)
            setSourceLink(image[0].sourceLink)
        }
    }

    const resetForm = () => {
        setImages([])
        setFileImageUrl([])
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
            setImages((prevState) => [...prevState, newImage])
        }
    }

    const handleDeleteImage = (url) => {
        var arrayThing = sourceLink
        var someArray = fileImageUrl
        var arrayTemp = arrayThing.concat(someArray)
        if(arrayTemp.length > 1) {
            someArray = someArray.filter(item => item != url);
            setFileImageUrl(someArray)
            setUrlForDelete((prevState) => [...prevState, url])
        } else {
            alert("Không thể xóa hình ảnh duy nhất còn lại!!")
            return
        }
  
    }

    const handleDeleteImage2 = (url) => {
        var someArray = sourceLink
        var arrayThing = fileImageUrl
        var arrayTemp = someArray.concat(arrayThing)
        if(arrayTemp.length > 1) {
            someArray = someArray.filter(item => item != url);
            setSourceLink(someArray)
            setUrlForDelete((prevState) => [...prevState, url])
        }  else {
            alert("Không thể xóa hình ảnh duy nhất còn lại!!")
            return
        }
  
    }

    const handleDeleteStorage = () => {
        urlForDelete.map(urlThing => {
            var desertRef = storage.refFromURL(urlThing);

            deleteObject(desertRef).then(() => {
                
            }).catch((error) => {
                console.log(error)
            });
        })
    }

    const handleDeleteTag = (tagName) => {
        var someArray = tags
        someArray = someArray.filter(tagThing => tagThing !== tagName)
        setTags(someArray)
    }

    const handleChange = () => {
        var tier = ""
        if(newTitle == '') { 
            alert("Xin nhập tựa hình ảnh!!") 
            return
        }
        if(tierChoice) { 
            tier = tierChoice
        }
        var array1 = sourceLink
        var array2 = fileImageUrl
        var array3 = array1.concat(array2)
        if(array3.length > 0){
            handleDeleteStorage()

            firestore.collection('images').doc(imageID).set({
                title: newTitle,
                desc: newDesc,
                sourceLink: array3,
                tier: tier,
                tags: tags,
                privacy: privacyChoice,
            }, { merge: true })
        }
        
        alert('Các thay đổi đã được ghi lại!!')
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
            <div className='userImages-imageCard-editThumbnail-container'>
                {progressThumbnail > 0 ?
                    <progress value={progressThumbnail} max="100" /> 
                    :
                        <FormInput 
                            label="Hình ảnh"
                            type="file"
                            accept="image/*"
                            multiple
                            handleChange={handleChangeFileImage}
                        />
                }    

                <div className="userImages-imageCard-editThumbnail-subContainer">
                    {sourceLink.length > 0 ? 
                        sourceLink.map(img => {
                            return (
                                <div key={img} className='thumbnailPreview'> 
                                    <img src={img} /> 
                                    <span onClick={() => handleDeleteImage2(img)}>x</span>
                                </div> 
                            )
                        })
                    :   null }
                </div>
                
                <div className="userImages-imageCard-editThumbnail-subContainer">
                    {fileImageUrl.length == 0 ? null : 
                        fileImageUrl.map(img => {
                            return (
                        
                                <div key={img} className='thumbnailPreview'> 
                                    <img src={img} /> 
                                    <span onClick={() => handleDeleteImage(img)}>x</span>
                                </div>
                            
                            )
                        })
                    } 
                </div>
                        
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

            <div className='userImages-imageCard-container'>
                <FormControl className='userImages-imageCard-radioBoxContainer' component="fieldset">
                    <label>Tier</label>
                    <RadioGroup className='userImages-imageCard-radioBox' aria-label="gender" name="gender1" value={tierChoice} onChange={handleChangeTierChoice}>
                        <FormControlLabel value="" control={<Radio />} label="Cấp bậc 0" />
                        <FormControlLabel disabled={tiers.find(item => item.tier == "tier1") ? null : "disabled"} value="tier1" control={<Radio />} label="Cấp bậc 1" />
                        <FormControlLabel disabled={tiers.find(item => item.tier == "tier2") ? null : "disabled"} value="tier2" control={<Radio />} label="Cấp bậc 2" />
                        <FormControlLabel disabled={tiers.find(item => item.tier == "tier3") ? null : "disabled"} value="tier3" control={<Radio />} label="Cấp bậc 3" />
                        <FormControlLabel disabled={tiers.find(item => item.tier == "tier4") ? null : "disabled"} value="tier4" control={<Radio />} label="Cấp bậc 4" />
                        <FormControlLabel disabled={tiers.find(item => item.tier == "tier5") ? null : "disabled"} value="tier5" control={<Radio />} label="Cấp bậc 5" />
                    </RadioGroup>
                </FormControl>
            </div>

            <div className='userImages-imageCard-container'>
                <FormControl className='userImages-imageCard-radioBoxContainer' component="fieldset">
                    <label>Quyền riêng tư</label>
                    <RadioGroup className='userImages-imageCard-radioBox' aria-label="privacy" name="privacy" value={privacyChoice} onChange={handleChangePrivacyChoice}>
                        <FormControlLabel value="public" control={<Radio />} label="Công khai" />
                        <FormControlLabel value="private" control={<Radio />} label="Riêng tư" />
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

export default UserEditImage