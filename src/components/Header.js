import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
    return (
        <header className="bg-gray-800 text-white p-4">
            <nav className="container mx-auto flex justify-between">
                <h1>
                    <NavLink
                        to="/"
                        className="text-xl font-bold">Buyers Agents App
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

                    
                </ul>

            </nav>
        </header>
    );
};

export default Header;
