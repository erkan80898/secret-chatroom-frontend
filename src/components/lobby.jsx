import React from 'react'



const Lobby = ({
    handleCreateNameChange,
    handleCreatePassChange,
    handleJoinNameChange,
    handleJoinPassChange,
    createName,
    createPass,
    joinName,
    joinPass,
    handleCreate,
    handleDelete,
    handleJoin,
    handleLeave,
    handleEnter,
    handleLogout,
    user,
    rooms
}) => {

    const listRooms = (rooms) => (
        <nav>
            <ul>
                {rooms.map(room => (
                    <li className='roomSelection' key={room.id}>
                        <div className='rooms'><em><b>{
                            room.roomName
                        }</b></em><hr></ hr>
                            <button className='roomButtons' value={room.id} onClick={handleEnter}>Enter Room</ button>
                            <button className='roomButtons' value={room.id} onClick={handleLeave}>Leave Room</ button>
                            {room.roomCreator === user.user.username &&
                                <button className='roomButtons' value={room.id} onClick={handleDelete}>Delete Room</ button>
                            }
                            <button className='roomButtons' value={room.id} onClick={(event) => navigator.clipboard.writeText(event.target.value)}>Invite Code</button>
                        </div>
                    </li>
                ))}
            </ul>
        </nav>
    );

    return (
        <div className='lobby'>
            <form className="form-inline" onSubmit={handleCreate}>
                <input id="roomName" placeholder="Enter room name" value={createName} onChange={handleCreateNameChange} />
                <input type="password" id="roomPass" placeholder="Enter room password" value={createPass} onChange={handleCreatePassChange} />
                <button type="submit">Create Room</button>
            </form>
            <form className="form-inline" onSubmit={handleJoin}>
                <input id="joinId" placeholder="Enter room ID" value={joinName} onChange={handleJoinNameChange} />
                <input type="password" id="joinPass" placeholder="Enter room password" value={joinPass} onChange={handleJoinPassChange} />
                <button type="submit">Join Room</button>
            </form>
            <h2>Your Rooms</h2>
            {listRooms(rooms)}
            <button id='logout' className='roomButtons' onClick={handleLogout}>Log Out</button>
        </div >
    )
}

export default Lobby