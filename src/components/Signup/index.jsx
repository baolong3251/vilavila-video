import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { signUpUserStart } from "../../redux/User/user.action";
import "./style_signup.scss"

import AuthWrapper from '../AuthWrapper';
import FormInput from "../Forms/FormInput";
import Button from "../Forms/Button";

const mapState = ({ user }) => ({
    currentUser: user.currentUser,
    userErr: user.userErr
})

const Signup = props => {
    const history = useHistory();
    const { currentUser, userErr } = useSelector(mapState)
    const dispatch = useDispatch()
    const [displayName, setDisplayName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errors, setErrors] = useState([])

    useEffect(() => {
        if (currentUser){
            reset();
            history.push("/");
        }
    }, [currentUser])

    useEffect(() => {
        if (Array.isArray(userErr) && userErr.length>0){
            setErrors(userErr);
        }
    }, [userErr])

    const reset = () => {
        setDisplayName('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        setErrors([])
    }

    const handleFormSubmit = event => {
        event.preventDefault();
        dispatch(signUpUserStart({
            displayName,
            email,
            password,
            confirmPassword
        }))
        
    }


    const configAuthWrapper = {
        headline: 'Đăng ký'
    }
    return (
        <AuthWrapper {...configAuthWrapper}>

            <div className="formWrap_Signup">

                {errors.length > 0 && (
                    <ul>
                        {errors.map((err, index) => {
                            return (
                                <li key={index}>
                                    {err}
                                </li>
                            )
                        })}
                    </ul>
                )}

                <form onSubmit={handleFormSubmit}>
                    <FormInput
                        type="text"
                        name="displayName"
                        value={displayName}
                        placeholder="Tên tài khoản"
                        handleChange={e => setDisplayName(e.target.value)}
                    />

                    <FormInput
                        type="email"
                        name="email"
                        value={email}
                        placeholder="Email"
                        handleChange={e => setEmail(e.target.value)}
                    />

                    <FormInput
                        type="password"
                        name="password"
                        value={password}
                        placeholder="Mật khẩu"
                        handleChange={e => setPassword(e.target.value)}
                    />

                    <FormInput
                        type="password"
                        name="confirmPassword"
                        value={confirmPassword}
                        placeholder="Xác nhận mật khẩu"
                        handleChange={e => setConfirmPassword(e.target.value)}
                    />

                    <Button type="submit">
                        Đăng ký
                    </Button>
                </form>
            </div>
        </AuthWrapper>
    )
}


export default Signup;