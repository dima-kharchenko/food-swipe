import { useEffect, useState, createContext, useContext } from "react"
import { Navigate } from "react-router"
import Loading from "../Pages/Loading"
import { checkAuth } from "../api"


const UserContext = createContext(null)
export const useAuth = () => useContext(UserContext)

function ProtectedRoute({ children }){
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)

    useEffect(() => {
        (async () => {
            const res = await checkAuth()
            setIsAuthenticated(res.logged_in)
            setUser(res)
            setLoading(false)
        })()
    }, [])
    if(loading) {
        return <Loading />
    }
    return isAuthenticated ? <UserContext.Provider value={user}>{children}</UserContext.Provider> : <Navigate to="/login" />;
}

export default ProtectedRoute

