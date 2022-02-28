import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

const mapState = ({ user }) => ({
    currentUser: user.currentUser
})

const useAuth = props => {
    const { currentUser } = useSelector(mapState)
    const history = useHistory()

    useEffect(() => {
        if(!currentUser) {
            history.push('/login')
        }
    }, [currentUser]) //use to render the page when login

    return currentUser
}

export default useAuth