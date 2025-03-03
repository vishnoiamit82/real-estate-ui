import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';

const LoginForm = ({ setCurrentUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post(`${process.env.REACT_APP_API_BASE_URL}/login`, {
                email,
                password
            });

            localStorage.setItem('authToken', response.data.token);
            setCurrentUser(response.data.user);
            localStorage.setItem('currentUser', JSON.stringify(response.data.user));

            navigate(response.data.user.role === 'admin' ? '/user-management' : '/');
        } catch (error) {
            console.error('Login error:', error);
            setError('Invalid email or password');
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-md">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1">Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1">Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    Login
                </button>
            </form>
            <div className="mt-4 text-center">
                <button
                    onClick={() => navigate('/forgot-password')}
                    className="text-blue-500 hover:underline"
                >
                    Forgot Password?
                </button>
            </div>
        </div>
    );
};

export default LoginForm;
