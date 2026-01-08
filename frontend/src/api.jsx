import axios from "axios"

const API_URL = "http://127.0.0.1:8000/"

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
})

export const signup = async (username, password) => {
    const res = await api.post("auth/register/", { username, password })
    return res.data
}
export const login = async (username, password) => {
    const res = await api.post("auth/login/", { username, password })
    return res.data
}
export const logout = async () => {
    const res = await api.post("auth/logout/")
    return res.data
}
export const checkAuth = async () => {
    const res = await api.get("auth/status/")
    console.log(res)
    return res.data
}
