import axios from 'axios'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Attach access token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// If access token expired, auto refresh and retry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) throw new Error('No refresh token')

        const res = await axios.post('http://localhost:5000/auth/refresh', {
          refreshToken
        })

        const newAccessToken = res.data.accessToken
        localStorage.setItem('accessToken', newAccessToken)

        original.headers.Authorization = `Bearer ${newAccessToken}`
        return api(original)
      } catch (err) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default api