import axios from 'axios'
import {AuthResponse} from "../models/response/AuthResponse";

// для прода использовать url ниже
export const API_URL = 'https://tests-bzrd.vercel.app/api'
// для дэв использовать url ниже
// export const API_URL = 'http://localhost:6007/api'

// для прода использовать url ниже
export const CLIENT_URL='https://tests-sandy.vercel.app'
// для дэв использовать url ниже
// export const CLIENT_URL='http://localhost:3000'

const $api = axios.create({
    baseURL: API_URL
})


$api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return config;
})

$api.interceptors.response.use((config) => {
    return config;
}, async (error) => {
    const originalRequest = error.config;
    if(error.response.status === 401 && error.config && !error.config._isRetry){
        originalRequest._isRetry = true;
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true})
            localStorage.setItem('token', response.data.accessToken)
            return $api.request(originalRequest);
        } catch (e){
        }
        throw error;
    }
})

export default $api;
