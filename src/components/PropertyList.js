import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import Pagination from '@mui/material/Pagination';
import { useNavigate } from 'react-router-dom';
import NotesModal from './NotesModal';
import EmailModal from './EmailModal';
import PropertyCardList from './PropertyTable';
import { PlusCircle, UserPlus, Filter, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'react-toastify';

const PropertySourcingPage = () => {
    const [createdProperties, setCreatedProperties] = useState([]);
    const [savedProperties, setSavedProperties] = useState([]);
    const [currentFilter, setCurrentFilter] = useState('active');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortKey, setSortKey] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [selectedPropertyForNotes, setSelectedPropertyForNotes] = useState(null);
    const [selectedPropertyForEmail, setSelectedPropertyForEmail] = useState(null);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [emailTemplates, setEmailTemplates] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [message, setMessage] = useState('');
    const propertiesPerPage = 12;
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('created'); // default to Created tab



    useEffect(() => {
        fetchCreatedProperties();
        fetchSavedProperties();
        fetchEmailTemplates();
    }, []);

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log("current User in Property List", currentUser)

    const fetchCreatedProperties = async () => {
        try {
            const response = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/properties?mine=true`);
            setCreatedProperties(response.data.map(p => ({ ...p, source: 'created' })));
        } catch (error) {
            console.error('Error fetching created properties:', error);
        }
    };

    const deleteSavedProperty = async (savedId) => {
        try {
            await axiosInstance.delete(`${process.env.REACT_APP_API_BASE_URL}/saved-properties/${savedId}`);
            toast.success("Property removed from your saved list.");
            fetchSavedProperties(); // refresh list
        } catch (error) {
            console.error("Error deleting saved property:", error);
            toast.error("Failed to remove saved property.");
        }
    };


    const fetchSavedProperties = async () => {
        try {
            const response = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/saved-properties`);

            // No transformation needed anymore — backend is already returning clean enriched objects
            setSavedProperties(response.data);

        } catch (error) {
            console.error('Error fetching saved properties:', error);
        }
    };


    const fetchEmailTemplates = async () => {
        try {
            const response = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/email-templates`);
            setEmailTemplates(response.data);
        } catch (error) {
            console.error('Error fetching email templates:', error);
        }
    };

    const handlePursueCommunityProperty = async (property) => {
        try {
          let savedId = property.savedId;
      
          // 1. Auto-save if not already saved
          if (!savedId || property.source !== 'saved') {
            const response = await axiosInstance.post(`${process.env.REACT_APP_API_BASE_URL}/saved-properties`, {
              communityPropertyId: property._id,
            });
      
            savedId = response.data._id;
          }
      
          // 2. Update decision status
          await axiosInstance.patch(`${process.env.REACT_APP_API_BASE_URL}/saved-properties/${savedId}/decision`, {
            decisionStatus: 'pursue',
          });
      
          toast.success('Marked as pursued!');
        } catch (error) {
          console.error('Error pursuing community property:', error);
          toast.error('Failed to pursue property.');
        }
      };


    const getFilteredProperties = () => {
        const all = [...createdProperties, ...savedProperties];
        let filtered = all;

        if (currentFilter !== 'all') {
            filtered = filtered.filter(property => {
                if (currentFilter === 'deleted') return property.is_deleted;
                if (currentFilter === 'undecided') return property.decisionStatus === 'undecided';
                if (currentFilter === 'pursue') return property.decisionStatus === 'pursue';
                if (currentFilter === 'on_hold') return property.decisionStatus === 'on_hold';
                if (currentFilter === 'active') return !property.is_deleted;
                return true;
            });
        }

        return filtered.filter(property => {
            const address = property.address?.toLowerCase() || '';
            const agent = property.agentId?.name?.toLowerCase() || '';
            return address.includes(searchQuery) || agent.includes(searchQuery);
        }).sort((a, b) => {
            const valA = a[sortKey] || '';
            const valB = b[sortKey] || '';
            if (typeof valA === 'string') return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            if (!isNaN(Date.parse(valA))) return sortOrder === 'asc' ? new Date(valA) - new Date(valB) : new Date(valB) - new Date(valA);
            if (typeof valA === 'number') return sortOrder === 'asc' ? valA - valB : valB - valA;
            return 0;
        });
    };

    const paginatedProperties = getFilteredProperties().slice(
        (currentPage - 1) * propertiesPerPage,
        currentPage * propertiesPerPage
    );

    const totalPages = Math.ceil(getFilteredProperties().length / propertiesPerPage);

    const handleUpdateDecisionStatus = async (property, status) => {
        try {
            if (property.source === 'saved') {
                await axiosInstance.patch(`${process.env.REACT_APP_API_BASE_URL}/saved-properties/${property.savedId}/decision`, { decisionStatus: status });
                fetchSavedProperties();
            } else {
                await axiosInstance.patch(`${process.env.REACT_APP_API_BASE_URL}/properties/${property._id}/decision`, { decisionStatus: status });
                fetchCreatedProperties();
            }
            setMessage(`Property marked as ${status} successfully.`);
        } catch (error) {
            console.error('Failed to update decision status:', error);
            setMessage('Failed to update decision status.');
        }
    };

    const deleteProperty = async (id) => {
        try {
            await axiosInstance.patch(`${process.env.REACT_APP_API_BASE_URL}/properties/${id}/delete`);
            setMessage('Property marked as deleted successfully.');
            fetchCreatedProperties();
        } catch (error) {
            console.error('Error deleting property:', error);
            setMessage('Failed to delete property.');
        }
    };

    const restoreProperty = async (id) => {
        try {
            await axiosInstance.patch(`${process.env.REACT_APP_API_BASE_URL}/properties/${id}/restore`);
            setMessage('Property restored successfully.');
            fetchCreatedProperties();
        } catch (error) {
            console.error('Error restoring property:', error);
            setMessage('Failed to restore property.');
        }
    };

    const handleShareProperty = async (propertyId) => {
        try {
            const response = await axiosInstance.post(`${process.env.REACT_APP_API_BASE_URL}/properties/${propertyId}/share`);
            const { shareLink } = response.data;
            await navigator.clipboard.writeText(shareLink);
            toast.success(
                <>
                    🔗 Link copied to clipboard!<br />
                    <span style={{ fontSize: '0.85rem' }}>{shareLink}</span>
                </>
            );
        } catch (error) {
            console.error('Error generating share link:', error);
            toast.error('❌ Failed to generate share link.');
        }
    };

    const handleShareToCommunity = async (propertyId) => {
        try {
            await axiosInstance.patch(`${process.env.REACT_APP_API_BASE_URL}/properties/${propertyId}/share-to-community`);
            toast.success('✅ Property shared to community!');
            fetchCreatedProperties();
        } catch (error) {
            console.error('Error sharing to community:', error);
            toast.error('❌ Failed to share property to community.');
        }
    };

    const handleUnshareFromCommunity = async (propertyId) => {
        try {
            await axiosInstance.patch(`${process.env.REACT_APP_API_BASE_URL}/properties/${propertyId}/unshare-from-community`);
            toast.success('Property unshared from community!');
            fetchCreatedProperties();
        } catch (error) {
            console.error('Error unsharing from community:', error);
            toast.error('Failed to unshare property.');
        }
    };


    useEffect(() => {
        if (selectedProperty) {
            const fetchConversations = async () => {
                try {
                    const response = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/properties/${selectedProperty._id}/conversations`);
                    setConversations(response.data);
                } catch (error) {
                    console.error('Error fetching conversations:', error);
                }
            };
            fetchConversations();
        }
    }, [selectedProperty]);

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center">
                <h2 className="text-2xl font-bold mb-4">📁 Property Sourcing</h2>
                <div className="flex space-x-3">
                    <button
                        onClick={() => navigate('/add-property')}
                        className="flex items-center px-5 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm shadow-md"
                    >
                        <PlusCircle className="w-5 h-5 mr-2" /> Create Property
                    </button>
                    <button
                        onClick={() => navigate('/add-agent')}
                        className="flex items-center px-5 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm shadow-md"
                    >
                        <UserPlus className="w-5 h-5 mr-2" /> Add Sales Agent
                    </button>
                </div>
            </div>

            {/* Filters, Search, Sort */}
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-600" />
                        <label className="text-sm">Filter:</label>
                        <select
                            value={currentFilter}
                            onChange={(e) => {
                                setCurrentFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="px-3 py-2 border rounded-lg bg-white border-gray-300"
                        >
                            <option value="active">Active Properties</option>
                            <option value="pursue">Pursue</option>
                            <option value="on_hold">On Hold</option>
                            <option value="undecided">Undecided</option>
                            <option value="all">All Properties</option>
                            <option value="deleted">Deleted Only</option>
                        </select>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search by address or agent..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value.toLowerCase());
                                setCurrentPage(1);
                            }}
                            className="w-full p-2 pl-10 border rounded-lg bg-white border-gray-300"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-sm">Sort by:</label>
                        <select
                            value={sortKey}
                            onChange={(e) => setSortKey(e.target.value)}
                            className="px-2 py-2 border rounded-md"
                        >
                            <option value="createdAt">Created Date</option>
                            <option value="offerClosingDate">Offer Closing Date</option>
                            <option value="askingPrice">Price</option>
                            <option value="rentalYield">Rental Yield</option>
                        </select>

                        <button
                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                            className="p-2 border rounded-md"
                        >
                            {sortOrder === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Property Card Tabs */}
            <div className="mt-6">
                {/* Tab Buttons */}
                <div className="flex space-x-4 border-b border-gray-300 mb-4">
                    <button
                        onClick={() => setActiveTab('created')}
                        className={`px-4 py-2 font-medium border-b-2 transition ${activeTab === 'created' ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-blue-500'
                            }`}
                    >

                        <span title="Only visible to you unless you share it with community.">
                            🔒 My Created Properties (Private)
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('saved')}
                        className={`px-4 py-2 font-medium border-b-2 transition ${activeTab === 'saved' ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-blue-500'
                            }`}
                    >
                        🌍 Saved from Community
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'created' ? (
                    getFilteredProperties()
                        .filter(prop => prop.source === 'created').length > 0 ? (
                        <PropertyCardList
                            properties={getFilteredProperties().filter(prop => prop.source === 'created')}
                            navigate={navigate}
                            updateDecisionStatus={(property, status) => handleUpdateDecisionStatus(property, status)}
                            setSelectedPropertyForEmail={setSelectedPropertyForEmail}
                            setSelectedAgent={setSelectedAgent}
                            setSelectedPropertyForNotes={setSelectedPropertyForNotes}
                            handleShareProperty={handleShareProperty}
                            handleShareToCommunity={handleShareToCommunity}
                            handleUnshareFromCommunity={handleUnshareFromCommunity}
                            deleteProperty={deleteProperty}
                            restoreProperty={restoreProperty}
                            deleteSavedProperty={deleteSavedProperty}
                            currentUser={currentUser}
                        />
                    ) : (
                        <div className="text-gray-600 text-sm leading-relaxed border border-dashed border-gray-300 p-5 rounded-md bg-gray-50 shadow-sm">
                            <p className="font-semibold text-gray-700 text-base mb-2">You haven't created any properties yet.</p>

                            <p>
                                🚀 Our goal is to help you manage <strong>end-to-end property sourcing</strong> — from discovery to sharing, shortlisting, email conversations, due diligence and beyond.
                            </p>

                            <p className="mt-2">
                                You can easily <strong>copy-paste property details</strong> from SMS, WhatsApp, Facebook messages, Domain, RealEstate.com.au, or any other source — and turn them into structured listings in seconds.
                            </p>

                            <p className="mt-2">
                                ✉️ Once added, you can share properties with the community, manage notes, track decision status, or even send emails to agents <strong>directly from the app</strong>.
                            </p>

                            <button
                                onClick={() => navigate('/add-property')}
                                className="mt-4 inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition"
                            >
                                ➕ Add Your First Property
                            </button>

                            <p className="mt-3 text-sm text-gray-500">
                                Need inspiration? <span onClick={() => navigate('/community-board')} className="text-blue-600 hover:underline cursor-pointer">Explore what others are sharing →</span>
                            </p>

                        </div>


                    )
                ) : getFilteredProperties().filter(prop => prop.source === 'saved').length > 0 ? (
                    <PropertyCardList
                        properties={getFilteredProperties().filter(prop => prop.source === 'saved')}
                        navigate={navigate}
                        updateDecisionStatus={(property, status) => handleUpdateDecisionStatus(property, status)}
                        setSelectedPropertyForEmail={setSelectedPropertyForEmail}
                        setSelectedAgent={setSelectedAgent}
                        setSelectedPropertyForNotes={setSelectedPropertyForNotes}
                        handleShareProperty={handleShareProperty}
                        handleShareToCommunity={handleShareToCommunity}
                        handleUnshareFromCommunity={handleUnshareFromCommunity}
                        deleteProperty={deleteProperty}
                        restoreProperty={restoreProperty}
                        deleteSavedProperty={deleteSavedProperty}
                        handlePursueCommunityProperty={handlePursueCommunityProperty}
                        currentUser={currentUser}
                    />
                ) : (
                    <p className="text-gray-500 text-sm">No saved properties from community yet.</p>
                )}

            </div>


            {/* Notes Modal */}
            {selectedPropertyForNotes && (
                <NotesModal property={selectedPropertyForNotes} onClose={() => setSelectedPropertyForNotes(null)} />
            )}

            {/* Email Modal */}
            {selectedPropertyForEmail && selectedAgent && (
                <EmailModal
                    property={selectedPropertyForEmail}
                    agent={selectedAgent}
                    templates={emailTemplates}
                    onClose={() => {
                        setSelectedPropertyForEmail(null);
                        setSelectedAgent(null);
                    }}
                />
            )}

            {/* Pagination */}
            <div className="mt-6 flex justify-center">
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(e, value) => setCurrentPage(value)}
                    variant="outlined"
                    shape="rounded"
                />
            </div>
        </div>
    );
};

export default PropertySourcingPage;

