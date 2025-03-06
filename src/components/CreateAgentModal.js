import React, { useState } from 'react';
import axiosInstance from '../axiosInstance';

const CreateAgentModal = ({ isOpen, onClose, onAgentCreated }) => {
    const [agentData, setAgentData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        agencyName: '',
        region: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAgentData({ ...agentData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');

        try {
            const token = localStorage.getItem('authToken');
            const response = await axiosInstance.post(
                `${process.env.REACT_APP_API_BASE_URL}/agents`,
                agentData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            alert('Agent created successfully!');
            onAgentCreated(response.data);
            onClose();
        } catch (error) {
            console.error('Error creating agent:', error);
            setErrorMessage('Failed to create agent. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 p-4">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-11/12 sm:w-1/3 max-w-md">
                {/* Header */}
                <h2 className="text-lg sm:text-xl font-bold mb-3 text-gray-900">Create New Agent</h2>
                
                {/* Error Message */}
                {errorMessage && <p className="text-red-600 text-sm mb-3">{errorMessage}</p>}
                
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        type="text"
                        name="name"
                        placeholder="Agent Name"
                        value={agentData.name}
                        onChange={handleChange}
                        className="w-full border p-2 rounded-md focus:ring focus:ring-blue-300"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Agent Email"
                        value={agentData.email}
                        onChange={handleChange}
                        className="w-full border p-2 rounded-md focus:ring focus:ring-blue-300"
                    />
                    <input
                        type="tel"
                        name="phoneNumber"
                        placeholder="Agent Phone Number"
                        value={agentData.phoneNumber}
                        onChange={handleChange}
                        className="w-full border p-2 rounded-md focus:ring focus:ring-blue-300"
                    />
                    <input
                        type="text"
                        name="agencyName"
                        placeholder="Agency Name"
                        value={agentData.agencyName}
                        onChange={handleChange}
                        className="w-full border p-2 rounded-md focus:ring focus:ring-blue-300"
                    />
                    <input
                        type="text"
                        name="region"
                        placeholder="Region"
                        value={agentData.region}
                        onChange={handleChange}
                        className="w-full border p-2 rounded-md focus:ring focus:ring-blue-300"
                    />
    
                    {/* Buttons */}
                    <div className="flex flex-wrap justify-end gap-2 mt-4">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creating...' : 'Create Agent'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
    
};

export default CreateAgentModal;
