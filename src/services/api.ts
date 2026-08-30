import axios from 'axios'

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export function prefixUrl(url: string | undefined | null): string | undefined {
  if (!url) return undefined
  if (url.startsWith('http')) return url
  return BASE_URL + url
}

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@doemais:token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error)
  }
)

export default api
