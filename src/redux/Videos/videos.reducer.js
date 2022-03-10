import videosTypes from "./videos.types";

const INITIAL_STATE = {
    videos: [],
    videosFollow: [],
    video: {},
}

const videosReducer = (state=INITIAL_STATE, action) => {
    switch(action.type) {
        case videosTypes.SET_VIDEOS:
            return {
                ...state,
                videos: action.payload
            }
        case videosTypes.SET_FOLLOWINGVIDEOS:
            return {
                ...state,
                videosFollow: action.payload
            }
        case videosTypes.SET_VIDEO:
            return {
                ...state,
                video: action.payload
            }
        default:
            return state;
    }
}

export default videosReducer