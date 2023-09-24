import axios, { AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
// import queryString from 'query-string'
// import Configs from '@/configs'

const config: AxiosRequestConfig = {
  baseURL: 'http://localhost:3001',
  headers: {
    'content-type': 'application/json'
  },
};

const axiosClient: AxiosInstance = axios.create(config)

axiosClient.interceptors.request.use((config) =>
  // Handle token here ...
  config
)

axiosClient.interceptors.response.use((response) => {
  if (response && response.data) {
    return response.data
  }
  return response
}, (error) => {
  // Handle errors
  throw error
})

export default axiosClient