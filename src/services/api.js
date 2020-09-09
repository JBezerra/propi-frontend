import axios from 'axios'

const api = axios.create({
    // baseURL: 'http://localhost:5000'
    baseURL: 'https://05268b9b08b9.ngrok.io'
})

export default api;