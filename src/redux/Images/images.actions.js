import imagesTypes from "./images.types";

export const addImageStart = imageData => ({
    type: imagesTypes.ADD_NEW_IMAGE_START,
    payload: imageData
})

export const fetchImagesStart = (filters={}) => ({
    type: imagesTypes.FETCH_IMAGES_START,
    payload: filters
})

export const setImages = images => ({
    type: imagesTypes.SET_IMAGES,
    payload: images
})

export const deleteImageStart = imageID => ({
    type: imagesTypes.DELETE_IMAGE_START,
    payload: imageID
})

export const fetchImageStart = imageID => ({
    type: imagesTypes.FETCH_IMAGE_START,
    payload: imageID
})

export const setImage = image => ({
    type: imagesTypes.SET_IMAGE,
    payload: image
})