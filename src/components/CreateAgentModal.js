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
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <h2 className="text-xl font-bold mb-4">Create New Agent</h2>
                {errorMessage && <p className="text-red-600 text-sm mb-2">{errorMessage}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Agent Name"
                        value={agentData.name}
                        onChange={handleChange}
                        className="w-full border p-2 rounded-md mt-2"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Agent Email"
                        value={agentData.email}
                        onChange={handleChange}
                        className="w-full border p-2 rounded-md mt-2"
                    />
                    <input
                        type="tel"
                        name="phoneNumber"
                        placeholder="Agent Phone Number"
                        value={agentData.phoneNumber}
                        onChange={handleChange}
                        className="w-full border p-2 rounded-md mt-2"
                    />
                    <input
                        type="text"
                        name="agencyName"
                        placeholder="Agency Name"
                        value={agentData.agencyName}
                        onChange={handleChange}
                        className="w-full border p-2 rounded-md mt-2"
                    />
                    <input
                        type="text"
                        name="region"
                        placeholder="Region"
                        value={agentData.region}
                        onChange={handleChange}
                        className="w-full border p-2 rounded-md mt-2"
                    />
                    <div className="flex justify-end mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2">Cancel</button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md"
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
