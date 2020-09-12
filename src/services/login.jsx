import axios from 'axios'
const baseUrl = '/login'

const login = async credential => {
    const response = await axios.post(baseUrl, credential)
    return response.data
}

export default { login }