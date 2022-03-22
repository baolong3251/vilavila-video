import { auth } from "../../firebase/utils";

export const handleResetPasswordAPI = (email) => {
    // const config = {
    //     url: 'http://ecommerce-firebase-aac47/login'
    // }
    
    return new Promise((resolve, reject) => {
        auth.sendPasswordResetEmail(email)
            .then(() => {
                resolve()
            })
            .catch(() => {
                const err = ['Email không khả dụng, xin vui lòng thử lại.'];
                reject(err)
            })

    })
}