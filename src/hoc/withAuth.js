import { useAuth } from "../customHooks";

const WithAuth = props => useAuth(props) && props.children; //passing props to the custom hooks useAuth.js

export default WithAuth //access to history