import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const ProtectedRoute = ({redirectPath="/login", children}) =>{
    const {isLogedIn} = useSelector(state => state.authenticate);
    if(!isLogedIn) return <Navigate to={redirectPath} replace />
    return children;
}