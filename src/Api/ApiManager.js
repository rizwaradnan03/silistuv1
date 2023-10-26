import axios from 'axios'

export const ApiManager = axios.create({
    baseURL: 'https://x8cgfzvm-4321.asse.devtunnels.ms',
    responseType: 'json',
    withCredentials: true
})