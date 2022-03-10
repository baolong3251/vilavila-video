import React from 'react'
import { useState, useEffect } from 'react'
import "./style_uploadvideo.scss"
import Image from "../../assets/zOd.gif"
import AdCard from '../../components/AdCard'
import ImageOnScreen from '../../components/ImageOnScreen'
import FormInput from '../../components/Forms/FormInput'
import FormTextArea from '../../components/Forms/FormTextArea'
import Button from "../../components/Forms/Button"
import ReactPlayer from 'react-player'


//firebase thing
import { storage } from "../../firebase/utils";
import { firestore, auth } from '../../firebase/utils'
import { doc, updateDoc, deleteField } from "firebase/firestore";
import { deleteObject } from "firebase/storage";


import { useDispatch, useSelector } from "react-redux"
import { addVideoStart } from "../../redux/Videos/videos.actions";

//MUI V4
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

const mapState = ({ videosData }) => ({
    videos: videosData.videos
})


function UploadVideo() {
    const { videos } = useSelector(mapState)
    const dispatch = useDispatch()
    const [title, setTitle] = useState("")
    const [desc, setDesc] = useState("")
    const [category, setCategory] = React.useState('animation');
    const [tempTag, setTempTag] = useState('')
    const [tags, setTags] = useState([])
    const [privacy, setPrivacy] = React.useState('private');
    const [views, setViews] = useState(0)
    const [likes, setLikes] = useState([])
    const [vId, setVid] = useState('')
    const [tier, setTier] = useState('')
    const userid = auth.currentUser.uid

    const [images, setImages] = useState([]);
    const [filevideos, setFileVideos] = useState([]);
    const [progress, setProgress] = useState(0);
    const [progressThumbnail, setProgressThumbnail] = useState(0);
    const [filevideoUrl, setFilevideoUrl] = useState('')
    const [fileImageUrl, setFileImageUrl] = useState('')

    //USE EFFECT FOR ADD LINK VIDEO INTO FIRESTORE---------------

    useEffect(() => {
        if(filevideoUrl !== '' && vId == '') {
            firestore.collection('videos').add({
                sourceLink: filevideoUrl,
                videoAdminUID: userid,
            }).then(docRef => {
                setVid(docRef.id)
            })
        }
    }, [filevideoUrl])

    // const handleUploadVideoFireStore = () => {
    //     var idThing = vId
    //     if (filevideoUrl.length !== 0) {
            
    //         if(idThing == ''){
    //             firestore.collection('videos').add({
    //                 sourceLink: filevideoUrl,
    //                 videoAdminUID: userid,
    //             }).then(docRef => {
    //                 setVid(docRef.id)
    //             })
    //         }
    //         if(idThing !== ''){
    //             firestore.collection('videos').doc(idThing).set({
    //                 sourceLink: filevideoUrl,
    //             }, { merge: true })
    //         }
    //     }
    // } 

    //SOME THING FOR HANDLE THUMBNAIL ------------

    useEffect(() => {
        const promises = [];
        if(images == '') return
        const number = Math.random();
        images.map((image) => {
            const name = images[0].name
            const uploadTask = storage.ref(`thumbnails/${userid}_thumbnails/${name}_${number}/${image.name}`).put(image);
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
                .ref(`thumbnails/${userid}_thumbnails/${name}_${number}`)
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

    console.log(fileImageUrl)

    const handleChangeFileImage = (e) => {
        for (let i = 0; i < e.target.files.length; i++) {
            const newImage = e.target.files[i];
            newImage["id"] = Math.random();
            setImages((prevState) => [newImage])
        }
    }

    const handleDeleteThumbnail = (e) => {
        var desertRef = storage.refFromURL(fileImageUrl);

        deleteObject(desertRef).then(() => {
            setFileImageUrl('')
            alert('success')
        }).catch((error) => {
            console.log(error)
        });
  
    }

    useEffect(() => {
        if(fileImageUrl == '') {
            setProgressThumbnail(0)
        }
    }, [fileImageUrl])

    //HANDLE RESET FORM------------------

    const resetForm = () => {
        setTitle('')
        setDesc('')
        setCategory('animation')
        setTempTag('')
        setTags([])
        setPrivacy('private')
        setImages([])
        setFileVideos([])
        setProgress(0)
        setVid('')
        setFilevideoUrl('')
        setFileImageUrl('')
    }

    const handleChangeCategory = (event) => {
        setCategory(event.target.value);
    };

    const handleChangePrivacy = (event) => {
        setPrivacy(event.target.value);
    }

    const handleUploadTags = (event) => {
        tags.map((tag) => {
            firestore.collection('tags').doc().set({
                tag: tag,
                vid: vId
            })
        })
    }

    const onKeyDownHandler = e => {
        if (e.keyCode === 13) {
            setTags([...tags, tempTag])
            setTempTag('')
        }
    };

    const handleDeleteTag = (tagName) => {
        var someArray = tags
        someArray = someArray.filter(tagThing => tagThing !== tagName)
        setTags(someArray)
    }

    const handleChangeFileVideo = (e) => {
        for (let i = 0; i < e.target.files.length; i++) {
        const newVideo = e.target.files[i];
        var pattern = /video-*/;
        if (!newVideo.type.match(pattern)) {
            alert('Invalid format');
            e.target.value = null;
            return;
        }
        newVideo["id"] = Math.random();
        setFileVideos((prevState) => [...prevState, newVideo])
        }
    }

    //THIS THING FOR UPLOAD VIDEO ------------
    const handleUpload = (e) => {
        const promises = [];
        if (filevideos == ''){
            alert('Opps... không có video để xử lý')
            return
        }
        else{
            const number = Math.random();
            filevideos.map((video) => {
                const name = filevideos[0].name
                const uploadTask = storage.ref(`videos/${userid}_videos/${name}_${number}/${video.name}`).put(video);
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
                    .ref(`videos/${userid}_videos/${name}_${number}`)
                    .child(video.name)
                    .getDownloadURL()
                    .then((urls) => {
                        var sourceVideo = urls
                        setFilevideoUrl(sourceVideo)
                    });
                }
                );
            });
            
            Promise.all(promises)
                .then(() => 

            console.log(filevideoUrl),
            setProgress(0)
            

            ).catch((err) => console.log(err));
        }
    }

    console.log(filevideoUrl)
    console.log(vId)

    //THIS THING FOR UPLOAD ALL OF INFORMATION ------------
    const handleSubmit = (e) => {
        e.preventDefault();
        var sourceLink = filevideoUrl
        var thumbnail = fileImageUrl
        var titleForSearch = title.toLowerCase()
        if(vId == ''){
            alert("Không có video nào để xử lý")
            return
        }
        if(title == ''){
            alert("Tựa video của bạn???")
            return
        }
        dispatch(
            addVideoStart({
                category,
                title,
                desc,
                privacy,
                views,
                sourceLink,
                tags,
                // likes,
                vId,
                thumbnail,
                tier,
                titleForSearch,
            })
        )
        
        const userRef = doc(firestore, "videos/" + vId);
        updateDoc(userRef, {
            "vId": deleteField()
        });

        // handleUploadTags()
        alert('Video của bạn đã hoàn tất')
        resetForm()
    }

    return (
        <div className='uploadVideo'>
            <ImageOnScreen />
            <AdCard 
                image={Image}
                link="https://panel.xn--9kqw7o.com/auth/register?code=iwara"
            />
            <div>
                <div className='uploadVideo_container'>
                    <FormInput 
                        label="Tên"
                        type="Text"
                        placeholder="Tên Video"
                        value={title}
                        handleChange={e => setTitle(e.target.value)}
                    />
                </div>

                <div className='uploadVideo_container'>
                    <FormTextArea 
                        label="Mô tả"
                        type="Text"
                        placeholder="Mô tả"
                        value={desc}
                        handleChange={e => setDesc(e.target.value)}
                    />
                </div>

                <div className='uploadVideo_container uploadVideo_videoInput'>
                    {progress > 0 ? 
                        <progress value={progress} max="100" /> : <>
                        <FormInput 
                            label="Video"
                            type="file"
                            accept="video/*"
                            handleChange={handleChangeFileVideo}
                        />
                        <Button onClick={handleUpload}>
                            Đăng
                        </Button>
                        </>
                    }    
                    <div>
                    <ReactPlayer 
                        className="react-player"
                        url={filevideoUrl} 
                        controls = {true}
                        width="20%"
                        height="20%"
                    />
                    </div>
                </div>

                <div className='uploadVideo_container'>
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
                                <span onClick={handleDeleteThumbnail}>x</span>
                            </div>
                        </>
                    } 
                            
                </div>

                <div className='uploadVideo_container'>
                    <FormControl className='uploadVideo_radioBoxContainer' component="fieldset">
                        <label>Thể loại</label>
                        <RadioGroup className='uploadVideo_radioBox' aria-label="gender" name="gender1" value={category} onChange={handleChangeCategory}>
                            <FormControlLabel value="animation" control={<Radio />} label="Animation" />
                            <FormControlLabel value="music" control={<Radio />} label="Nhạc" />
                            <FormControlLabel value="other" control={<Radio />} label="Khác" />
                        </RadioGroup>
                    </FormControl>
                </div>

                <div className='uploadVideo_container'>
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

                <div className='uploadVideo_container'>
                    <FormControl className='uploadVideo_radioBoxContainer' component="fieldset">
                        <label></label>
                        <RadioGroup className='uploadVideo_radioBox' aria-label="gender" name="gender1" value={privacy} onChange={handleChangePrivacy}>
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

export default UploadVideo
