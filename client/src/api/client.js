import axios from 'axios'

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 8000,
})

export async function login(credentials) {
  const { data } = await api.post('/api/auth/login', credentials)
  return data 
}

export async function register(details) {
  const { data } = await api.post('/api/auth/register', details)
  return data 
}

export async function me(token) {
  const { data } = await api.get('/api/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  })
  return data 
}