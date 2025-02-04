import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const AgentForm = () => {
    const { id } = useParams(); // Get agent ID from URL for edit
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        agencyName: '', // New field
        region: '', // New field
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // Fetch agent details if editing
    useEffect(() => {
        if (id) {
            const fetchAgent = async () => {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/agents/${id}`);
                    setFormData(response.data); // Populate form with agent details
                } catch (error) {
                    console.error('Error fetching agent details:', error);
                }
            };
            fetchAgent();
        }
    }, [id]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                // Update existing agent
                await axios.put(`${process.env.REACT_APP_API_BASE_URL}/agents/${id}`, formData);
                setMessage('Agent updated successfully!');
            } else {
                // Create new agent
                await axios.post(`${process.env.REACT_APP_API_BASE_URL}/agents`, formData);
                setMessage('Agent created successfully!');
            }
            setTimeout(() => navigate('/agents'), 1500); // Redirect to agent list
        } catch (error) {
            console.error('Error saving agent:', error);
            setMessage('Failed to save agent. Please try again.');
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">{id ? 'Edit Agent' : 'Add New Agent'}</h2>
            <button
                onClick={() => navigate('/agents')}
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
                Back to Agent List
            </button>

            {message && <p className={`text-${message.includes('successfully') ? 'green' : 'red'}-600`}>{message}</p>}

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
                <div>
                    <label className="block mb-2">Agency Name:</label>
                    <input
                        type="text"
                        name="agencyName"
                        value={formData.agencyName}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter agency name"
                    />
                </div>
                <div>
                    <label className="block mb-2">Region:</label>
                    <input
                        type="text"
                        name="region"
                        value={formData.region}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter region"
                    />
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                    {id ? 'Update Agent' : 'Create Agent'}
                </button>
            </form>
        </div>
    );
};

export default AgentForm;
