import axios from 'axios'
const baseUrl = '/signup'

const signup = async credential => {
    const response = await axios.post(baseUrl, credential)
    return response.data
}

export default { signup }