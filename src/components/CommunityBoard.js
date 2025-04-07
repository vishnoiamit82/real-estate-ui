// ✅ CommunityBoard.js (with searchMode lifted and passed down)
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EmailModal from './EmailModal';
import axiosInstance from '../axiosInstance';
import { toast } from 'react-toastify';
import PropertyFilterBar from './PropertyFilterBar';
import PropertyViewSwitcher from './PropertyViewSwitcher';

const CommunityBoard = () => {
  const [sharedProperties, setSharedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [messageRecipient, setMessageRecipient] = useState(null);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('active');
  const [viewMode, setViewMode] = useState('card');
  const navigate = useNavigate();
  const [sortKey, setSortKey] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [aiResults, setAiResults] = useState(null);
  const [searchMode, setSearchMode] = useState('ai');
  const [aiSearchActive, setAiSearchActive] = useState(false);

  useEffect(() => {
    const fetchSharedProperties = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/properties/community`);
        setSharedProperties(response.data);
      } catch (error) {
        console.error('Error fetching community properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedProperties();
  }, []);

  const filteredProperties = sharedProperties.filter((property) => {
    const address = property.address?.toLowerCase() || '';
    const sharedByName = property.sharedBy?.name?.toLowerCase() || '';

    const matchesSearch =
      address.includes(searchQuery.toLowerCase()) ||
      sharedByName.includes(searchQuery.toLowerCase());

    const matchesFilter =
      propertyTypeFilter === 'all'
        ? true
        : propertyTypeFilter === 'active'
          ? !property.is_deleted
          : false;

    return matchesSearch && matchesFilter;
  });

  const displayedProperties =
    searchMode === 'ai'
      ? aiSearchActive
        ? aiResults || []
        : sharedProperties
      : filteredProperties;

  const sortedProperties = [...displayedProperties].sort((a, b) => {
    const valA = a[sortKey];
    const valB = b[sortKey];
    if (!valA || !valB) return 0;
    if (typeof valA === 'string') return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    if (!isNaN(Date.parse(valA))) return sortOrder === 'asc' ? new Date(valA) - new Date(valB) : new Date(valB) - new Date(valA);
    if (typeof valA === 'number') return sortOrder === 'asc' ? valA - valB : valB - valA;
    return 0;
  });

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">🏘️ Community Board - Shared Properties</h2>

      {/* <PropertyFilterBar
        currentFilter={propertyTypeFilter}
        setCurrentFilter={setPropertyTypeFilter}
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
      /> */}

      <PropertyViewSwitcher
        properties={sortedProperties}
        viewMode={viewMode}
        navigate={navigate}
        currentUser={JSON.parse(localStorage.getItem('currentUser'))}
        setSelectedPropertyForEmail={(property) => {
          setSelectedProperty(property);
          setMessageRecipient(property.sharedBy);
          setEmailModalOpen(true);
        }}
        setSelectedAgent={() => { }}
        setSelectedPropertyForNotes={() => { }}
        updateDecisionStatus={() => { }}
        deleteProperty={() => { }}
        restoreProperty={() => { }}
        handleShareProperty={() => { }}
        handleShareToCommunity={() => { }}
        handleUnshareFromCommunity={() => { }}
        handlePursueCommunityProperty={() => { }}
        handleSaveToMyList={() => { }}
        deleteSavedProperty={() => { }}
      />


      {emailModalOpen && selectedProperty && messageRecipient && (
        <EmailModal
          property={selectedProperty}
          agent={messageRecipient}
          templates={[]}
          onClose={() => {
            setSelectedProperty(null);
            setMessageRecipient(null);
            setEmailModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default CommunityBoard;
