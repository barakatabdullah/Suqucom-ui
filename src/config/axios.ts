import axios from 'axios'

const api = axios.create({
  baseURL: '/api',

  // Request timeout
  timeout: 60000,

  // Request headers
  headers: {
    'Content-Type': 'application/json'
  }
})

export default api