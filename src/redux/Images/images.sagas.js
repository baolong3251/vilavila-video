import { auth } from "../../firebase/utils"
import { takeLatest, put, all, call } from "redux-saga/effects"
import { setImages, setImage, fetchImagesStart } from "./images.actions"
import { handleAddImage, handleFetchImages, handleFetchImage, handleDeleteImage } from "./images.helpers"
import imagesTypes from "./images.types"

export function* addImage({ payload }) {
    try {
        const timestamp = new Date();
        yield handleAddImage({
            ...payload,
            imageAdminUID: auth.currentUser.uid, //get uid of login user  
            createdDate: timestamp
        })
        yield put(
            fetchImagesStart()
        );
    } catch (err) {
        // console.log(err)
    }
}

export function* onAddImageStart() {
    yield takeLatest(imagesTypes.ADD_NEW_IMAGE_START, addImage)
}

export function* fetchImages({ payload }) {
    try {
        const images = yield handleFetchImages(payload); //get product from handle Fetch
        yield put ( //change it into state or change state with it
            setImages(images)
        )
    } catch (err) {
        // console.log(err)
    }
}

export function* onFetchImagesStart() {
    yield takeLatest(imagesTypes.FETCH_IMAGES_START, fetchImages)
}

export function* deleteImage({ payload }){
    try {
        yield handleDeleteImage(payload)
        yield put (
            fetchImagesStart()
        );
    } catch (err) {
        // console.log(err)
    }
}

export function* onDeleteImageStart() {
    yield takeLatest(imagesTypes.DELETE_IMAGE_START, deleteImage)
}

export function* fetchImage({ payload }) {
    try {
        const image = yield handleFetchImage(payload)
        yield put(
            setImage(image)
        )
    } catch (err) {
        // console.log(err)
    }
}

export function* onFetchImageStart() {
    yield takeLatest(imagesTypes.FETCH_IMAGE_START, fetchImage)
}

export default function* imagesSagas() {
    yield all([
        call(onAddImageStart),
        call(onFetchImagesStart),
        call(onDeleteImageStart),
        call(onFetchImageStart),
    ])
}