import axios from 'axios'
const baseUrl = '/room'

let token = null;

const setToken = newToken => {
    token = `bearer ${newToken}`
}

const getRooms = () => {
    const config = { headers: { Authorization: token } }

    const request = axios.get(baseUrl, config)
    return request.then(response => response.data)
}

const createRoom = async newRoom => {
    const config = { headers: { Authorization: token } }

    const response = await axios.post(baseUrl, newRoom, config)
    return response.data
}

const leaveRoom = async id => {
    const config = { headers: { Authorization: token } }

    await axios.patch(`${baseUrl}/leave/${id}`, null, config)
}

const deleteRoom = async id => {
    const config = { headers: { Authorization: token } }

    await axios.delete(`${baseUrl}/${id}`, config)
}

const joinRoom = async (id, password) => {
    const config = { headers: { Authorization: token } }

    await axios.patch(`${baseUrl}/join/${id}`, { password }, config)
}

const enterRoom = async id => {
    const config = { headers: { Authorization: token } }

    const response = await axios.get(`${baseUrl}/${id}`, config)
    return response.data
}

const sendMessage = async (id, newMessage) => {
    const config = { headers: { Authorization: token } }
    const response = await axios.post(`${baseUrl}/${id}/message`, newMessage, config)
    return response.data
}

const getRoom = enterRoom

export default { setToken, getRooms, createRoom, leaveRoom, joinRoom, deleteRoom, enterRoom, getRoom, sendMessage }