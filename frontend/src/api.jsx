import axios from "axios"

const API_URL = "/api/"

function getCookie(name) {
    let cookieValue = null
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';')
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
                break
            }
        }
    }
    return cookieValue
}

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
})

api.interceptors.request.use(config => {
    const csrfToken = getCookie('csrftoken')
    if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken
    }
    return config
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

export const rateItem = async (id, score) => {
    const res = await api.post('items/rate/', { id, score })
    return res.data
}

export const getStats = async (category) => {
    const res = await api.get(`stats/${category}/`)
    return res.data
}

export const createStatsShare = async (category) => {
    const res = await api.post(`stats/share/${category}/`)
    return res.data
}

export const getStatsShare = async (share_id) => {
    const res = await api.get(`stats/share/get/${share_id}/`)
    console.log(res.data)
    return res.data
}
