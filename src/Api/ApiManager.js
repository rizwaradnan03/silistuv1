import axios from 'axios'

export const ApiManager = axios.create({
    baseURL: 'https://k5p7kfgf-4321.asse.devtunnels.ms',
    responseType: 'json',
    withCredentials: true
})