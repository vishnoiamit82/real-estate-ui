import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import PropertyFields from "./PropertyFields";
import { PROPERTY_SECTION_CONFIGS } from '../config/propertySectionConfigs';
import DescriptionProcessor from './DescriptionProcessor';


const PropertyEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
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
        conversation: [],
        documents: [],
        videos: [],
        nearbySchools: [],
        publicTransport: []

        
    });

    const [agents, setAgents] = useState([]);
    const [filteredAgents, setFilteredAgents] = useState([]);
    const [searchAgent, setSearchAgent] = useState('');
    const [message, setMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [newConversation, setNewConversation] = useState('');
    const [property, setProperty] = useState(null);
    const [showDescriptionProcessor, setShowDescriptionProcessor] = useState(false);
    const [descriptionFromProcessor, setDescriptionFromProcessor] = useState('');
    
    


    const config = PROPERTY_SECTION_CONFIGS.full;

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
        console.log("handling change");
        const { name, value } = e.target;
        let updatedFormData = { ...formData, [name]: value };

        // Normalize and calculate rental yield
        if ((name === 'rental' || name === 'askingPrice') && updatedFormData.rental && updatedFormData.askingPrice) {
            // ✅ Normalize rental string: extract first numeric value from "$550-$600 per week"
            let numericRent = null;
            if (typeof updatedFormData.rental === 'string') {
                const rentMatch = updatedFormData.rental.match(/[\d,\.]+/);

                if (rentMatch) numericRent = parseFloat(rentMatch[0].replace(/,/g, ''));
            } else if (typeof updatedFormData.rental === 'number') {
                numericRent = updatedFormData.rental;
            }

            // ✅ Normalize asking price string
            const priceString = updatedFormData.askingPrice.toString().replace(/[^0-9.-]+/g, "");
            const numericPrice = parseFloat(priceString);

            if (!isNaN(numericRent) && !isNaN(numericPrice) && numericPrice > 0) {
                const yieldValue = ((numericRent * 52) / numericPrice) * 100;
                updatedFormData.rentalYield = yieldValue.toFixed(2) + "%";
            }
        }

        setFormData(updatedFormData);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const { dueDiligence, ...propertyData } = formData;
    
        // Clean any nested dueDiligence fields from the flat payload
        Object.keys(dueDiligence || {}).forEach(key => {
            if (propertyData.hasOwnProperty(`dueDiligence.${key}`)) {
                delete propertyData[`dueDiligence.${key}`];
            }
        });
    
        try {
            // Step 1: Save Due Diligence
            if (dueDiligence) {
                await axiosInstance.patch(`${process.env.REACT_APP_API_BASE_URL}/properties/${id}/due-diligence`, { dueDiligence });
            }
    
            // Step 2: Append description if used
            if (descriptionFromProcessor.trim()) {
                if (!propertyData.conversation) propertyData.conversation = [];
    
                propertyData.conversation.push({
                    content: descriptionFromProcessor,
                    timestamp: new Date().toISOString(),
                });
            }
    
            // Step 3: Update property
            await axiosInstance.put(`${process.env.REACT_APP_API_BASE_URL}/properties/${id}`, propertyData);
            setSuccessMessage('Property created successfully!');
            setShowDescriptionProcessor(false); // 👈 hide the description area
            
            
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

            <div className="mb-6">
                <button
                    onClick={() => setShowDescriptionProcessor(!showDescriptionProcessor)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    {showDescriptionProcessor ? "Cancel Description Edit" : "Edit by Property Description"}
                </button>
            </div>

            {showDescriptionProcessor && (
                <DescriptionProcessor
                    formData={formData}
                    setFormData={setFormData}
                    onMessage={setMessage}
                    onDescriptionProcessed={(desc) => setDescriptionFromProcessor(desc)}
                />
            )}



            <form onSubmit={handleSubmit} className="space-y-6">
                <PropertyFields
                    formData={formData}
                    setFormData={setFormData}
                    visibleSections={config.visibleSections}
                    readOnly={false}
                    propertyId={property?._id}
                    createdBy={property?.createdBy}
                    mode="edit"
                    onChange={handleChange}
                />

                <div className="mt-4 p-6 w-full max-w-6xl mx-auto">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                        Save Property
                    </button>
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
            </form>
        </div>
    );
};

export default PropertyEdit;
