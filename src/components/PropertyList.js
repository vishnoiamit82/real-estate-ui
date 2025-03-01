import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import Pagination from '@mui/material/Pagination';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit2, Trash, RotateCcw, NotebookText, Mail, Share2 } from 'lucide-react'; // Icons
import NotesModal from "./NotesModal"; // Import the NotesModal component
import EmailModal from './EmailModal';
import EmailReplies from './EmailReplies';
import PropertyTable from './PropertyTable';



const PropertyList = () => {
    const [properties, setProperties] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [propertiesPerPage] = useState(15);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [sortKey, setSortKey] = useState('createdAt'); // Default sort key
    const [sortOrder, setSortOrder] = useState('desc'); // Default sort order
    const [filter, setFilter] = useState("all");
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
                const response = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/email-templates`);
                setEmailTemplates(response.data);
            } catch (error) {
                console.error('Error fetching templates:', error);
            }
        };
        fetchTemplates();
    }, []);

    useEffect(() => {
        console.log("Filter Changed:", filter);
        setCurrentPage(1); // Reset pagination
    }, [filter]);


    
    

    const openEmailModal = (property, agent) => {
        setSelectedPropertyForEmail(property);
        setSelectedAgent(agent);
    };

    const closeEmailModal = () => {
        setSelectedPropertyForEmail(null);
        setSelectedAgent(null);
    };

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const privacyFilteredProperties = properties.filter((property) => {
        console.log("property.createdBy:", property.createdBy, typeof property.createdBy);
        console.log("currentUser.id:", currentUser.id, typeof currentUser.id);

        if (currentUser.role === 'admin') return true;

        // Allow if the listing is public
        if (property.publicListing) return true;
        // Allow if the current user created the property
        if (property.createdBy.toString() === currentUser.id) return true;
        // Allow if the property is shared with the current user (assuming sharedWith is an array of IDs)
        if (property.sharedWith && property.sharedWith.includes(currentUser._id)) return true;
        return false;
    });

    // Inside your PropertyList or PropertyDetail component:
    const handleShareProperty = async (propertyId) => {
        try {
            const response = await axiosInstance.post(`${process.env.REACT_APP_API_BASE_URL}/properties/${propertyId}/share`);

            const { shareLink } = response.data;
            // Show the share link to the user, e.g., in a modal or toast
            alert(`Share this link: ${shareLink}`);
        } catch (error) {
            console.error('Error sharing property:', error);
            alert('Failed to generate share link.');
        }
    };



    const filteredProperties = privacyFilteredProperties
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


    useEffect(() => {
        console.log("Updated Filtered Properties Count:", filteredProperties.length);
    }, [filteredProperties]);
    



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
                const response = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/properties?include_deleted=${filter === "all"}`);
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
                    const response = await axiosInstance.get(
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
            await axiosInstance.patch(`${process.env.REACT_APP_API_BASE_URL}/properties/${id}/delete`);

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
            await axiosInstance.patch(`${process.env.REACT_APP_API_BASE_URL}/properties/${id}/restore`);

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
            const response = await axiosInstance.patch(
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
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-100 dark:bg-gray-900 p-4 rounded-md shadow-md">
                            {/* Filter Dropdown */}
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <label className="text-gray-700 dark:text-gray-300 text-sm">Filter:</label>
                    <select
                        value={filter}
                        onChange={(e) => {
                            setFilter(e.target.value);
                            setCurrentPage(1); // Reset pagination when filter changes
                        }}
                        className="w-full md:w-auto p-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Properties</option>
                        <option value="pursue">Pursue</option>
                        <option value="on_hold">On Hold</option>
                        <option value="deleted">Deleted</option>
                        <option value="undecided">Undecided</option>
                    </select>
                </div>

                
                
                {/* Search Input */}
                <div className="flex items-center gap-2 w-full md:w-1/3 relative">
                    <label className="sr-only">Search Properties</label>
                    <input
                        type="text"
                        placeholder="Search properties..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value.toLowerCase());
                            setCurrentPage(1); // Reset pagination when search query changes
                        }}
                        className="w-full p-2 pl-8 border rounded-md bg-white dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <svg className="absolute left-2 top-2 text-gray-500 dark:text-gray-400 w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
                    </svg>
                </div>
            </div>

            {/* Property Table */}
            <PropertyTable
                properties={filteredProperties}
                navigate={navigate}
                setSelectedPropertyForEmail={setSelectedPropertyForEmail}
                setSelectedAgent={setSelectedAgent}
                setSelectedPropertyForNotes={setSelectedPropertyForNotes}
                handleSort={handleSort}
                sortKey={sortKey}
                sortOrder={sortOrder}
                deleteProperty={deleteProperty} 
                restoreProperty={restoreProperty} 
                updateDecisionStatus={updateDecisionStatus} 
                handleShareProperty={handleShareProperty}
            />



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
                        <EmailReplies agentEmail={selectedAgent?.email} />
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
