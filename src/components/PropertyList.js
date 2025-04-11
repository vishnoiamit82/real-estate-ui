import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import Pagination from '@mui/material/Pagination';
import { useNavigate } from 'react-router-dom';
import NotesModal from './NotesModal';
import EmailModal from './EmailModal';
import PropertyCardList from './PropertyTable';
import { PlusCircle, UserPlus, Filter, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'react-toastify';
import PropertyFilterBar from './PropertyFilterBar';
import LoadingSpinner from './LoadingSpinner';
import SharedFilters from './SharedFilters';



const PropertySourcingPage = () => {

    const [propertyTypeFilter, setPropertyTypeFilter] = useState('active');
    const [viewMode, setViewMode] = useState('card');

    const [aiResults, setAiResults] = useState(null);
    const [searchMode, setSearchMode] = useState('normal');
    const [aiSearchActive, setAiSearchActive] = useState(false);
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
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('created'); // default to Created tab

    const [loadingCreated, setLoadingCreated] = useState(true);
    const [loadingSaved, setLoadingSaved] = useState(true);
    const [totalPagesCreated, setTotalPagesCreated] = useState(1);
    const [totalPagesSaved, setTotalPagesSaved] = useState(1);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [postedWithinDays, setPostedWithinDays] = useState(10);


    const propertiesPerPage = 12;

    const resetFilters = () => {
        setMinPrice('');
        setMaxPrice('');
        setPostedWithinDays(10);
        setSearchQuery('');
        setCurrentPage(1);
    };






    useEffect(() => {
        fetchCreatedProperties();
        fetchSavedProperties();
        fetchEmailTemplates();
        setCurrentPage(1);
    }, [currentFilter]);

    useEffect(() => {
        if (activeTab === 'created') {
            fetchCreatedProperties();
        } else {
            fetchSavedProperties();
        }
        setCurrentPage(1);
    }, [currentFilter]);

    useEffect(() => {
        if (activeTab === 'created') {
            fetchCreatedProperties();
        } else {
            fetchSavedProperties();
        }
    }, [currentPage, activeTab]);

    const getStatusQueryFromFilter = (filter) => {
        switch (filter) {
            case 'pursue':
                return 'pursue';
            case 'on_hold':
                return 'on_hold';
            case 'undecided':
                return 'undecided';
            case 'active':
                return 'pursue,undecided';
            case 'all':
                return 'pursue,undecided,on_hold,deleted';
            default:
                return ''; // 'all' or 'deleted'
        }
    };

    const fetchCreatedProperties = async () => {
        setLoadingCreated(true);
        try {
            const statusQuery = getStatusQueryFromFilter(currentFilter);
            const isDeleted = currentFilter === 'deleted' ? 'true' : 'false';

            const queryParams = new URLSearchParams();
            queryParams.append('mine', 'true');
            queryParams.append('is_deleted', isDeleted);
            queryParams.append('limit', propertiesPerPage);
            queryParams.append('page', currentPage);
            if (statusQuery) queryParams.append('status', statusQuery);

            const response = await axiosInstance.get(
                `${process.env.REACT_APP_API_BASE_URL}/properties?${queryParams.toString()}`
            );

            const result = response.data;
            setCreatedProperties(Array.isArray(result) ? result : result.data.map((p) => ({ ...p, source: 'created' })));
            if (!Array.isArray(result)) {
                setTotalPagesCreated(result.totalPages || 1);
            }
        } catch (error) {
            console.error('Error fetching created properties:', error);
        } finally {
            setLoadingCreated(false);
        }
    };




    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log("current User in Property List", currentUser)

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
        setLoadingSaved(true);
        try {
            const response = await axiosInstance.get(
                `${process.env.REACT_APP_API_BASE_URL}/saved-properties?limit=${propertiesPerPage}&page=${currentPage}`
            );

            const result = response.data;
            setSavedProperties(Array.isArray(result) ? result : result.data.map((p) => ({ ...p, source: 'saved' })));
            if (!Array.isArray(result)) {
                setTotalPagesSaved(result.totalPages || 1);
            }
        } catch (error) {
            console.error('Error fetching saved properties:', error);
        } finally {
            setLoadingSaved(false);
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

        // NEW: filter by address or agent name
        filtered = filtered.filter(property => {
            const address = property.address?.toLowerCase() || '';
            const agent = property.agentId?.name?.toLowerCase() || '';
            return address.includes(searchQuery) || agent.includes(searchQuery);
        });

        // ✅ NEW: price filtering
        filtered = filtered.filter((property) => {
            const price = property.askingPriceMin || 0;
            return (!minPrice || price >= Number(minPrice)) &&
                (!maxPrice || price <= Number(maxPrice));
        });

        // ✅ NEW: postedWithin filtering (days)
        filtered = filtered.filter((property) => {
            const created = new Date(property.createdAt);
            const now = new Date();
            const daysAgo = (now - created) / (1000 * 60 * 60 * 24);
            return daysAgo <= postedWithinDays;
        });

        return filtered.sort((a, b) => {
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

    const visibleProperties = aiSearchActive && aiResults
        ? aiResults
        : getFilteredProperties().filter((prop) => prop.source === activeTab);


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
            <PropertyFilterBar
                currentFilter={currentFilter}
                setCurrentFilter={setCurrentFilter}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                sortKey={sortKey}
                setSortKey={setSortKey}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                setCurrentPage={setCurrentPage}
                viewMode={viewMode}
                setViewMode={setViewMode}
                showViewToggle={true}
                searchMode={searchMode}
                setSearchMode={setSearchMode}
                aiSearchActive={aiSearchActive}
                setAiSearchActive={setAiSearchActive}
                onAiSearch={(results) => {
                    if (results) {
                        setAiSearchActive(true);
                        setAiResults(results);
                    } else {
                        setAiSearchActive(false);
                        setAiResults(null);
                    }
                }}
                filterOptions={[
                    { value: 'active', label: 'Active Properties' },
                    { value: 'pursue', label: 'Pursue' },
                    { value: 'on_hold', label: 'On Hold' },
                    { value: 'undecided', label: 'Undecided' },
                    { value: 'all', label: 'All Properties' },
                    { value: 'deleted', label: 'Deleted Only' },
                ]}
            />

            <SharedFilters
                minPrice={minPrice}
                maxPrice={maxPrice}
                postedWithinDays={postedWithinDays}
                setMinPrice={setMinPrice}
                setMaxPrice={setMaxPrice}
                setPostedWithinDays={setPostedWithinDays}
                onReset={resetFilters}
                currentPage={currentPage}
                limit={propertiesPerPage}
                aiSearchActive={aiSearchActive}
                totalCount={getFilteredProperties().length} // filtered based on all filters
                allCount={createdProperties.length + savedProperties.length}
            />





            {/* Property Card Tabs */}
            <div className="mt-6">
                {/* Tab Buttons */}
                <div className="flex space-x-4 border-b border-gray-300 mb-4">
                    <button
                        onClick={() => setActiveTab('created')}
                        className={`px-4 py-2 font-medium border-b-2 transition ${activeTab === 'created'
                            ? 'text-blue-600 border-blue-600'
                            : 'text-gray-500 border-transparent hover:text-blue-500'
                            }`}
                    >
                        <span title="Only visible to you unless you share it with community.">
                            🔒 My Created Properties (Private)
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('saved')}
                        className={`px-4 py-2 font-medium border-b-2 transition ${activeTab === 'saved'
                            ? 'text-blue-600 border-blue-600'
                            : 'text-gray-500 border-transparent hover:text-blue-500'
                            }`}
                    >
                        🌍 Saved from Community
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'created' ? (
                    loadingCreated ? (
                        <LoadingSpinner message="Loading created properties..." />
                    )
                        : visibleProperties.length > 0
                            ? (
                                <PropertyCardList
                                    properties={visibleProperties}
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
                                    <p>🚀 Our goal is to help you manage <strong>end-to-end property sourcing</strong> — from discovery to sharing, shortlisting, email conversations, due diligence and beyond.</p>
                                    <p className="mt-2">You can easily <strong>copy-paste property details</strong> from SMS, WhatsApp, Facebook messages, Domain, RealEstate.com.au, or any other source — and turn them into structured listings in seconds.</p>
                                    <p className="mt-2">✉️ Once added, you can share properties with the community, manage notes, track decision status, or even send emails to agents <strong>directly from the app</strong>.</p>
                                    <button
                                        onClick={() => navigate('/add-property')}
                                        className="mt-4 inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition"
                                    >
                                        ➕ Add Your First Property
                                    </button>
                                    <p className="mt-3 text-sm text-gray-500">
                                        Need inspiration? <span onClick={() => navigate('/public')} className="text-blue-600 hover:underline cursor-pointer">Explore what others are sharing →</span>
                                    </p>
                                </div>
                            )
                ) : loadingSaved ? (
                    <p className="text-sm text-gray-500">Loading saved properties...</p>
                ) : visibleProperties.length > 0
                    ? (
                        <PropertyCardList
                            properties={visibleProperties}
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
            {!aiSearchActive && (
                <Pagination
                    count={activeTab === 'created' ? totalPagesCreated : totalPagesSaved}
                    page={currentPage}
                    onChange={(e, value) => setCurrentPage(value)}
                    variant="outlined"
                    shape="rounded"
                />
            )}



        </div>
    );
};

export default PropertySourcingPage;

