import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaGlobe, FaMoon, FaBars } from "react-icons/fa";
import { TbUsersGroup, TbUserCog } from "react-icons/tb";
import { RiUserFollowLine } from "react-icons/ri";
import { googleLogout } from '@react-oauth/google';
import { GoFileCode, GoMail, GoBell } from "react-icons/go";
import { CiLogout } from "react-icons/ci";
import { UserContext } from "../contexts/UserContext";

function Navbar() {
    const { user, setUser } = useContext(UserContext);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [language, setLanguage] = useState("fr");
    const [searchTerm, setSearchTerm] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [messages, setMessages] = useState([]);
    const [hasNewNotification, setHasNewNotification] = useState(false);
    const [hasNewMessage, setHasNewMessage] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const profileDropdownRef = useRef(null);
    const languageDropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setProfileDropdownOpen(false);
            }
            if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
                setLanguageDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (user) {
            setTimeout(() => {
                const mockNotifications = [
                    { id: 1, message: "New comment on your post" },
                    { id: 2, message: "You have a new follower" }
                ];
                setNotifications(mockNotifications);
                setHasNewNotification(mockNotifications.length > 0);

                const mockMessages = [
                    { id: 1, message: "New message from John Doe" },
                    { id: 2, message: "Your report is ready" }
                ];
                setMessages(mockMessages);
                setHasNewMessage(mockMessages.length > 0);
            }, 1000);
        }
    }, [user]);

    const handleSignOut = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        googleLogout();
        navigate("/login");
    };

    const handleHomeClick = () => {
        if (user && user.username) {
            navigate("/home");
        } else {
            navigate("/not-found");
        }
    };

    const toggleDarkMode = () => setDarkMode(!darkMode);
    const changeLanguage = (lang) => {
        setLanguage(lang);
        setLanguageDropdownOpen(false);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = () => {
        navigate('/home', { state: { searchTerm } });
    };

    const handleNotificationsClick = () => {
        setHasNewNotification(false);
        navigate("/notifications");
    };

    const handleMessagesClick = () => {
        setHasNewMessage(false);
        navigate("/chat");
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <div className="flex flex-col flex-grow pb-7">
            <nav className={`bg-gray-800 py-4 fixed top-0 w-full z-20 ${darkMode ? 'text-white' : 'text-gray-400'}`}>
                <div className="container mx-auto flex justify-between items-center">
                    <a href="/" className="text-lg font-semibold" onClick={handleHomeClick}>
                        MonApp
                    </a>
                    <div className="hidden md:flex items-center space-x-4 ml-8 w-3/5">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Recherche..."
                            className="flex-grow p-2 border rounded border-gray-300"
                        />
                        <button
                            onClick={handleSearch}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Valider
                        </button>
                    </div>
                    <div className="hidden md:flex items-center ml-auto">
                        <div className="flex flex-row">
                            <a href="/home"
                               className="text-gray-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                               onClick={handleHomeClick}>Home</a>
                            {!user && <a href="/login"
                                         className="text-gray-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Login</a>}
                            <a href="/editor"
                               className="text-gray-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Editor</a>
                            <a href="/pipeline"
                               className="text-gray-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Pipeline</a>
                        </div>

                        <div className="relative ml-4 flex items-center" ref={languageDropdownRef}>
                            <button
                                onMouseEnter={() => setLanguageDropdownOpen(true)}
                                className="focus:outline-none"
                            >
                                <FaGlobe className={`inline-block ${languageDropdownOpen ? 'text-blue-500' : ''}`}
                                         style={{fontSize: '1.3rem'}}/>
                                <span className="ml-1">{language.toUpperCase()}</span>
                            </button>
                            {languageDropdownOpen && (
                                <div
                                    className="absolute right-0 mt-2 w-20 bg-white rounded-md shadow-lg"
                                    onMouseEnter={() => setLanguageDropdownOpen(true)}
                                    onMouseLeave={() => setLanguageDropdownOpen(false)}
                                >
                                    <button onClick={() => changeLanguage('fr')}
                                            className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-200">FR
                                    </button>
                                    <button onClick={() => changeLanguage('en')}
                                            className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-200">EN
                                    </button>
                                </div>
                            )}
                        </div>
                        <button onClick={toggleDarkMode} className="ml-4 focus:outline-none">
                            <FaMoon className={`inline-block ${darkMode ? 'text-white' : 'text-gray-400'}`}
                                    style={{fontSize: '1.5rem'}}/>
                        </button>
                        {user && (
                            <div className="relative ml-4">
                                <button onClick={handleNotificationsClick} className="focus:outline-none">
                                    <GoBell className="inline-block text-gray-400" style={{fontSize: '1.5rem'}}/>
                                    {hasNewNotification && <span
                                        className="absolute top-0 right-0 inline-block w-3 h-3 bg-red-600 rounded-full"></span>}
                                </button>
                            </div>
                        )}
                        {user && (
                            <div className="relative  flex flex-row items-center justify-between">
                                <div className="relative ml-4 ">
                                    <button onClick={handleMessagesClick} className="focus:outline-none">
                                        <GoMail className="inline-block text-gray-400" style={{fontSize: '1.5rem'}}/>
                                        {hasNewMessage && <span
                                            className="absolute top-0 right-0 inline-block w-3 h-3 bg-red-600 rounded-full"></span>}
                                    </button>
                                </div>
                                <a href="/Chat" onClick={handleMessagesClick}
                                   className="text-gray-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Chat</a>
                            </div>

                        )}
                        {user && (
                            <>
                                <div className="relative ml-4" ref={profileDropdownRef}>
                                    <button
                                        onMouseEnter={() => setProfileDropdownOpen(true)}
                                        className="focus:outline-none"
                                    >
                                        <div
                                            className="w-10 h-10 rounded-full overflow-hidden flex justify-center items-center border border-white bg-gray-200">
                                            <span
                                                className="text-lg  text-center text-gray-600">{user.first_name.charAt(0)}{user.last_name.charAt(0)}</span>

                                        </div>
                                    </button>
                                    {profileDropdownOpen && (
                                        <div
                                            className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg"
                                            onMouseEnter={() => setProfileDropdownOpen(true)}
                                            onMouseLeave={() => setProfileDropdownOpen(false)}
                                        >
                                            <a href="/profile"
                                               className="block px-4 py-2 text-gray-800 hover:bg-gray-200 flex items-center">
                                                <TbUserCog className="mr-2"/> Modifier Profil
                                            </a>
                                            <a href="/programmes"
                                               className="block px-4 py-2 text-gray-800 hover:bg-gray-200 flex items-center">
                                                <GoFileCode className="mr-2"/> Programmes
                                            </a>

                                            <button
                                                onClick={handleSignOut}
                                                className="w-full text-left block px-4 py-2 text-gray-800 hover:bg-gray-200 flex items-center"
                                            >
                                                <CiLogout className="mr-2"/> Déconnexion
                                            </button>

                                        </div>
                                    )}
                                </div>
                                <span className="text-gray-400 ml-4">{user?.first_name} {user?.last_name}</span>
                            </>
                        )}
                    </div>
                    <div className="md:hidden flex items-center">
                        <button onClick={toggleMenu} className="text-gray-400 hover:text-white focus:outline-none">
                            <FaBars style={{ fontSize: '1.5rem' }} />
                        </button>
                    </div>
                </div>
                {menuOpen && (
                    <div className="md:hidden mt-4 flex flex-col items-center space-y-4 bg-gray-800 w-full py-4">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Recherche..."
                            className="p-2 border rounded border-gray-300"
                        />
                        <button
                            onClick={handleSearch}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Valider
                        </button>
                        <a href="/home"
                           className="text-gray-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                           onClick={handleHomeClick}>Home</a>
                        {!user && <a href="/login"
                                     className="text-gray-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Login</a>}
                        <a href="/editor"
                           className="text-gray-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Editor</a>
                        <a href="/pipeline"
                           className="text-gray-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Pipeline</a>
                        {user && (
                            <>
                                <button onClick={handleNotificationsClick} className="focus:outline-none">
                                    <GoBell className="inline-block text-gray-400" style={{ fontSize: '1.5rem' }} />
                                    {hasNewNotification && <span
                                        className="absolute top-0 right-0 inline-block w-3 h-3 bg-red-600 rounded-full"></span>}
                                </button>
                                <button onClick={handleMessagesClick} className="focus:outline-none">
                                    <GoMail className="inline-block text-gray-400" style={{ fontSize: '1.5rem' }} />
                                    {hasNewMessage && <span
                                        className="absolute top-0 right-0 inline-block w-3 h-3 bg-red-600 rounded-full"></span>}
                                </button>
                                <div className="flex flex-col items-center">
                                    <a href="/profile"
                                       className="block px-4 py-2 text-gray-800 hover:bg-gray-200 flex items-center">
                                        <TbUserCog className="mr-2" /> Modifier Profil
                                    </a>
                                    <a href="/programmes"
                                       className="block px-4 py-2 text-gray-800 hover:bg-gray-200 flex items-center">
                                        <GoFileCode className="mr-2" /> Programmes
                                    </a>
                                    <button
                                        onClick={handleSignOut}
                                        className="w-full text-left block px-4 py-2 text-gray-800 hover:bg-gray-200 flex items-center"
                                    >
                                        <CiLogout className="mr-2" /> Déconnexion
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </nav>

            {/* Second Navbar */}
            {user && (
                <nav className="bg-gray-100 py-2 fixed top-16 w-full z-10 shadow pt-8 pb-4">
                    <div className="container mx-auto flex justify-end items-center space-x-4">
                        <button
                            onClick={() => navigate('/createGroupe')}
                            className="hover:bg-blue-400 text-black font-light py-2 border hover:border-white border-gray-300 px-7 rounded-md flex items-center"
                        >
                            <TbUsersGroup className="mr-2"/> Créer un groupe
                        </button>
                        <button
                            onClick={() => console.log("Liste des amis")}
                            className="hover:bg-blue-400 text-black font-light py-2 px-7 rounded-md hover:border-white border border-gray-300 flex items-center"
                        >
                            <RiUserFollowLine className="mr-2 text-green-800 font-semibold inline-block"/> <span>Liste des amis</span>
                            <span
                                className="absolute top-0 right-0 inline-block w-3 h-3 bg-green-600 rounded-full"></span>
                        </button>
                    </div>
                </nav>
            )}
        </div>
    );
}

export default Navbar;
