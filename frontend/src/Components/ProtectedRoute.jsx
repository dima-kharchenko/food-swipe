import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import Loading from "../Pages/Loading"
import { checkAuth } from "../api";

function ProtectedRoute({ children }){
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        (async () => {
            const res = await checkAuth()
            const status = res.logged_in
            console.log(status)
            setIsAuthenticated(status)
            setLoading(false)
        })()
    }, [])
    if(loading) {
        return <Loading />
    }
    return isAuthenticated ? children : <Navigate to="/login" />;
}

export default ProtectedRoute

