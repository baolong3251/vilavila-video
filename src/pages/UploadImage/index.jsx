import React from 'react'
import { useState, useEffect } from 'react'
import "./style_uploadImage.scss"
import Image from "../../assets/zOd.gif"
import AdCard from '../../components/AdCard'
import ImageOnScreen from '../../components/ImageOnScreen'
import FormInput from '../../components/Forms/FormInput'
import FormTextArea from '../../components/Forms/FormTextArea'
import Button from "../../components/Forms/Button"

//firebase thing
import { storage } from "../../firebase/utils";
import { firestore, auth } from '../../firebase/utils'
import { doc, updateDoc, deleteField } from "firebase/firestore";
import { deleteObject } from "firebase/storage";


import { useDispatch, useSelector } from "react-redux"
import { addImageStart } from "../../redux/Images/images.actions";

//MUI V4
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

const mapState = ({ imagesData }) => ({
    images: imagesData.images
})


function UploadImage() {
    const { images } = useSelector(mapState)
    const dispatch = useDispatch()
    const [title, setTitle] = useState("")
    const [desc, setDesc] = useState("")
    const [tempTag, setTempTag] = useState('')
    const [tags, setTags] = useState([])
    const [privacy, setPrivacy] = React.useState('private');
    // const [views, setViews] = useState(0)
    // const [likes, setLikes] = useState(0)
    const [imageId, setImageId] = useState('')
    const userid = auth.currentUser.uid
    const [tier, setTier] = useState('')

    const [fileImages, setFileImages] = useState([]);
    const [progress, setProgress] = useState(0);
    const [fileImageUrl, setFileImageUrl] = useState([])

    const handleChangePrivacy = (event) => {
        setPrivacy(event.target.value);
    }

    const handleUploadTags = (event) => {
        tags.map((tag) => {
            firestore.collection('tags').doc().set({
                tag: tag,
                imageId: imageId
            })
        })
    }

    const onKeyDownHandler = e => {
        if (e.keyCode === 13) {
            setTags([...tags, tempTag])
            setTempTag('')
        }
    };

    //HANDLE RESET FORM------------------

    const resetForm = () => {
        setTitle('')
        setDesc('')
        setTempTag('')
        setTags([])
        setPrivacy('private')
        setFileImages([])
        setProgress(0)
        setImageId('')
        setFileImageUrl('')
    }

    //SOME THING FOR HANDLE IMAGE ------------

    useEffect(() => {
        const promises = [];
        if(fileImages == '') return
        const number = Math.random();
        fileImages.map((image) => {
            if(image.size > 10e6) {
                alert('file của bạn đã vượt quá 10MB xin hãy chọn file khác')
                return
            }
            const name = fileImages[0].name
            const uploadTask = storage.ref(`images/${userid}_images/${name}_${number}/${image.name}`).put(image);
            promises.push(uploadTask);
            uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                console.log(error);
            },
            async () => {
                await storage
                .ref(`images/${userid}_images/${name}_${number}`)
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

        ).catch((err) => console.log(err));
        
    }, [fileImages])

    console.log(fileImageUrl)
    console.log(fileImages)
    console.log(imageId)
    
    useEffect(() => {
        
        handleUploadFireStore()
        
       
    }, [fileImageUrl])

    const handleUploadFireStore = () => {
        var idThing = imageId
        if (fileImageUrl.length !== 0) {
            
            if(idThing == ''){
                firestore.collection('images').add({
                    sourceLink: fileImageUrl,
                    imageAdminUID: userid,
                    privacy: "not-done",
                }).then(docRef => {
                    setImageId(docRef.id)
                })
            }
            if(idThing !== ''){
                firestore.collection('images').doc(idThing).set({
                    sourceLink: fileImageUrl,
                }, { merge: true })
            }
        }
    } 

    const handleUploadFireStoreWhenArray0 = (arr) => {
        var idThing = imageId
        
        if(idThing !== ''){
            firestore.collection('images').doc(idThing).set({
                sourceLink: arr,
            }, { merge: true })
        }
        
    } 

    const handleChangeFileImage = (e) => {
        for (let i = 0; i < e.target.files.length; i++) {
            const newImage = e.target.files[i];
            newImage["id"] = Math.random();
            setFileImages((prevState) => [...prevState, newImage])
        }
    }

    console.log(fileImageUrl)

    const handleDeleteImage = (imgUrl) => {
        var someArray = fileImageUrl
        if(someArray.length > 1) {
            someArray = someArray.filter(url => url != imgUrl);
            var desertRef = storage.refFromURL(imgUrl);

            deleteObject(desertRef).then(() => {
                setFileImageUrl(someArray)
                alert('Đã xóa!!')
            }).catch((error) => {
                console.log(error)
            });
        }

        else {
            someArray = [];
            var desertRef = storage.refFromURL(imgUrl);

            deleteObject(desertRef).then(() => {
                handleUploadFireStoreWhenArray0(someArray)
                setFileImageUrl(someArray)
                alert('Đã xóa!!')
            }).catch((error) => {
                console.log(error)
            });
        }
  
    }

    const handleDeleteTag = (tagName) => {
        var someArray = tags
        someArray = someArray.filter(tagThing => tagThing !== tagName)
        setTags(someArray)
    }

    useEffect(() => {
        if(fileImageUrl == '') {
            setProgress(0)
        }
        if(fileImages !== ''){
            setFileImages('')
        }
    }, [fileImageUrl])

    //THIS THING FOR UPLOAD ALL OF INFORMATION ------------
    const handleSubmit = (e) => {
        e.preventDefault();
        var sourceLink = fileImageUrl
        if(title == ''){
            alert("Tựa đề của bạn???")
            return
        }
        dispatch(
            addImageStart({
                title,
                desc,
                privacy,
                sourceLink,
                // views,
                // likes,
                imageId,
                tags,
                tier,
            })
        )

        const docRef = doc(firestore, "images/" + imageId);
        updateDoc(docRef, {
            "imageId": deleteField()
        });

        // handleUploadTags()
        alert('Hoàn tất!!!')
        resetForm()
    }

    return (
        <div className='uploadImage'>
            <ImageOnScreen />
            <AdCard 
                image={Image}
                link="https://panel.xn--9kqw7o.com/auth/register?code=iwara"
            />
            <div>
                <div className='uploadImage_container'>
                    <FormInput 
                        label="Tên"
                        type="Text"
                        placeholder="Tựa hình ảnh"
                        value={title}
                        handleChange={e => setTitle(e.target.value)}
                    />
                </div>

                <div className='uploadImage_container'>
                    <FormTextArea 
                        label="Mô tả"
                        type="Text"
                        placeholder="Mô tả"
                        value={desc}
                        handleChange={e => setDesc(e.target.value)}
                    />
                </div>

                <div className='uploadImage_container'>
                    {progress > 0 ?
                        <progress value={progress} max="100" /> 
                        :
                            <FormInput 
                                label="Hình đại diện"
                                type="file"
                                accept="image/*"
                                multiple
                                handleChange={handleChangeFileImage}
                            />
                    }    
                    
                    {fileImageUrl == '' ? null : 
                        <>
                            <div className='imagePreview_container'>
                            {
                                fileImageUrl.map((imgUrl) => {
                                    return(
                                        <div className='imagePreview'> 
                                            <img src={imgUrl} /> 
                                            <span onClick={() => handleDeleteImage(imgUrl)}>x</span>
                                        </div> 
                                    )
                                })
                            }
                            </div>
                        </>
                    } 
                            
                </div>

                <div className='uploadImage_container'>
                    <FormInput 
                        label="Tags"
                        type="Text"
                        placeholder="Sau khi nhập nhấn Enter để thêm tag."
                        value={tempTag}
                        onKeyDown={onKeyDownHandler}
                        handleChange={e => setTempTag(e.target.value)}
                    />
                    <div className='showTags'>
                        <span>
                            Tags:
                        </span>
                        {
                            tags.map((tag) => {
                                return(
                                    <span className='tag'>
                                        {tag} 
                                        <div onClick={() => handleDeleteTag(tag)} className='del-tag'>
                                            x
                                        </div>
                                    </span>
                                )
                            })
                        }
                    </div>
                </div>

                <div className='uploadImage_container'>
                    <FormControl className='uploadImage_radioBoxContainer' component="fieldset">
                        <label></label>
                        <RadioGroup className='uploadImage_radioBox' aria-label="gender" name="gender1" value={privacy} onChange={handleChangePrivacy}>
                            <FormControlLabel value="public" control={<Radio />} label="Công khai" />
                            <FormControlLabel value="private" control={<Radio />} label="Riêng tư" />
                        </RadioGroup>
                    </FormControl>
                </div>

                <Button onClick={handleSubmit}>
                    Hoàn tất
                </Button>

            </div>
        </div>
    )
}

export default UploadImage
