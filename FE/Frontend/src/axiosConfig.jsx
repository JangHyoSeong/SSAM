import axios from 'axios'

const axiosConfig = axios.create({
    withCredentials: true,
    baseURL: 'http://localhost:8081/',
  })

export default axiosConfig
