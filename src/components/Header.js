import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

const Header = ({ currentUser, onLogout }) => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);

    const handleLogout = () => {
        onLogout();
        navigate('/login');
        setMenuOpen(false);
    };

    const getUserInitials = (name) => {
        if (!name || typeof name !== 'string') return '?';
        return name.trim().split(' ').filter(Boolean).map(part => part[0].toUpperCase()).join('') || '?';
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="bg-gray-800 text-white fixed top-0 w-full shadow-md z-50">
            <nav className="container mx-auto flex justify-between items-center p-4">
                {/* Logo */}
                <h1>
                    <NavLink to="/public" className="text-xl font-bold hover:text-blue-400 transition">
                        Buyers Agents App
                    </NavLink>
                </h1>

                {/* Desktop Menu */}
                <ul className="hidden md:flex space-x-6 items-center">
                    {/* <li>
                <NavLink
                    to="/landing"
                    className={({ isActive }) =>
                    isActive ? 'text-blue-400 underline' : 'hover:text-blue-400'
                    }
                >
                    Home
                </NavLink>
                </li> */}

                    <li>
                        <NavLink to="/" className={({ isActive }) => isActive ? 'text-blue-400 underline' : 'hover:text-blue-400'}>
                            My Properties
                        </NavLink>
                    </li>

                    {/* {currentUser && (
                        <li>
                            <NavLink
                                to="/client-briefs"
                                className={({ isActive }) =>
                                    isActive ? 'text-blue-400 underline' : 'hover:text-blue-400'
                                }
                            >
                                Client Briefs
                            </NavLink>
                        </li>
                    )} */}


                    {currentUser?.role === 'admin' && (
                        <>
                            <li><NavLink to="/agents" className={({ isActive }) => isActive ? 'text-blue-400 underline' : 'hover:text-blue-400'}>Agent Management</NavLink></li>
                            <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? 'text-blue-400 underline' : 'hover:text-blue-400'}>Dashboard</NavLink></li>
                            <li><NavLink to="/cashflow-calculator" className={({ isActive }) => isActive ? 'text-blue-400 underline' : 'hover:text-blue-400'}>Cashflow Calculator</NavLink></li>
                            <li><NavLink to="/user-management" className={({ isActive }) => isActive ? 'text-blue-400 underline' : 'hover:text-blue-400'}>User Management</NavLink></li>
                            <NavLink to="/ai-search-queries" onClick={() => setMenuOpen(false)} className="hover:text-blue-400">AI Search Query Viewer</NavLink>
                            <NavLink to="/tags" onClick={() => setMenuOpen(false)} className="hover:text-blue-400">Manage tags</NavLink>
                        </>
                    )}

                    {currentUser && (
                        <li>
                            <NavLink to="/public" className={({ isActive }) => isActive ? 'text-blue-400 underline' : 'hover:text-blue-400'}>
                                Community Properties
                            </NavLink>
                        </li>
                    )}

                    {['admin', 'property_sourcer'].includes(currentUser?.role) && (
                        <li>
                            <NavLink to="/template-management" className={({ isActive }) => isActive ? 'text-blue-400 underline' : 'hover:text-blue-400'}>
                                Email Templates
                            </NavLink>
                        </li>
                    )}

                    {!currentUser ? (
                        <>
                            <li><NavLink to="/signup" className={({ isActive }) => isActive ? 'text-blue-400 underline' : 'hover:text-blue-400'}>Sign Up</NavLink></li>
                            <li><NavLink to="/login" className={({ isActive }) => isActive ? 'text-blue-400 underline' : 'hover:text-blue-400'}>Login</NavLink></li>
                        </>
                    ) : (
                        <li className="relative" ref={userMenuRef}>
                            <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-1 hover:text-blue-400">
                                <div title={currentUser.email} className="w-9 h-9 bg-blue-500 text-white font-bold rounded-full flex items-center justify-center text-sm shadow-md">
                                    {getUserInitials(currentUser.name)}
                                </div>
                                <ChevronDown size={16} />
                            </button>
                            {userMenuOpen && (
                                <ul className="absolute right-0 mt-2 bg-white text-gray-800 rounded shadow-md py-2 w-48 z-50">
                                    <li className="px-4 py-2 border-b text-sm">{currentUser.email}</li>
                                    <li>
                                        <NavLink to="/profile" className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm" onClick={() => setUserMenuOpen(false)}>
                                            My Profile
                                        </NavLink>
                                    </li>
                                    <li>
                                        <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-red-100 text-sm text-red-600">
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </li>
                    )}
                </ul>

                {/* Mobile Menu Button */}
                <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden focus:outline-none">
                    {menuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </nav>

            {/* Mobile Menu Dropdown */}
            {menuOpen && (
                <div className="md:hidden bg-gray-900 text-white flex flex-col items-center space-y-4 py-4">
                    {['admin', 'property_sourcer'].includes(currentUser?.role) && (
                        <NavLink to="/template-management" onClick={() => setMenuOpen(false)} className="hover:text-blue-400">
                            Email Templates
                        </NavLink>
                    )}
                    <NavLink to="/" onClick={() => setMenuOpen(false)} className="hover:text-blue-400">
                        My Properties
                    </NavLink>
                    {/* {currentUser && (
                        <NavLink
                            to="/client-briefs"
                            onClick={() => setMenuOpen(false)}
                            className="hover:text-blue-400"
                        >
                            Client Briefs
                        </NavLink>
                    )} */}

                    {currentUser?.role === 'admin' && (
                        <>
                            <NavLink to="/agents" onClick={() => setMenuOpen(false)} className="hover:text-blue-400">Agent Management</NavLink>
                            <NavLink to="/dashboard" onClick={() => setMenuOpen(false)} className="hover:text-blue-400">Dashboard</NavLink>
                            <NavLink to="/cashflow-calculator" onClick={() => setMenuOpen(false)} className="hover:text-blue-400">Cashflow Calculator</NavLink>
                            <NavLink to="/user-management" onClick={() => setMenuOpen(false)} className="hover:text-blue-400">User Management</NavLink>
                            <NavLink to="/ai-search-queries" onClick={() => setMenuOpen(false)} className="hover:text-blue-400">AI Search Query Viewer</NavLink>
                        </>
                    )}
                    {currentUser && (
                        <NavLink to="/public" onClick={() => setMenuOpen(false)} className="hover:text-blue-400">Community Properties</NavLink>
                    )}

                    {currentUser && (
                        <div className="text-center text-sm text-gray-300">
                            <div className="w-9 h-9 bg-blue-500 text-white font-bold rounded-full flex items-center justify-center mx-auto mb-1">
                                {getUserInitials(currentUser.name)}
                            </div>
                            <div>{currentUser.email}</div>
                        </div>
                    )}

                    {!currentUser ? (
                        <>
                            <NavLink to="/signup" onClick={() => setMenuOpen(false)} className="hover:text-blue-400">Sign Up</NavLink>
                            <NavLink to="/login" onClick={() => setMenuOpen(false)} className="hover:text-blue-400">Login</NavLink>
                        </>
                    ) : (
                        <button onClick={handleLogout} className="hover:text-red-400">Logout</button>
                    )}
                </div>
            )}
        </header>
    );
};

export default Header;
