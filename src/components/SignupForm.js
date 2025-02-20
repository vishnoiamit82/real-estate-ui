// SignupForm.js
import React, { useState } from 'react';
import axiosInstance from '../axiosInstance';

const SignupForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phoneNumber: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post(`${process.env.REACT_APP_API_BASE_URL}/signup`, formData);
            setMessage('Signup successful! You can now log in.');
            setFormData({ name: '', email: '', password: '', phoneNumber: '' });
        } catch (error) {
            console.error('Signup error:', error);
            setMessage('Failed to sign up. Please try again.');
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
            {message && <p className="mb-4">{message}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <input type="tel" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} />
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">Sign Up</button>
            </form>
        </div>
    );
};

export default SignupForm;
