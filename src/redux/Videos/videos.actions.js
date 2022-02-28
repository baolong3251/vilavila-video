import videosTypes from "./videos.types";

export const addVideoStart = videoData => ({
    type: videosTypes.ADD_NEW_VIDEO_START,
    payload: videoData
})

export const fetchVideosStart = (filters={}) => ({
    type: videosTypes.FETCH_VIDEOS_START,
    payload: filters
})

export const setVideos = videos => ({
    type: videosTypes.SET_VIDEOS,
    payload: videos
})

export const deleteVideoStart = videoID => ({
    type: videosTypes.DELETE_VIDEO_START,
    payload: videoID
})

export const fetchVideoStart = videoID => ({
    type: videosTypes.FETCH_VIDEO_START,
    payload: videoID
})

export const setVideo = video => ({
    type: videosTypes.SET_VIDEO,
    payload: video
})