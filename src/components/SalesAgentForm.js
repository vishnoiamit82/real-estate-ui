import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';

const SalesAgentForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
    });

    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Post the form data to the backend
            const response = await axiosInstance.post(`${process.env.REACT_APP_API_BASE_URL}/agents`, formData);
            setMessage('Sales agent added successfully!');
            console.log(response.data);
            setFormData({
                name: '',
                email: '',
                phoneNumber: '',
            });
            // Redirect to the agents list or home page
            navigate('/agents');
        } catch (error) {
            console.error('Error adding sales agent:', error);
            setMessage('Failed to add sales agent. Please try again.');
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Add Sales Agent</h2>
            <button
                onClick={() => navigate('/')}
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
                Back to Home
            </button>

            {message && (
                <p className={`text-${message.includes('successfully') ? 'green' : 'red'}-600`}>{message}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-2">Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter name"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-2">Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter email"

                    />
                </div>
                <div>
                    <label className="block mb-2">Phone Number:</label>
                    <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter phone number"

                    />
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                    Add Agent
                </button>
            </form>
        </div>
    );
};

export default SalesAgentForm;
