import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';

const PropertyEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        address: '',
        propertyLink: '',
        agentId: '',
        agentDetails: '', // Combines name, phone, and email
        offerClosingDate: '',
        currentStatus: 'available',
        askingPrice: '',
        rental: '',
        rentalYield: '',
        councilRate: '',
        insurance: '',
        floodZone: '',
        bushfireZone: '',
        conversation: [], // For storing property conversation
    });

    const [agents, setAgents] = useState([]);
    const [filteredAgents, setFilteredAgents] = useState([]);
    const [searchAgent, setSearchAgent] = useState('');
    const [message, setMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [newConversation, setNewConversation] = useState(''); // For new conversation entry


    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/properties/${id}`);
                const propertyData = response.data;
                setFormData(propertyData);

                if (!propertyData.conversation) {
                    propertyData.conversation = [];
                }

                if (response.data.agentId) {
                    const agent = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/agents/${response.data.agentId._id}`);
                    setSearchAgent(agent.data.name);
                }
            } catch (error) {
                console.error('Error fetching property:', error);
                setMessage('Failed to load property details.');
            }
        };

        const fetchAgents = async () => {
            try {
                const response = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/agents`);
                setAgents(response.data);
                setFilteredAgents(response.data);
            } catch (error) {
                console.error('Error fetching agents:', error);
            }
        };

        fetchProperty();
        fetchAgents();
    }, [id]);

    const handleAgentSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchAgent(query);
        const filtered = agents.filter((agent) => agent.name.toLowerCase().includes(query));
        setFilteredAgents(filtered);
    };

    const handleAgentSelect = (agent) => {
        setFormData({
            ...formData,
            agentId: agent._id,
            agentDetails: `${agent.name}, ${agent.phoneNumber || 'N/A'}, ${agent.email || 'N/A'}`,
        });
        setSearchAgent(agent.name);
        setFilteredAgents([]);
    };

    const handleNewConversationChange = (e) => {
        setNewConversation(e.target.value);
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {

        if (newConversation.trim() !== '') {
            const newConvObj = {
                timestamp: new Date().toISOString(),
                content: newConversation.trim(),
            };
            formData.conversation.push(newConvObj);
        }

        e.preventDefault();
        try {
            await axiosInstance.put(`${process.env.REACT_APP_API_BASE_URL}/properties/${id}`, formData);
            setSuccessMessage('Property updated successfully!');
            navigate(`/properties/${id}`);
        } catch (error) {
            console.error('Error updating property:', error);
            setMessage('Failed to update property.');
        }
    };

    const handleConversationChange = (e) => {
        const lines = e.target.value.split('\n').filter((line) => line.trim() !== '');

        setFormData({
            ...formData,
            conversation: lines.map((line) => {
                const [timestamp, ...content] = line.split(':');
                return {
                    timestamp: timestamp.trim() || new Date().toISOString(),
                    content: content.join(':').trim(),
                };
            }),
        });
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">Edit Property</h2>
            {successMessage && (
                <p className="mb-4 text-green-600 bg-green-100 p-2 rounded">{successMessage}</p>
            )}
            {message && <p className="mb-4 text-red-600 bg-red-100 p-2 rounded">{message}</p>}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="border rounded-md p-4 bg-gray-50">
                    <h3 className="text-lg font-bold mb-4">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2">Address:</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Property Link:</label>
                            <input
                                type="url"
                                name="propertyLink"
                                value={formData.propertyLink}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Offer Closing Date:</label>
                            <input
                                type="date"
                                name="offerClosingDate"
                                value={formData.offerClosingDate}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"

                            />
                        </div>
                        <div>
                            <label className="block mb-2">Status:</label>
                            <select
                                name="currentStatus"
                                value={formData.currentStatus}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value="available">Available</option>
                                <option value="sold">Sold</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Financial Information */}
                <div className="border rounded-md p-4 bg-gray-50">
                    <h3 className="text-lg font-bold mb-4">Financial Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2">Asking Price:</label>
                            <input
                                type="text"
                                name="askingPrice"
                                value={formData.askingPrice}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Rental:</label>
                            <input
                                type="text"
                                name="rental"
                                value={formData.rental}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Rental Yield:</label>
                            <input
                                type="text"
                                name="rentalYield"
                                value={formData.rentalYield}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Council Rate:</label>
                            <input
                                type="text"
                                name="councilRate"
                                value={formData.councilRate}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Insurance:</label>
                            <input
                                type="text"
                                name="insurance"
                                value={formData.insurance}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                    </div>
                </div>

                {/* Zoning Information */}
                <div className="border rounded-md p-4 bg-gray-50">
                    <h3 className="text-lg font-bold mb-4">Zoning Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2">Flood Zone:</label>
                            <input
                                type="text"
                                name="floodZone"
                                value={formData.floodZone}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Bushfire Zone:</label>
                            <input
                                type="text"
                                name="bushfireZone"
                                value={formData.bushfireZone}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                    </div>
                </div>

                {/* Conversations Section */}
                <div className="border rounded-md p-4 bg-gray-50">
                    <h3 className="text-lg font-bold mb-4">Conversations</h3>

                    {/* Read-Only Existing Conversations */}
                    <div className="mb-4">
                        <label className="block mb-2">Existing Conversations:</label>
                        <textarea
                            readOnly
                            value={formData.conversation
                                .map((conv) => `${new Date(conv.timestamp).toLocaleString()}: ${conv.content}`)
                                .join('\n')}
                            rows="6"
                            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                        ></textarea>
                    </div>

                    {/* New Conversation Input */}
                    <div>
                        <label className="block mb-2">Add New Conversation:</label>
                        <textarea
                            name="newConversation"
                            value={newConversation}
                            onChange={handleNewConversationChange}
                            rows="3"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Add new conversation (message only)"
                        ></textarea>
                    </div>
                </div>



                {/* Agent Information */}
                <div className="border rounded-md p-4 bg-gray-50">
                    <h3 className="text-lg font-bold mb-4">Agent Information</h3>
                    <div>
                        <label className="block mb-2">Search Agent:</label>
                        <input
                            type="text"
                            value={searchAgent}
                            onChange={handleAgentSearch}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Search for agent"
                        />
                        {filteredAgents.length > 0 && (
                            <ul className="bg-white border border-gray-300 rounded-md mt-2 shadow-md max-h-40 overflow-y-auto">
                                {filteredAgents.map((agent) => (
                                    <li
                                        key={agent._id}
                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => handleAgentSelect(agent)}
                                    >
                                        {agent.name}, {agent.phoneNumber}, {agent.email}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default PropertyEdit;
