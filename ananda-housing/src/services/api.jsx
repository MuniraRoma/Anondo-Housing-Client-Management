
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://anondo-housing-backend12.onrender.com/api',
})

export default api
