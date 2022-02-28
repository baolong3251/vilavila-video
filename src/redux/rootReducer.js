import { combineReducers } from 'redux'

import userReducer from './User/user.reducer'
import videosReducer from './Videos/videos.reducer'
import imagesReducer from './Images/images.reducer'

export default combineReducers({
    user: userReducer,
    videosData: videosReducer,
    imagesData: imagesReducer,
})