import React, { useState, useEffect } from 'react'
import Form from './components/main'
import Lobby from './components/lobby'
import loginService from './services/login'
import signupService from './services/signup'
import lobbyService from './services/lobby'
import Notification from './components/notification'
import Room from './components/room'


function App() {
  const [userNameField, setUserNameField] = useState('')
  const [passField, setPassField] = useState('')
  const [user, setUser] = useState(null)
  const [rooms, setRooms] = useState([])
  const [status, setStatus] = useState(true)
  const [createRoomName, setCreateRoomName] = useState('')
  const [createRoomPass, setCreateRoomPass] = useState('')
  const [joinRoomName, setJoinRoomName] = useState('')
  const [joinRoomPass, setJoinRoomPass] = useState('')
  const [currentRoom, setCurrentRoom] = useState(null)
  const [messageToSend, setMessageToSend] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  const token = window.localStorage.getItem('loggedInUser')

  useEffect(() => {
    const loggedUserJSON = token
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      lobbyService.setToken(user.token)
    }
  }, [token])

  useEffect(() => {
    lobbyService
      .getRooms()
      .then(rooms => {
        setRooms(rooms)
      }).catch(_ => console.log('waiting for user login'))
  }, [rooms.length, token])

  useEffect(() => {

    const interval = setInterval(() => {
      if (currentRoom !== null) {
        lobbyService
          .getRoom(currentRoom.id)
          .then(room => {
            setCurrentRoom(room)
          }).catch(_ => console.log('waiting for user to enter a room'))
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentRoom])


  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username: userNameField,
        password: passField
      })

      window.localStorage.setItem(
        'loggedInUser', JSON.stringify(user)
      )

      lobbyService.setToken(user.token)
      setUser(user)
      setUserNameField('')
      setPassField('')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleSignup = async (event) => {
    event.preventDefault()

    try {

      const err = new Error()
      err.response = {
        data: {
          error: "password too short: at least 6 characters required"
        }
      }

      if (passField.trim().length < 6) throw err

      await signupService.signup({
        username: userNameField.trim(),
        password: passField.trim()
      })

      setUserNameField('')
      setPassField('')
      setStatus(!status)
    } catch (error) {
      if (error.response.data.error.includes('User validation failed')) {
        setErrorMessage("username either too short or already taken")
      } else {
        setErrorMessage(error.response.data.error)
      }
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleCreateRoom = async (event) => {

    event.preventDefault()

    try {

      const err = new Error()
      err.response = {
        data: {
          error: "room password too short: at least 6 characters required"
        }
      }

      if (createRoomPass.trim().length < 6) throw err
      const newRoom = await lobbyService.createRoom({
        roomName: createRoomName.trim(),
        roomPass: createRoomPass.trim()
      })

      setRooms(rooms.concat(newRoom))
      setCreateRoomName('')
      setCreateRoomPass('')
    } catch (error) {
      setErrorMessage(error.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLeaveRoom = async (event) => {

    try {
      const id = event.target.value
      await lobbyService.leaveRoom(id)

      setRooms(rooms.filter((room) => room.id === id))
    } catch (error) {
      setErrorMessage(error.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleDeleteRoom = async (event) => {

    try {
      const id = event.target.value
      await lobbyService.deleteRoom(id)

      setRooms(rooms.filter((room) => room.id === id))
    } catch (error) {
      setErrorMessage(error.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleJoinRoom = async (event) => {
    event.preventDefault()

    try {
      await lobbyService.joinRoom(joinRoomName, joinRoomPass)
      setRooms(rooms.concat(joinRoomName))
      setJoinRoomName('')
      setJoinRoomPass('')
    } catch (error) {
      setErrorMessage(error.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleEnterRoom = async (event) => {

    try {
      const room = await lobbyService.enterRoom(event.target.value)
      setCurrentRoom(room)
      window.scrollTo(0, document.body.scrollHeight)
    } catch (error) {
      setErrorMessage(error.response)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleSendMessage = async (event) => {
    try {
      event.preventDefault()

      const response = await lobbyService.sendMessage(currentRoom.id, { content: messageToSend })
      setCurrentRoom(response)
      setMessageToSend('')
    } catch (error) {
      setErrorMessage(error.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const changeStatus = () => {
    setStatus(!status)
    setUserNameField('')
    setPassField('')
  }

  const handleFormSubmit = (status) => status ? handleLogin : handleSignup

  const form = () => {
    return (
      <div>
        {status === true ? <p className='status'>Logging in</p> : <p className='status'> Signing up</p>}
        <Form
          handleSubmit={handleFormSubmit(status)}
          handleUsernameChange={(event) => setUserNameField(event.target.value)}
          handlePasswordChange={(event) => setPassField(event.target.value)}
          status={status}
          username={userNameField}
          password={passField} />
        {status === true ?
          <button className='buttonLogin' onClick={changeStatus}>
            Need to signup instead?
          </button>
          :
          <button className='buttonLogin' onClick={changeStatus}>
            Already have an account?
        </button>}
      </ div>)
  }

  const lobby = () => {
    return (
      <Lobby
        handleCreateNameChange={(event) => setCreateRoomName(event.target.value)}
        handleCreatePassChange={(event) => setCreateRoomPass(event.target.value)}
        handleJoinNameChange={(event) => setJoinRoomName(event.target.value)}
        handleJoinPassChange={(event) => setJoinRoomPass(event.target.value)}
        createName={createRoomName}
        createPass={createRoomPass}
        joinName={joinRoomName}
        joinPass={joinRoomPass}
        handleCreate={handleCreateRoom}
        handleDelete={handleDeleteRoom}
        handleLeave={handleLeaveRoom}
        handleJoin={handleJoinRoom}
        handleEnter={handleEnterRoom}
        handleLogout={(event) => {
          window.localStorage.removeItem('loggedInUser')
          lobbyService.setToken(null)
          setCurrentRoom(null)
          setUser(null)
        }}
        user={user}
        rooms={rooms} />
    )
  }

  const room = () => {
    return (
      <Room
        room={currentRoom}
        exitRoom={() => setCurrentRoom(null)}
        messageContent={messageToSend}
        sendMessage={handleSendMessage}
        handleMessageChange={(event) => {
          setMessageToSend(event.target.value)
          window.scrollTo(0, document.body.scrollHeight)
        }}
      />
    )
  }

  return (
    <div>
      <h1 className='header'>Secret Chat</h1>
      <Notification message={errorMessage} />
      {currentRoom === null ? user === null ?
        form() :
        lobby()
        :
        room()
      }
    </ div >
  )
}

export default App;
