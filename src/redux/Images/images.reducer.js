import imagesTypes from "./images.types";

const INITIAL_STATE = {
    images: [],
    image: {},
}

const imagesReducer = (state=INITIAL_STATE, action) => {
    switch(action.type) {
        case imagesTypes.SET_IMAGES:
            return {
                ...state,
                images: action.payload
            }
        case imagesTypes.SET_IMAGE:
            return {
                ...state,
                image: action.payload
            }
        default:
            return state;
    }
}

export default imagesReducer