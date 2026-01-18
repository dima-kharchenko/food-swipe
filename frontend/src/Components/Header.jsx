import { useRef, useState, useEffect } from 'react';
import { logout } from '../api';
import { useNavigate } from 'react-router-dom';

function Header(){
    const navigate = useNavigate()
    const dropdownRef = useRef(null)
    const buttonRef = useRef(null);
    const [menuToggle, setMenuToggle] = useState(false)

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                !event.target.closest(".dropdown") &&
                !event.target.closest(".dropdown-button")
            ) {
                setMenuToggle(false)
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
    return(
        <>
        <div>
        <nav className="border-b bg-surface-a0 border-primary-a0 fixed top-0 w-full z-50 select-none">
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
                            {text: "Profile", onClick: () => navigate('/profile')}, 
                            {text: "Logout", onClick: () => handleLogout()}
                        ].map((button, index) => (
                        <button 
                            key={index} 
                            className={`w-full px-2 py-1 rounded-lg font-medium cursor-pointer ${ 0 ? "text-white bg-primary-a0" : "text-surface-a50 hover:text-white bg-surface-a20 hover:bg-surface-a30 ring ring-surface-a30"} transition `}
                            onClick={button.onClick}
                        >
                            {button.text} 
                        </button>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
        </div>
        </>
    );
}

export default Header

