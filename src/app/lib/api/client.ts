import axios from 'axios'

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: false,
})

export const externalServiceClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_SIGERH,
  withCredentials: false,
})