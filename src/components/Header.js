import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Header = ({ currentUser, onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        navigate('/login');
    };

    return (
        <header className="bg-gray-800 text-white p-4">
            <nav className="container mx-auto flex justify-between">
                <h1>
                    <NavLink
                        to="/"
                        className="text-xl font-bold"
                    >
                        Buyers Agents App
                    </NavLink>
                </h1>

                <ul className="flex space-x-4">
                    <li>
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                isActive ? 'text-blue-400 underline' : 'hover:text-blue-400'
                            }
                        >
                            Property Management
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/agents"
                            className={({ isActive }) =>
                                isActive ? 'text-blue-400 underline' : 'hover:text-blue-400'
                            }
                        >
                            Agent Management
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) =>
                                isActive ? 'text-blue-400 underline' : 'hover:text-blue-400'
                            }
                        >
                            Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/cashflow-calculator"
                            className={({ isActive }) =>
                                isActive ? 'text-blue-400 underline' : 'hover:text-blue-400'
                            }
                        >
                            Cashflow Calculator
                        </NavLink>
                    </li>

                    {/* Show Signup link only if not logged in */}
                    {!currentUser && (
                        <li>
                            <NavLink
                                to="/signup"
                                className={({ isActive }) =>
                                    isActive ? 'text-blue-400 underline' : 'hover:text-blue-400'
                                }
                            >
                                Sign Up
                            </NavLink>
                        </li>
                    )}

                    {/* Show User Management link only to Admins */}
                    {currentUser?.role === 'admin' && (
                        <li>
                            <NavLink
                                to="/user-management"
                                className={({ isActive }) =>
                                    isActive ? 'text-blue-400 underline' : 'hover:text-blue-400'
                                }
                            >
                                User Management
                            </NavLink>
                        </li>
                    )}

                    {/* Conditional Login/Logout */}
                    {!currentUser ? (
                        <li>
                            <NavLink
                                to="/login"
                                className={({ isActive }) =>
                                    isActive ? 'text-blue-400 underline' : 'hover:text-blue-400'
                                }
                            >
                                Login
                            </NavLink>
                        </li>
                    ) : (
                        <li>
                            <button
                                onClick={handleLogout}
                                className="hover:text-red-400"
                            >
                                Logout
                            </button>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Header;
