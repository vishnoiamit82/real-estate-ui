import React, { useState } from 'react';
import axiosInstance from '../axiosInstance';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post(`${process.env.REACT_APP_API_BASE_URL}/forgot-password`, { email });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Failed to send reset email. Please try again.');
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-md">
            <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1">Enter your email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    Send Reset Link
                </button>
            </form>
            {message && <p className="mt-4 text-center">{message}</p>}
        </div>
    );
};

export default ForgotPassword;
