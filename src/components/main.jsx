import React from 'react'

const Form = ({
    handleSubmit,
    handleUsernameChange,
    handlePasswordChange,
    username,
    password,
    status,
}) => {
    return (
        <div className='fieldInfo'>
            <form onSubmit={handleSubmit}>
                <div className='fieldInfo'>
                    Username
                </div>
                <input
                    id='username'
                    value={username}
                    onChange={handleUsernameChange}
                />
                <div className='fieldInfo'>
                    Password
                </div>
                <input
                    id='password'
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                />
                <br></br>
                <button className='buttonLogin' type='submit' id='login-button'>{status ? 'Log In' : 'Sign Up'}</button>
            </form>
        </div >
    )
}

export default Form