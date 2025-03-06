import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import CreateAgentModal from './CreateAgentModal';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

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

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showForm, setShowForm] = useState(false);


    const navigate = useNavigate(); // ✅ Initialize navigation





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

    const propertySchemaFields = {
        "Basic Information": [
            { key: "address", label: "🏡 Address", type: "text" },
            { key: "propertyLink", label: "🔗 Property Link", type: "text" },
            { key: "propertyType", label: "🏠 Property Type", type: "text" },
            { key: "yearBuilt", label: "📅 Year Built", type: "text" },
            { key: "offMarketStatus", label: "📉 Off Market Status", type: "boolean" }

        ],
        "Financial Information": [
            { key: "askingPrice", label: "💰 Asking Price", type: "text" },
            { key: "rental", label: "🏠 Rental Price", type: "text" },
            { key: "rentalYield", label: "📈 Rental Yield", type: "text" },
            { key: "councilRate", label: "🏛️ Council Rate", type: "text" }

        ],
        "Property Details": [
            { key: "bedrooms", label: "🛏️ Bedrooms", type: "number" },
            { key: "bathrooms", label: "🛁 Bathrooms", type: "number" },
            { key: "carSpaces", label: "🚗 Car Spaces", type: "number" },
            { key: "landSize", label: "📏 Land Size", type: "text" }
        ],
        "Location & Zoning": [
            { key: "nearbySchools", label: "🏫 Nearby Schools", type: "array" },
            { key: "publicTransport", label: "🚌 Public Transport", type: "array" }
        ]

    };

    // { key: "insurance", label: "🛡️ Insurance", type: "text" }

    // { key: "floodZone", label: "🌊 Flood Zone", type: "text" },
    //         { key: "bushfireZone", label: "🔥 Bushfire Zone", type: "text" },

    // "Due Diligence": [
    //         { key: "dueDiligence.insurance", label: "🛡️ Insurance Status", type: "dropdown", options: ["pending", "completed", "failed"] },
    //         { key: "dueDiligence.floodZone", label: "🌊 Flood Zone Status", type: "dropdown", options: ["pending", "completed", "failed"] },
    //         { key: "dueDiligence.bushfireZone", label: "🔥 Bushfire Zone Status", type: "dropdown", options: ["pending", "completed", "failed"] },
    //         { key: "dueDiligence.socialHousing", label: "🏢 Social Housing Status", type: "dropdown", options: ["pending", "completed", "failed"] }
    //     ],
    //     "Status Tracking": [
    //         { key: "currentStatus", label: "📌 Current Status", type: "dropdown", options: ["available", "sold", "offer_accepted"] },
    //         { key: "decisionStatus", label: "📊 Decision Status", type: "dropdown", options: ["undecided", "pursue", "on_hold"] },
    //         { key: "propertyCondition", label: "🏚️ Property Condition", type: "text" }
    //     ]

    const Spinner = () => (
        <div className="flex justify-center items-center mt-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
    );


    const handleAgentSearch = async (e) => {
        const query = e.target.value.toLowerCase();
        setSearchAgent(query);

        if (query.length > 2) {
            setIsSearching(true); // Start tracking search

            try {
                const response = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/agents?search=${query}`);
                setFilteredAgents(response.data);

                if (response.data.length > 0) {
                    setShowCreateForm(false); // Hide button if agents exist
                } else {
                    setShowCreateForm(true); // Show button only if search completed and no match found
                }
            } catch (error) {
                console.error('Error searching agents:', error);
            } finally {
                setIsSearching(false); // Mark search as complete
            }
        } else {
            setFilteredAgents([]);
            setShowCreateForm(false);
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


    const [isCollapsed, setIsCollapsed] = useState(false); // Track collapse state

    const handleProcessDescription = async () => {
        if (!description.trim()) {
            alert('Please enter a description to process.');
            return;
        }

        setIsProcessing(true);
        setMessage('');

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
                offMarketStatus: structuredData.isOffMarket ? "yes" : "no"  // ✅ Updated to new naming
            });

            setProcessedDetails(structuredData);
            setMessage('✅ Information extracted successfully! Please review and edit if needed.');
            setShowForm(true);

        } catch (error) {
            console.error('Error processing description:', error);
            setMessage('⚠️ Failed to extract details. Please enter manually.');
            setShowForm(true);
        } finally {
            setIsProcessing(false);
        }
    };






    const handleSubmit = async (e) => {
        e.preventDefault();

        // ✅ Validate agent selection before proceeding
        if (!formData.agentId) {
            setMessage('⚠️ Please select an agent before creating the property.');
            return;
        }
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

            // ✅ Delay for 1.5 seconds to show success message before redirecting
            setTimeout(() => {
                navigate('/'); // Redirect to home page
            }, 1500);

        } catch (error) {
            console.error('Error creating property:', error);
            setMessage('Failed to create property. Please try again.');
        }
    };



    return (


        <div className="container mx-auto p-4 max-w-3xl sm:max-w-6xl">

            <h2 className="text-2xl font-bold mb-6">Create Property</h2>

            {/* Success Message */}
            {successMessage && (
                <p className="mt-4 text-md text-green-700 bg-green-50 p-3 rounded-md border-l-4 border-green-500 shadow-sm">
                    ✅ {successMessage}
                </p>
            )}

            {/* Agent Information Section */}
            <div className="mt-6 p-6 bg-white border rounded-lg shadow-lg w-full max-w-6xl mx-auto">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                    👤 Agent Information
                </h3>

                <div className="border rounded-lg p-5 bg-gray-50 shadow-md">
                    {/* Agent Search Input */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="🔍 Search for an agent"
                            value={searchAgent}
                            onChange={handleAgentSearch}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 hover:shadow-md transition"
                        />

                        {/* Agent Suggestions List */}
                        {filteredAgents.length > 0 && (
                            <ul className="absolute w-full bg-white border border-gray-300 rounded-md mt-2 shadow-lg max-h-40 overflow-y-auto z-10">
                                {filteredAgents.map((agent) => (
                                    <li
                                        key={agent._id}
                                        className="p-3 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                                        onClick={() => handleAgentSelect(agent)}
                                    >
                                        <span className="text-gray-700 font-medium">{agent.name}</span>
                                        <span className="text-gray-500 text-sm">{agent.email}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* No Agent Found - Show Create Agent Button */}
                    {showCreateForm && !isSearching && (
                        <div className="mt-4 p-4 border border-dashed border-gray-400 bg-gray-100 rounded-md text-center">
                            <p className="text-gray-600 mb-3 font-semibold">
                                No agents found. Let's create one!
                            </p>
                            <button
                                onClick={() => setIsCreatingAgent(true)}
                                className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-all duration-200"
                            >
                                ➕ Create New Agent
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {isCreatingAgent && (
                <CreateAgentModal
                    isOpen={isCreatingAgent}
                    onClose={() => setIsCreatingAgent(false)}
                    onAgentCreated={handleAgentCreated}
                />
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Property Description Section */}
                <div className="mt-4 p-6 bg-white border rounded-lg shadow-lg w-full max-w-6xl mx-auto">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        🏡 Property Description
                    </h3>

                    {/* Toggle Button to Expand/Collapse */}
                    <button
                        type="button"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="flex items-center gap-2 text-blue-500 hover:text-blue-700 text-sm font-semibold transition-all"
                    >
                        <span>{isCollapsed ? "View Description" : "Hide Description"}</span>
                        <span className={`transform transition-transform ${isCollapsed ? "rotate-0" : "rotate-180"}`}>
                            ⌄
                        </span>
                    </button>


                    {/* Show Description Only When Expanded */}
                    {!isCollapsed && (
                        <>

                            {/* Textarea for Property Description */}
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 hover:shadow-md transition"
                                placeholder="Copy and paste the property description from an agent email, real estate website, or any other source.The magic will extract the relevant details and populate the property details for you."
                                rows="5"
                            ></textarea>

                            {/* Process Description Button */}
                            <div className="flex justify-center sm:justify-start">
                                <button
                                    type="button"
                                    onClick={handleProcessDescription}
                                    className={`mt-3 w-full sm:w-auto px-6 py-3 rounded-md text-white font-semibold transition-all duration-200 
                                ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? "Processing..." : "🔍 Process Description"}
                                </button>
                            </div>
                        </>
                    )}

                    {/* Show Spinner While Processing */}
                    {isProcessing && <Spinner />}

                    {/* AI Processing Status Messages */}
                    {message && (
                        <p className={`mt-3 text-center sm:text-left text-lg ${message.includes("failed") ? "text-red-600" : "text-green-600"}`}>
                            {message}
                        </p>
                    )}
                </div>
                {showForm && (
                    <div className="mt-6 p-6 bg-white border rounded-lg shadow-lg w-full max-w-6xl mx-auto">
                        {Object.entries(propertySchemaFields).map(([section, fields]) => (
                            <div key={section} className="mt-6">
                                <h3 className="text-xl font-semibold mb-4 border-b-2 pb-2">{section}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {fields.map(({ key, label, type, options }) => (
                                        <div key={key} className="mb-4">
                                            <label className="block mb-1 font-medium">{label}:</label>

                                            {/* Text & Number Inputs */}
                                            {type === "text" || type === "number" ? (
                                                <input
                                                    type={type}
                                                    name={key}
                                                    value={formData[key] || ""}
                                                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 hover:shadow-md"
                                                />
                                            ) : null}

                                            {/* Boolean Fields as Toggle */}
                                            {type === "boolean" ? (
                                                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm">
                                                    {/* Badge for On/Off Market */}
                                                    <span className={`px-3 py-1 text-sm font-semibold rounded-md 
                                        ${formData[key] ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                                                        {formData[key] ? "Off Market" : "On Market"}
                                                    </span>

                                                    {/* Toggle Switch */}
                                                    <label className="flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData[key] || false}
                                                            onChange={() => setFormData({
                                                                ...formData,
                                                                [key]: !formData[key] // ✅ Toggle boolean value
                                                            })}
                                                            className="hidden"
                                                        />
                                                        <div className="relative w-12 h-6 bg-gray-300 rounded-full transition">
                                                            <div className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-all duration-300
                                                ${formData[key] ? "translate-x-6 bg-red-500" : "translate-x-0 bg-green-500"}`}>
                                                            </div>
                                                        </div>
                                                    </label>
                                                </div>
                                            ) : null}

                                            {/* Dropdown Inputs */}
                                            {type === "dropdown" ? (
                                                <select
                                                    name={key}
                                                    value={formData[key] || ""}
                                                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 hover:shadow-md"
                                                >
                                                    <option value="">Select</option>
                                                    {options.map((option) => (
                                                        <option key={option} value={option}>
                                                            {option}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : null}

                                            {/* Array Inputs */}
                                            {type === "array" ? (
                                                <div className="space-y-2">
                                                    {(formData[key] || []).map((item, index) => (
                                                        <div key={index} className="flex items-center gap-2">
                                                            <input
                                                                type="text"
                                                                value={item}
                                                                onChange={(e) => {
                                                                    const updatedArray = [...formData[key]];
                                                                    updatedArray[index] = e.target.value;
                                                                    setFormData({ ...formData, [key]: updatedArray });
                                                                }}
                                                                className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const updatedArray = [...formData[key]];
                                                                    updatedArray.splice(index, 1);
                                                                    setFormData({ ...formData, [key]: updatedArray });
                                                                }}
                                                                className="text-red-500 hover:text-red-700"
                                                            >
                                                                ❌
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, [key]: [...(formData[key] || []), ""] })}
                                                        className="text-blue-500 hover:text-blue-700 font-medium"
                                                    >
                                                        ➕ Add More
                                                    </button>
                                                </div>
                                            ) : null}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}



                    </div>
                )}
                {showForm && (
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
                )}

            </form>
        </div>

    );
};

export default PropertyForm;

