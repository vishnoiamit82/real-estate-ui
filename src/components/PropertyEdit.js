import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import PropertyFields from "./PropertyFields";

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
    const visibleSections = ["Basic Information", "Financial Information", "Property Details", "Due Diligence", "Additional Due Diligence"];
    const [property, setProperty] = useState(null);



    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/properties/${id}`);
                const propertyData = response.data;
                setFormData(propertyData);
                setProperty(propertyData);


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
        e.preventDefault();
    
        // ✅ Extract Due Diligence Data Separately
        const { dueDiligence, ...propertyData } = formData;
    
        // ✅ Remove duplicate fields from propertyData (avoids sending `dueDiligence.insurance`)
        Object.keys(dueDiligence).forEach(key => {
            if (propertyData.hasOwnProperty(`dueDiligence.${key}`)) {
                delete propertyData[`dueDiligence.${key}`];
            }
        });
    
        try {
            // ✅ Update Due Diligence Separately (PATCH)
            if (dueDiligence) {
                await axiosInstance.patch(`${process.env.REACT_APP_API_BASE_URL}/properties/${id}/due-diligence`, {
                    dueDiligence
                });
            }
    
            // ✅ Update Remaining Property Data (PUT)
            await axiosInstance.put(`${process.env.REACT_APP_API_BASE_URL}/properties/${id}`, propertyData);
    
            setSuccessMessage("Property updated successfully!");
            // navigate(`/properties/${id}`);
    
        } catch (error) {
            console.error("Error updating property:", error);
            setMessage("Failed to update property.");
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

                <div className="mt-6 p-6 bg-white border rounded-lg shadow-lg w-full max-w-6xl mx-auto">
                <PropertyFields 
                    formData={formData} 
                    setFormData={setFormData} 
                    visibleSections={visibleSections} 
                    readOnly={false} // ✅ Edit mode (Editable)
                    propertyId={property?._id}  // ✅ Pass propertyId safely
                    createdBy={property?.createdBy} // ✅ Pass createdBy safely
                />


                </div>


                <div className="mt-4 p-6  w-full max-w-6xl mx-auto">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                        Save Property
                    </button>
                    {/* Success Message (Now Below Button) */}
                    {/* Success & Error Messages */}
                    {successMessage && (
                        <p className="mt-4 text-lg text-green-700 bg-green-100 p-3 rounded-md border-l-4 border-green-500">
                            ✅ {successMessage}
                        </p>
                    )}

                    {message && (
                        <p className="mt-4 text-lg text-red-700 bg-red-100 p-3 rounded-md border-l-4 border-red-500">
                            {message}
                        </p>
                    )}
                </div>


                {/* Conversations Section */}
                {/* <div className="border rounded-md p-4 bg-gray-50">
                    <h3 className="text-lg font-bold mb-4">Conversations</h3>

                   
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
                </div> */}



                {/* Agent Information */}
                {/* <div className="border rounded-md p-4 bg-gray-50">
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
                </div> */}

                {/* Submit Button */}
                {/* <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                    Save Changes
                </button> */}
            </form>
        </div>
    );
};

export default PropertyEdit;
