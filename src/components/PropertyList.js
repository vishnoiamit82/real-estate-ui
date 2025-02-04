import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from '@mui/material/Pagination';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit2, Trash, RotateCcw, NotebookText, Mail } from 'lucide-react'; // Icons
import NotesModal from "./NotesModal"; // Import the NotesModal component
import EmailModal from './EmailModal';


const PropertyList = () => {
    const [properties, setProperties] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [propertiesPerPage] = useState(15);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [sortKey, setSortKey] = useState('createdAt'); // Default sort key
    const [sortOrder, setSortOrder] = useState('desc'); // Default sort order
    const [filter, setFilter] = useState("pursue");
    const indexOfLastProperty = currentPage * propertiesPerPage;
    const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [conversations, setConversations] = useState([]);

    const [selectedPropertyForEmail, setSelectedPropertyForEmail] = useState(null);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [emailTemplates, setEmailTemplates] = useState([]);

    

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/email-templates`);
                setEmailTemplates(response.data);
            } catch (error) {
                console.error('Error fetching templates:', error);
            }
        };
        fetchTemplates();
    }, []);
    
    const openEmailModal = (property, agent) => {
        setSelectedPropertyForEmail(property);
        setSelectedAgent(agent);
    };

    const closeEmailModal = () => {
        setSelectedPropertyForEmail(null);
        setSelectedAgent(null);
    };

    const filteredProperties = properties
        .filter((property) => {
            // If filter is "all", include all properties (both deleted & non-deleted)
            if (filter === "all") return true;

            // Exclude deleted properties unless explicitly filtering for "deleted"
            if (filter !== "deleted" && property.is_deleted) return false;

            // Apply Decision Status Filters
            if (filter === "active") return !property.is_deleted;
            if (filter === "deleted") return property.is_deleted;
            if (filter === "undecided") return property.decisionStatus === "undecided";
            if (filter === "pursue") return property.decisionStatus === "pursue";
            if (filter === "on_hold") return property.decisionStatus === "on_hold";

            return true;
        })
        .filter((property) => {
            // Convert values to lowercase safely to avoid "undefined" errors
            const address = property.address?.toLowerCase() || "";
            const agentName = property.agentId?.name?.toLowerCase() || "";

            return address.includes(searchQuery) || agentName.includes(searchQuery);
        });




    const [selectedPropertyForNotes, setSelectedPropertyForNotes] = useState(null);

    const openNotesModal = (property) => {
        setSelectedPropertyForNotes(property);
    };

    const closeNotesModal = () => {
        setSelectedPropertyForNotes(null);
    };


    const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

    // Fetch properties from the backend
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/properties?include_deleted=${filter === "all"}`);
                setProperties(response.data);
            } catch (error) {
                console.error('Error fetching properties:', error);
            }
        };
        fetchProperties();
    }, []);


    // Fetch conversations for the selected property
    useEffect(() => {
        if (selectedProperty) {
            const fetchConversations = async () => {
                try {
                    const response = await axios.get(
                        `${process.env.REACT_APP_API_BASE_URL}/properties/${selectedProperty._id}/conversations`
                    );
                    setConversations(response.data);
                } catch (error) {
                    console.error("Error fetching conversations:", error);
                }
            };
            fetchConversations();
        }
    }, [selectedProperty]);

    const handleSort = (key) => {
        if (sortKey === key) {
            // Toggle sort order if the same key is clicked
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            // Set new sort key and default to ascending order
            setSortKey(key);
            setSortOrder('asc');
        }
    };



    const sortedProperties = [...filteredProperties].sort((a, b) => {
        const valueA = a[sortKey] || ""; // Default to empty string if value is missing
        const valueB = b[sortKey] || "";

        if (typeof valueA === "string") {
            // Handle string sorting
            return sortOrder === "asc"
                ? valueA.localeCompare(valueB)
                : valueB.localeCompare(valueA);
        } else if (!isNaN(Date.parse(valueA))) {
            // Handle date sorting
            return sortOrder === "asc"
                ? new Date(valueA || "1970-01-01") - new Date(valueB || "1970-01-01")
                : new Date(valueB || "1970-01-01") - new Date(valueA || "1970-01-01");
        } else if (typeof valueA === "number") {
            // Handle number sorting
            return sortOrder === "asc"
                ? (valueA || 0) - (valueB || 0)
                : (valueB || 0) - (valueA || 0);
        }

        return 0; // Default case for unsupported types
    });



    const currentProperties = sortedProperties.slice(
        indexOfFirstProperty,
        indexOfLastProperty
    );



    // Handle search
    const handleSearch = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };




    // Soft delete property
    const deleteProperty = async (id) => {
        try {
            // Send a PATCH request for soft delete
            await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/properties/${id}/delete`);

            // Update local state to reflect the soft delete
            setProperties(properties.map((property) =>
                property._id === id ? { ...property, is_deleted: true } : property
            ));

            setMessage('Property marked as deleted successfully.');
        } catch (error) {
            console.error('Error marking property as deleted:', error);
            setMessage('Failed to mark property as deleted.');
        }
    };


    const restoreProperty = async (id) => {
        try {
            // Call the restore endpoint
            await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/properties/${id}/restore`);

            // Update the property list to reflect the restored property
            setProperties(
                properties.map((property) =>
                    property._id === id ? { ...property, is_deleted: false } : property
                )
            );

            setMessage('Property restored successfully.');
        } catch (error) {
            console.error('Error restoring property:', error);
            setMessage('Failed to restore property.');
        }
    };

    const updateDecisionStatus = async (id, status) => {
        try {
            const response = await axios.patch(
                `${process.env.REACT_APP_API_BASE_URL}/properties/${id}/decision`,
                { decisionStatus: status }
            );

            // Update the property list in local state
            setProperties(
                properties.map((property) =>
                    property._id === id ? { ...property, decisionStatus: status } : property
                )
            );

            // Dynamically set the success message
            let statusMessage = "";
            if (status === "pursue") statusMessage = "pursued";
            else if (status === "on_hold") statusMessage = "put on hold";
            else if (status === "undecided") statusMessage = "reset to undecided";

            setMessage(`Property marked as ${statusMessage} successfully.`);
        } catch (error) {
            console.error("Error updating decision status:", error);
            setMessage("Failed to update decision status. Please try again.");
        }
    };






    return (
        <div className="container mx-auto p-6">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Property Summary</h2>
                <div>
                    <button
                        onClick={() => navigate('/add-property')}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 mr-2"
                    >
                        Create New Property
                    </button>
                    <button
                        onClick={() => navigate('/add-agent')}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Add Sales Agent
                    </button>
                </div>
            </div>

            {/* Display Messages */}
            {message && <p className="text-green-600">{message}</p>}

            {/* Filters Section */}
            <div className="flex flex-col md:flex-row gap-6 mb-6 items-center justify-between">
                {/* Property Status Filters */}
                <div className="flex flex-col">
                    <span className="text-gray-600 font-semibold mb-2">Property Status</span>
                    <div className="flex bg-gray-100 p-1 rounded-lg shadow-sm">
                        <button
                            onClick={() => setFilter("undecided")}
                            className={`px-6 py-2 rounded-md transition-colors duration-300 text-sm font-medium ${filter === "undecided" ? "bg-blue-500 text-white shadow-md" : "bg-white text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            Undecided
                        </button>
                        <button
                            onClick={() => setFilter("deleted")}
                            className={`px-6 py-2 rounded-md transition-colors duration-300 text-sm font-medium ${filter === "deleted" ? "bg-red-500 text-white shadow-md" : "bg-white text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            Deleted
                        </button>
                        <button
                            onClick={() => setFilter("all")}
                            className={`px-6 py-2 rounded-md transition-colors duration-300 text-sm font-medium ${filter === "all" ? "bg-gray-500 text-white shadow-md" : "bg-white text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            All
                        </button>
                    </div>
                </div>

                {/* Decision Status Filters */}
                <div className="flex flex-col">
                    <span className="text-gray-600 font-semibold mb-2">Decision Status</span>
                    <div className="flex bg-gray-100 p-1 rounded-lg shadow-sm">
                        <button
                            onClick={() => setFilter("pursue")}
                            className={`px-6 py-2 rounded-md transition-colors duration-300 text-sm font-medium ${filter === "pursue" ? "bg-green-500 text-white shadow-md" : "bg-white text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            Pursue
                        </button>
                        <button
                            onClick={() => setFilter("on_hold")}
                            className={`px-6 py-2 rounded-md transition-colors duration-300 text-sm font-medium ${filter === "on_hold" ? "bg-yellow-500 text-white shadow-md" : "bg-white text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            On Hold
                        </button>
                    </div>
                </div>

                {/* Search Bar (Property & Agent) */}
                <div className="relative w-full md:w-1/3">
                    <input
                        type="text"
                        placeholder="Search by property address or agent name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
                        className="w-full p-3 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {/* Search Icon */}
                    <svg
                        className="absolute left-3 top-3 text-gray-500 w-5 h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
                    </svg>
                </div>
            </div>




            {/* Property Table */}
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">

                        <th className="border border-gray-300 p-2 text-left">Decision status</th>
                        <th className="border border-gray-300 p-2 text-left">Address</th>
                        <th className="border border-gray-300 p-2 text-left">Notes</th>
                        <th
                            className="border border-gray-300 p-2 text-left cursor-pointer"
                            onClick={() => handleSort('offerClosingDate')}
                        >
                            Offer Closing Date {sortKey === 'offerClosingDate' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </th>
                        <th className="border border-gray-300 p-2 text-left">Availability</th>
                        <th className="border border-gray-300 p-2 text-left">Agent Name</th>
                        <th className="border border-gray-300 p-2 text-left">Asking Price</th>
                        <th
                            className="border border-gray-300 p-2 text-left cursor-pointer"
                            onClick={() => handleSort('createdAt')}
                        >
                            Created At {sortKey === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </th>
                        <th className="border border-gray-300 p-2 text-left">Rental Yield</th>
                        <th className="border border-gray-300 p-2 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentProperties.length === 0 ? (
                        <tr>
                            <td colSpan="8" className="text-center p-4">No properties found.</td>
                        </tr>
                    ) : (
                        currentProperties.map((property) => (
                            <tr
                                key={property._id}
                                className={`border-t border-gray-300 ${property.is_deleted ? "bg-gray-100" : ""
                                    }`}
                                onClick={() => setSelectedProperty(property)}
                            >

                                <td className="p-2">
                                    {property.decisionStatus === "pursue" && (
                                        <span className="text-green-600 font-bold">Pursue</span>
                                    )}
                                    {property.decisionStatus === "on_hold" && (
                                        <span className="text-yellow-600 font-bold">On Hold</span>
                                    )}
                                    {property.decisionStatus === "undecided" && (
                                        <span className="text-gray-600">Undecided</span>
                                    )}
                                </td>


                                {/* Address */}
                                <td className="p-2">
                                    {property.propertyLink ? (
                                        <a
                                            href={property.propertyLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 underline hover:text-blue-700"
                                        >
                                            {property.address || "N/A"}
                                        </a>
                                    ) : (
                                        <span>{property.address || "N/A"}</span>
                                    )}
                                </td>

                                {/* Quick Notes Button */}
                                <button
                                    onClick={() => openNotesModal(property)}
                                    className="px-2 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 flex items-center"
                                >
                                    <NotebookText size={16} />
                                </button>

                                <button
                                    onClick={() => openEmailModal(property, property.agentId)}
                                    className="px-2 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 flex items-center"
                                >
                                    <Mail size={16} />
                                </button>



                                {/* Offer Closing Date */}
                                <td className="p-2">
                                    {property.offerClosingDate
                                        ? new Date(property.offerClosingDate).toLocaleDateString()
                                        : "N/A"}
                                </td>

                                {/* Availability */}
                                <td className="p-2">
                                    {property.currentStatus === "available"
                                        ? "Available"
                                        : "Sold"}
                                </td>

                                {/* Agent Name */}
                                <td className="p-2">
                                    <a
                                        href={`/agents/${property.agentId?._id}`}
                                        className="text-blue-500 underline hover:text-blue-700"
                                    >
                                        {property.agentId?.name || "N/A"}
                                    </a>
                                </td>

                                {/* Asking Price */}
                                <td className="p-2">{property.askingPrice || "N/A"}</td>

                                {/* Created At */}
                                <td className="p-2">
                                    {property.createdAt
                                        ? new Date(property.createdAt).toLocaleString()
                                        : "N/A"}
                                </td>

                                {/* Rental Value | Rental Yield Column */}
                                <td className="p-2">
                                    {property.rental ? property.rental : "N/A"}
                                    {" | "}
                                    {property.rentalYield ? property.rentalYield : "N/A"}
                                </td>

                                {/* Actions */}

                                <td className="p-2 flex space-x-2">
                                    {/* View Property */}
                                    <button
                                        onClick={() => navigate(`/properties/${property._id}`)}
                                        className="px-2 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 flex items-center"
                                    >
                                        <Eye size={16} />
                                    </button>

                                    {/* Edit Property */}
                                    <button
                                        onClick={() => navigate(`/edit-property/${property._id}`)}
                                        className="px-2 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
                                    >
                                        <Edit2 size={16} />
                                    </button>

                                    {/* Conditional Actions: Delete or Restore */}
                                    {property.is_deleted ? (
                                        // Restore Button
                                        <button
                                            onClick={() => restoreProperty(property._id)}
                                            className="px-2 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center"
                                        >
                                            <RotateCcw size={16} />
                                        </button>
                                    ) : (
                                        // Delete Button
                                        <button
                                            onClick={() => deleteProperty(property._id)}
                                            className="px-2 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center"
                                        >
                                            <Trash size={16} />
                                        </button>
                                    )}

                                    <button
                                        onClick={() => updateDecisionStatus(property._id, "pursue")}
                                        className="px-2 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                                    >
                                        Pursue
                                    </button>


                                    <button
                                        onClick={() => updateDecisionStatus(property._id, "on_hold")}
                                        className="px-2 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                                    >
                                        Hold
                                    </button>
                                </td>


                            </tr>
                        ))
                    )}
                </tbody>

            </table>


            {selectedPropertyForNotes && (
                <NotesModal property={selectedPropertyForNotes} onClose={closeNotesModal} />
            )}


            {selectedPropertyForEmail && selectedAgent && (
                <EmailModal
                    property={selectedPropertyForEmail}
                    agent={selectedAgent}
                    templates={emailTemplates}
                    onClose={closeEmailModal}
                />
            )}


            {/* Conversation Panel */}
            <div className="mt-4 border border-gray-300 rounded-md p-4">
                {selectedProperty ? (
                    <>
                        <h3 className="text-xl font-bold">
                            Conversations for {selectedProperty.address}
                        </h3>
                        <div className="overflow-y-auto h-64">
                            {conversations.length > 0 ? (
                                conversations.map((conv, idx) => (
                                    <div key={idx} className="p-2 border-b">
                                        <p className="font-bold">{conv.sender}</p>
                                        <p>{conv.content}</p>
                                        <span className="text-xs text-gray-500">
                                            {new Date(conv.timestamp).toLocaleString()}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p>No conversations available.</p>
                            )}
                        </div>
                    </>
                ) : (
                    <p className="text-gray-500">Select a property to view conversations.</p>
                )}
            </div>

            {/* Pagination */}
            <div className="mt-4 flex justify-center">
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(event, value) => setCurrentPage(value)}
                    variant="outlined"
                    shape="rounded"
                />
            </div>
        </div >

    );
};

export default PropertyList;
