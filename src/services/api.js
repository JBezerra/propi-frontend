import axios from 'axios'

const api = axios.create({
    // baseURL: 'http://localhost:5000'
    baseURL: 'https://942e4554e273.ngrok.io'
})

export default api;