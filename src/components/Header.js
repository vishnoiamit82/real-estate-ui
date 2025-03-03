import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // Icons for mobile menu

const Header = ({ currentUser, onLogout }) => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        onLogout();
        navigate('/login');
        setMenuOpen(false); // Close menu on logout
    };

    return (
        <header className="bg-gray-800 text-white fixed top-0 w-full shadow-md z-50">
            <nav className="container mx-auto flex justify-between items-center p-4">
                {/* Logo */}
                <h1>
                    <NavLink to="/" className="text-xl font-bold hover:text-blue-400 transition">
                        Buyers Agents App
                    </NavLink>
                </h1>

                {/* Desktop Menu */}
                <ul className="hidden md:flex space-x-6">
                    {(currentUser?.role === 'admin' || currentUser?.role === 'property_sourcer') && (
                        <li>
                            <NavLink
                                to="/template-management"
                                className={({ isActive }) => isActive ? 'text-blue-400 underline' : 'hover:text-blue-400'}
                            >
                                Email Templates
                            </NavLink>
                        </li>
                    )}
                    <li>
                        <NavLink
                            to="/"
                            className={({ isActive }) => isActive ? 'text-blue-400 underline' : 'hover:text-blue-400'}
                        >
                            Property Sourcing
                        </NavLink>
                    </li>
                    {currentUser?.role === 'admin' && (
                        <>
                            <li>
                                <NavLink
                                    to="/agents"
                                    className={({ isActive }) => isActive ? 'text-blue-400 underline' : 'hover:text-blue-400'}
                                >
                                    Agent Management
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/dashboard"
                                    className={({ isActive }) => isActive ? 'text-blue-400 underline' : 'hover:text-blue-400'}
                                >
                                    Dashboard
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/cashflow-calculator"
                                    className={({ isActive }) => isActive ? 'text-blue-400 underline' : 'hover:text-blue-400'}
                                >
                                    Cashflow Calculator
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/user-management"
                                    className={({ isActive }) => isActive ? 'text-blue-400 underline' : 'hover:text-blue-400'}
                                >
                                    User Management
                                </NavLink>
                            </li>
                        </>
                    )}

                    {!currentUser ? (
                        <li>
                            <NavLink
                                to="/signup"
                                className={({ isActive }) => isActive ? 'text-blue-400 underline' : 'hover:text-blue-400'}
                            >
                                Sign Up
                            </NavLink>
                        </li>
                    ) : (
                        <li>
                            <button onClick={handleLogout} className="hover:text-red-400">Logout</button>
                        </li>
                    )}

                    {!currentUser && (
                        <li>
                            <NavLink
                                to="/login"
                                className={({ isActive }) => isActive ? 'text-blue-400 underline' : 'hover:text-blue-400'}
                            >
                                Login
                            </NavLink>
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
                    {(currentUser?.role === 'admin' || currentUser?.role === 'property_sourcer') && (
                        <NavLink to="/template-management" onClick={() => setMenuOpen(false)} className="hover:text-blue-400">
                            Email Templates
                        </NavLink>
                    )}
                    <NavLink to="/" onClick={() => setMenuOpen(false)} className="hover:text-blue-400">
                        Property Sourcing
                    </NavLink>
                    {currentUser?.role === 'admin' && (
                        <>
                            <NavLink to="/agents" onClick={() => setMenuOpen(false)} className="hover:text-blue-400">
                                Agent Management
                            </NavLink>
                            <NavLink to="/dashboard" onClick={() => setMenuOpen(false)} className="hover:text-blue-400">
                                Dashboard
                            </NavLink>
                            <NavLink to="/cashflow-calculator" onClick={() => setMenuOpen(false)} className="hover:text-blue-400">
                                Cashflow Calculator
                            </NavLink>
                            <NavLink to="/user-management" onClick={() => setMenuOpen(false)} className="hover:text-blue-400">
                                User Management
                            </NavLink>
                        </>
                    )}
                    {!currentUser ? (
                        <>
                            <NavLink to="/signup" onClick={() => setMenuOpen(false)} className="hover:text-blue-400">
                                Sign Up
                            </NavLink>
                            <NavLink to="/login" onClick={() => setMenuOpen(false)} className="hover:text-blue-400">
                                Login
                            </NavLink>
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
