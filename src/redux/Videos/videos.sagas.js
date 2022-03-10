import { auth } from "../../firebase/utils"
import { takeLatest, put, all, call } from "redux-saga/effects"
import { setVideos, setFollowingVideos, setVideo, fetchVideosStart } from "./videos.actions"
import { handleAddVideo, handleFetchVideos, handleFetchFollowingVideos, handleFetchVideo, handleDeleteVideo } from "./videos.helpers"
import videosTypes from "./videos.types"

export function* addVideo({ payload }) {
    try {
        const timestamp = new Date();
        yield handleAddVideo({
            ...payload,
            videoAdminUID: auth.currentUser.uid, //get uid of login user  
            createdDate: timestamp
        })
        yield put(
            fetchVideosStart()
        );
    } catch (err) {
        // console.log(err)
    }
}

export function* onAddVideoStart() {
    yield takeLatest(videosTypes.ADD_NEW_VIDEO_START, addVideo)
}

export function* fetchVideos({ payload }) {
    try {
        const videos = yield handleFetchVideos(payload); //get product from handle Fetch
        yield put ( //change it into state or change state with it
            setVideos(videos)
        )
    } catch (err) {
        // console.log(err)
    }
}

export function* onFetchVideosStart() {
    yield takeLatest(videosTypes.FETCH_VIDEOS_START, fetchVideos)
}

export function* fetchFollowingVideos({ payload }) {
    try {
        const videosFollow = yield handleFetchFollowingVideos(payload); //get product from handle Fetch
        yield put ( //change it into state or change state with it
            setFollowingVideos(videosFollow)
        )
    } catch (err) {
        // console.log(err)
    }
}

export function* onFetchFollowingVideosStart() {
    yield takeLatest(videosTypes.FETCH_FOLLOWINGVIDEOS_START, fetchFollowingVideos)
}

export function* deleteVideo({ payload }){
    try {
        yield handleDeleteVideo(payload)
        yield put (
            fetchVideosStart()
        );
    } catch (err) {
        // console.log(err)
    }
}

export function* onDeleteVideoStart() {
    yield takeLatest(videosTypes.DELETE_VIDEO_START, deleteVideo)
}

export function* fetchVideo({ payload }) {
    try {
        const video = yield handleFetchVideo(payload)
        yield put(
            setVideo(video)
        )
    } catch (err) {
        // console.log(err)
    }
}

export function* onFetchVideoStart() {
    yield takeLatest(videosTypes.FETCH_VIDEO_START, fetchVideo)
}

export default function* videosSagas() {
    yield all([
        call(onAddVideoStart),
        call(onFetchVideosStart),
        call(onFetchFollowingVideosStart),
        call(onDeleteVideoStart),
        call(onFetchVideoStart),
    ])
}