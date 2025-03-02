import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import CreateAgentModal from './CreateAgentModal';

const PropertyForm = () => {
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
        publicListing: false,  // By default, not public
        showAddress: true  // By default, not show address
    });

    const [description, setDescription] = useState(''); // For entering property description
    const [processedDetails, setProcessedDetails] = useState(null); // To display processed data
    const [agents, setAgents] = useState([]);
    const [filteredAgents, setFilteredAgents] = useState([]);
    const [searchAgent, setSearchAgent] = useState('');
    const [message, setMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [agentOptions, setAgentOptions] = useState([]);
    const [isCreatingAgent, setIsCreatingAgent] = useState(false);


    useEffect(() => {
        // Fetch agents
        const fetchAgents = async () => {
            try {
                const response = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/agents`);
                setAgents(response.data);
                setFilteredAgents(response.data);
            } catch (error) {
                console.error('Error fetching agents:', error);
            }
        };
        fetchAgents();
    }, []);

    const handleAgentSearch = async (e) => {
        const query = e.target.value.toLowerCase();
        setSearchAgent(query);

        if (query.length > 2) {
            try {
                const response = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/agents?search=${query}`);
                setFilteredAgents(response.data);
            } catch (error) {
                console.error('Error searching agents:', error);
            }
        } else {
            setFilteredAgents([]);
        }
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

    const handleAgentCreated = (newAgent) => {
        setAgents([...agents, newAgent]);
        handleAgentSelect(newAgent);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    // const handleProcessDescription = async () => {
    //     if (!description.trim()) {
    //         setMessage('Please enter a description to process.');
    //         return;
    //     }
    
    //     try {
    //         const response = await axiosInstance.post(
    //             `${process.env.REACT_APP_API_BASE_URL}/process-description`,
    //             { description },
    //             { headers: { 'Content-Type': 'application/json' } }
    //         );
    
    //         const structuredData = response.data.structuredData;
    
    //         console.log('Structured Data:', structuredData);
    //         console.log('Agents List:', agents);
    
    //         // Match the agentName from structuredData with the agents list
    //         const matchedAgents = agents.filter((agent) => {
    //             if (!agent.name || !structuredData.agentName) {
    //                 console.warn('Missing agent name in comparison:', { agent, structuredAgentName: structuredData.agentName });
    //                 return false;
    //             }
    //             return agent.name.toLowerCase().includes(structuredData.agentName.toLowerCase());
    //         });
    
    //         console.log('Matched Agents:', matchedAgents);
    
    //         if (matchedAgents.length === 1) {
    //             // ✅ One match: auto-populate all fields and assign the agent automatically
    //             setFormData({
    //                 ...formData,
    //                 ...structuredData, // Auto-populate property fields
    //                 agentId: matchedAgents[0]._id,
    //                 agentDetails: `${matchedAgents[0].name}, ${matchedAgents[0].phoneNumber || 'N/A'}, ${matchedAgents[0].email || 'N/A'}`,
    //             });
    //             setMessage('Description processed successfully! Agent assigned automatically. Please review the details below and create property!');
    //         } else if (matchedAgents.length > 1) {
    //             // ⚠ Multiple matches: auto-populate property fields but let user select an agent
    //             setFormData({
    //                 ...formData,
    //                 ...structuredData, // Auto-populate property fields
    //                 agentId: '', // Leave agent assignment for user selection
    //                 agentDetails: '', // Clear agent details for now
    //             });
    //             setMessage('Multiple agents matched. Please select the correct agent.');
    //             setAgentOptions(matchedAgents); // Store matched agents for dropdown selection
    //         } else {
    //             // ❌ No match found: auto-populate property fields and leave agent assignment empty
    //             setFormData({
    //                 ...formData,
    //                 ...structuredData,
    //                 agentId: '', // No agent found
    //                 agentDetails: '',
    //             });
    //             setMessage('Description processed successfully! However, no matching agent was found.');
    //         }
    
    //         setProcessedDetails(structuredData);
    
    //     } catch (error) {
    //         console.error('Error processing description:', error);
    //         setMessage('Failed to process description. Please try again.');
    //     }
    // };

    const handleProcessDescription = async () => {
        if (!description.trim()) {
            alert('Please enter a description to process.');
            return;
        }

        try {
            const response = await axiosInstance.post(
                `${process.env.REACT_APP_API_BASE_URL}/process-description`,
                { description },
                { headers: { 'Content-Type': 'application/json' } }
            );

            const structuredData = response.data.structuredData;
            setFormData({
                ...formData,
                ...structuredData,
            });
            setProcessedDetails(structuredData);
        } catch (error) {
            console.error('Error processing description:', error);
            alert('Failed to process description. Please try again.');
        }
    };
    


    const handleSubmit = async (e) => {
        e.preventDefault();
        // Add description to the conversation field
        const propertyData = {
            ...formData,
            conversation: [
                {
                    content: description, // Add the description as the first conversation entry
                    timestamp: new Date(),
                },
            ],
        };
        console.log(formData)
        try {
            await axiosInstance.post(`${process.env.REACT_APP_API_BASE_URL}/properties`, propertyData);
            setSuccessMessage('Property created successfully!');
            setFormData({
                address: '',
                propertyLink: '',
                agentId: '',
                agentDetails: '',
                offerClosingDate: '',
                currentStatus: 'available',
                askingPrice: '',
                rental: '',
                rentalYield: '',
                councilRate: '',
                insurance: '',
                floodZone: '',
                bushfireZone: '',
                publicListing: false,  // By default, not public
                showAddress: true  // By default, not show address
            });
            setDescription('');
            setSearchAgent('');
        } catch (error) {
            console.error('Error creating property:', error);
            setMessage('Failed to create property. Please try again.');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">Create Property</h2>
            {successMessage && (
                <p className="mb-4 text-green-600 bg-green-100 p-2 rounded">{successMessage}</p>
            )}
            {message && <p className="mb-4 text-red-600 bg-red-100 p-2 rounded">{message}</p>}

            <div className="border rounded-md p-4 bg-gray-50">
                <h3 className="text-lg font-bold mb-4">Agent Information</h3>
                <input
                    type="text"
                    placeholder="Search for an agent"
                    value={searchAgent}
                    onChange={handleAgentSearch}
                    className="w-full p-2 border border-gray-300 rounded-md"
                />
                {filteredAgents.length > 0 && (
                    <ul className="bg-white border border-gray-300 rounded-md mt-2 shadow-md max-h-40 overflow-y-auto">
                        {filteredAgents.map((agent) => (
                            <li
                                key={agent._id}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleAgentSelect(agent)}
                            >
                                {agent.name}, {agent.email}
                            </li>
                        ))}
                    </ul>
                )}
                {filteredAgents.length === 0 && searchAgent && (
                    <button
                        onClick={() => setIsCreatingAgent(true)}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Create New Agent
                    </button>
                )}
            </div>
            {isCreatingAgent && (
                <CreateAgentModal
                    isOpen={isCreatingAgent}
                    onClose={() => setIsCreatingAgent(false)}
                    onAgentCreated={handleAgentCreated}
                />
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Process Description */}
                <div className="border rounded-md p-4 bg-gray-50">
                    <h3 className="text-lg font-bold mb-4">Process Description</h3>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Enter property description..."
                        rows="4"
                    ></textarea>
                    <button
                        type="button"
                        onClick={handleProcessDescription}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Process Description
                    </button>
                    {processedDetails && (
                        <div className="bg-gray-100 p-4 rounded-md mt-4">
                            <h4 className="text-lg font-bold">Extracted Details:</h4>
                            <pre className="mt-2 text-sm">{JSON.stringify(processedDetails, null, 2)}</pre>
                        </div>
                    )}
                </div>

                {/* Agent Information */}
                <div className="border rounded-md p-4 bg-gray-50">
                    <h3 className="text-lg font-bold mb-4">Agent Information</h3>

                    {formData.agentDetails ? (
                        (() => {
                            const [name, phone, email] = formData.agentDetails.split(', '); // Parse agentDetails string
                            return (
                                <div className="p-4 bg-gray-100 rounded-md">
                                    <p><strong>Name:</strong> {name || 'N/A'}</p>
                                    <p><strong>Phone:</strong> {phone && phone !== 'N/A' ? phone : 'N/A'}</p>
                                    <p><strong>Email:</strong> {email && email !== 'N/A' ? email : 'N/A'}</p>
                                </div>
                            );
                        })()
                    ) : (
                        <p className="text-gray-500">No agent information available.</p>
                    )}

                    {/* Show Dropdown If Multiple Agents Match */}
                    {agentOptions.length > 1 && (
                        <div className="mt-4">
                            <label className="block mb-2">Select Agent:</label>
                            <select
                                onChange={(e) => {
                                    const selectedAgent = agentOptions.find(agent => agent._id === e.target.value);
                                    if (selectedAgent) {
                                        setFormData({
                                            ...formData,
                                            agentId: selectedAgent._id || '',
                                            agentDetails: `${selectedAgent.name}, ${selectedAgent.phoneNumber || 'N/A'}, ${selectedAgent.email || 'N/A'}`,
                                        });
                                    }
                                }}
                                className="p-2 border border-gray-300 rounded-md w-full"
                            >
                                <option value="">Select an agent</option>
                                {agentOptions.map(agent => (
                                    <option key={agent._id} value={agent._id}>
                                        {agent.name} - {agent.email || 'No Email'}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* If No Agent Found, Create New Agent */}
                    {!formData.agentId && formData.agentDetails && (
                        <button
                            onClick={async () => {
                                const [name, phone, email] = formData.agentDetails.split(', ');

                                try {
                                    const response = await axiosInstance.post(`${process.env.REACT_APP_API_BASE_URL}/agents`, {
                                        name: name || 'Unknown Agent',
                                        phoneNumber: phone !== 'N/A' ? phone : '',
                                        email: email !== 'N/A' ? email : '',
                                    });

                                    if (response.data && response.data._id) {
                                        setFormData({
                                            ...formData,
                                            agentId: response.data._id,
                                        });
                                        setAgentOptions([...agentOptions, response.data]);
                                    }
                                } catch (error) {
                                    console.error('Error creating agent:', error);
                                }
                            }}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Create Agent
                        </button>
                    )}
                </div>




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
                    <div className="space-y-4">
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




                <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                    Create Property
                </button>
            </form>
        </div>
    );
};

export default PropertyForm;

