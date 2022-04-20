import { takeLatest, call, all, put } from "redux-saga/effects"
import { auth, handleUserProfile, getCurrentUser, GoogleProvider } from "../../firebase/utils"
import userTypes from "./user.type";
import { signInSuccess, signOutUserSucces, resetPasswordSuccess, userError } from "./user.action";
import { handleResetPasswordAPI } from "./user.helper";

export function* getSnapshotFromUserAuth(user, additionalData={}) {
    try {

        const userRef = yield call(handleUserProfile, { userAuth: user, additionalData }); //this thing is for backend process
        const snapshot = yield userRef.get()
        yield put(
            //this is for changing page layout
            signInSuccess({
                id: snapshot.id,
                ...snapshot.data() //get data from firebase})
            })
        );
        


        //if user not login

    } catch (err) {
        // console.log(err)
    }
}

export function* emailSignIn({ payload: { email, password } }) {

    if (email === '' || password === ''){
        const userErr4 = ['Không được để trống khung thông tin'];
        yield put(
            userError(userErr4)
        )
        return
    }

    try {
        const { user } = yield auth.signInWithEmailAndPassword(email, password)
        yield getSnapshotFromUserAuth(user)
        

        // dispatch({ //function
        //     type: userTypes.SIGN_IN_SUCCESS,
        //     payload: true
        // }) //but function + function is not work so we use redux-thunk to make it work, it come from createStore

    } catch (err) {
        //console.log(err)
        const userErr3 = ['Email không tồn tại hoặc mật khẩu không đúng...'];
        yield put(
            userError(userErr3)
        )
        return
    }
}

export function* onEmailSignInStart() {
    yield takeLatest(userTypes.EMAIL_SIGN_IN_START, emailSignIn)
}

//this is for check user login or not
export function* isUserAuthenticated() {
    try {
        const userAuth = yield getCurrentUser();
        if (!userAuth) return
        yield getSnapshotFromUserAuth(userAuth)

    } catch (err) {
        // console.log(err)
    }
}

export function* onCheckUserSession() {
    yield takeLatest(userTypes.CHECK_USER_SESSION, isUserAuthenticated)
}

export function* signOutUser() {
    try {
        yield auth.signOut()
        yield put(
            signOutUserSucces()
        )
    } catch (err) {
        // console.log(err)
    }
}

export function* onSignOutUserStart() {
    yield takeLatest(userTypes.SIGN_OUT_USER_START, signOutUser)
}

export function* signUpUser( { payload: {
    displayName,
    email,
    password,
    confirmPassword
} }) { //this is generation function

    if (password !== confirmPassword) {
        const err = ['Mật khẩu không khớp'];
        yield put(
            userError(err)
        )
        return
    }

    if (displayName === '' || email === ''){
        const userErr = ['Không được để trống khung thông tin'];
        yield put(
            userError(userErr)
        )
        return
    }

    if (password.length < 6 ){
        const userErr2 = ['Mật khẩu khẩu phải trên 6 ký tự'];
        yield put(
            userError(userErr2)
        )
        return
    }

    try {

        const { user } = yield auth.createUserWithEmailAndPassword(email, password)
        const additionalData = { displayName }
        yield getSnapshotFromUserAuth(user, additionalData)
        // yield call(handleUserProfile, { userAuth: user, additionalData: { displayName } })

    } catch (err) {
        // console.log(err)
        const errtwo = ['Email này đã được đăng ký trước đó rồi...'];
        yield put(
            userError(errtwo)
        )
        return
    }
}

export function* onSignUpUserStart() {// when ever dispatch this thing call it will call signUpUser tp handle it
    yield takeLatest(userTypes.SIGN_UP_USER_START, signUpUser)
}

export function* resetPassword({ payload: { email }}) {
    try {
        yield call(handleResetPasswordAPI, email)
        yield put(
            resetPasswordSuccess()
        )
    } catch (err) {
        yield put(
            userError(err)
        )
    }
}

export function* onResetPasswordStart() {
    yield takeLatest(userTypes.RESET_PASSWORD_START, resetPassword)
}

export function* googleSignIn() {
    try{
        const { user } = yield auth.signInWithPopup(GoogleProvider)
        yield getSnapshotFromUserAuth(user)

    } catch (err) {
        // console.log(err)
    }
}

export function* onGoogleSignInStart() {
    yield takeLatest(userTypes.GOOGLE_SIGN_IN_START, googleSignIn)
}

export default function* userSagas() {
    yield all([
        call(onEmailSignInStart), 
        call(onCheckUserSession), 
        call(onSignOutUserStart),
        call(onSignUpUserStart),
        call(onResetPasswordStart),
        call(onGoogleSignInStart),
    ])
}