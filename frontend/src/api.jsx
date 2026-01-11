import axios from "axios"

const API_URL = "/api/"

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
    const res = await api.get("auth/logout/")
    return res.data
}

export const checkAuth = async () => {
    const res = await api.get("auth/status/")
    return res.data
}

export const getQuiz = async (category) => {
    const res = await api.get(`items/quiz/${category}`)
    return res.data
}
