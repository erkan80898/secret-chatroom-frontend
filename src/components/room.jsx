import React from 'react'
import moment from 'moment';
import TextareaAutosize from 'react-textarea-autosize'


const Room = ({
    handleMessageChange,
    exitRoom,
    sendMessage,
    messageContent,
    room,
}) => {
    return (
        <div>
            <div>
                <h2 className='roomHeader'>Welcome to {room.roomName}</h2>
                <button className='exitRoomButton' onClick={exitRoom}>Exit Room</button>
                <ol className='messages'>
                    {room.messages.map(message => (
                        <li className='message' key={message.id}>
                            <b className='messageUser'>{message.user}</b>
                            <small> - {moment(message.date).fromNow()}</small>
                            <ol>
                                <li>{message.content}</li>
                            </ol>
                        </li>
                    ))}
                </ol>
            </div>
            <div>
                <form id='messageForm' className='form-inline' onSubmit={sendMessage}>
                    <TextareaAutosize
                        className='messageField' spellCheck='true'
                        value={messageContent} form='messageForm'
                        onChange={handleMessageChange} />
                    <button id='sendMessageButton' type="submit">Send</button>
                </form>
            </div>
        </div>
    )
}

export default Room