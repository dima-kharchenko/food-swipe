import { useRef, useState, useEffect } from 'react'
import { logout, updateUser } from '../api'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './ProtectedRoute'

function Header(){
    const user = useAuth()
    const navigate = useNavigate()

    const dropdownRef = useRef(null)
    const buttonRef = useRef(null)
    const usernameRef = useRef(null)
    const passwordRef = useRef(null)

    const [menuToggle, setMenuToggle] = useState(false)
    const [showProfile, setShowProfile] = useState(false)

    const [username, setUsername] = useState(user.username)
    const [usernameSubmitted, setUsernameSubmitted] = useState(true)

    const [password, setPassword] = useState('')
    const [passwordSubmitted, setPasswordSubmitted] = useState(false)

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                !event.target.closest(".dropdown") &&
                !event.target.closest(".dropdown-button")
            ) {
                setMenuToggle(false)
                setShowProfile(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])


    const toggleDropdown = () => {
        setMenuToggle(p => !p)
    }

    const handleLogout = async () => {
        try {
            await logout()
            navigate('/login')
        } catch(e) {
            console.error(e)
        }
    }

    const handleUsernameChange = async (e) => {
        setUsername(e.target.value)
        setUsernameSubmitted(false)
    }

    const handlePasswordChange = async (e) => {
        setPassword(e.target.value)
        setPasswordSubmitted(false)
    }

    const handleUserUpdate = async (e) => {
        e.preventDefault()
        if (usernameSubmitted && passwordSubmitted) return

        const query = {}
        if (!usernameSubmitted && username.length >= 3) query.username = username
        if (!passwordSubmitted && password.length >= 3) query.password = password

        await updateUser(query)

        setUsernameSubmitted(true)
        setPasswordSubmitted(true)
        setPassword('')
    }

    return(
        <>
        <div className="border-b bg-surface-a0 border-primary-a0 fixed top-0 w-full z-50 select-none">
            <div className="px-5 flex flex-wrap items-center justify-between mx-auto h-12"> 
                <a href="https://github.com/dima-kharchenko/food-swipe" target="_blank"><i className="fa-brands fa-github text-3xl text-white"></i></a>
                <div className="flex text-white">
                    <button ref={buttonRef} onClick={toggleDropdown} className="dropdown-button">
                        <i className="fa-solid fa-bars my-auto hover:text-primary-a0 cursor-pointer transition"></i>
                    </button>
                    <div ref={dropdownRef}
                        className={`dropdown grid gap-y-2 mt-11 p-2 right-2 absolute rounded-xl bg-surface-a10 ring-1 ring-primary-a0 transition ${menuToggle ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}>
                        {[
                            {text: "Home", onClick: () => navigate('/')}, 
                            {text: "Profile", onClick: () => setShowProfile(true)}, 
                            {text: "Logout", onClick: () => handleLogout()}
                        ].map((button, index) => (
                        <button 
                            key={index} 
                            className={`w-full px-2 py-1 rounded-lg font-medium cursor-pointer text-surface-a50 hover:text-white bg-surface-a20 hover:bg-surface-a30 ring ring-surface-a30 transition `}
                            onClick={button.onClick}
                        >
                            {button.text} 
                        </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        {showProfile && (
            <div
                className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            >
                <div
                    className="dropdown grid gap-y-2 w-45 bg-surface-a10 border-2 border-primary-a0 px-2 py-2 rounded-xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <form onSubmit={async (e) => {
                        await handleUserUpdate(e)
                        usernameRef.current?.blur()
                    }}>
                        <input
                            ref={usernameRef}
                            type="text"
                            className={`w-full text-center text-surface-a50 font-medium bg-surface-a20 py-2 rounded-lg cursor-pointer ring hover:text-white hover:bg-surface-a30 focus:text-white focus:outline-none text-ellipsis transition ${usernameSubmitted ? 'ring-primary-a0' : 'ring-surface-a30'}`}
                            value={username}
                            onChange={(e) => handleUsernameChange(e)}
                            onBlur={(e) => handleUserUpdate(e)}
                        />
                    </form>
                    <form onSubmit={async (e) => {
                        await handleUserUpdate(e)
                        passwordRef.current?.blur()
                    }}>
                        <input
                            ref={passwordRef}
                            type="text"
                            placeholder={passwordSubmitted ? "Updated" : "New Password"}
                            className={`w-full text-center text-surface-a50 font-medium placeholder-surface-a50 bg-surface-a20 py-2 rounded-lg cursor-pointer ring hover:text-white hover:bg-surface-a30 focus:text-white focus:outline-none focus:placeholder-transparent text-ellipsis transition ${passwordSubmitted ? 'ring-primary-a0' : 'ring-surface-a30'}`}
                            value={password}
                            onChange={(e) => handlePasswordChange(e)}
                            onBlur={(e) => handleUserUpdate(e)}
                        />
                    </form>
                    <button 
                        className={`w-full py-2 rounded-lg font-medium cursor-pointer text-surface-a50 hover:text-white bg-surface-a20 hover:bg-surface-a30 ring ring-surface-a30 transition `}
                    >
                    Delete
                    </button>
                </div>
            </div>
        )}
        </>
    );
}

export default Header

