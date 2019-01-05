import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.baseURL,
  withCredentials: false, // This is the default
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
  timeout: 10000 // throw if API call takes more then 10 sec
})

apiClient.interceptors.request.use(config => {
  if (process.client && window.$nuxt) {
    const token = window.$nuxt.$store.getters.token

    if (token != null) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  return config
})

export default apiClient
