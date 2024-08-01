import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://i11e201.p.ssafy.io/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// You can add interceptors here if you need to add authorization tokens or handle responses globally
axiosInstance.interceptors.request.use(
  (config) => {
    // Add authorization token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;