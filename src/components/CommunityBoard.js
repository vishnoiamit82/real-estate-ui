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

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const handleSaveToMyList = async (propertyId) => {
    try {
      await axiosInstance.post(`${process.env.REACT_APP_API_BASE_URL}/saved-properties`, {
        communityPropertyId: propertyId
      });
      toast.success('✅ Property saved to your list!');
    } catch (err) {
      if (err.response?.data?.message === 'Already saved.') {
        toast.info('This property is already in your saved list.');
      } else {
        console.error('Error saving property:', err);
        toast.error('Failed to save property. Please try again.');
      }
    }
  };

  const handlePursueCommunityProperty = async (property) => {
    try {
      let savedId = property.savedId;

      if (!savedId || property.source !== 'saved') {
        const response = await axiosInstance.post(`${process.env.REACT_APP_API_BASE_URL}/saved-properties`, {
          communityPropertyId: property._id,
        });
        savedId = response.data._id;
      }

      await axiosInstance.patch(`${process.env.REACT_APP_API_BASE_URL}/saved-properties/${savedId}/decision`, {
        decisionStatus: 'pursue',
      });

      toast.success('Marked as pursued!');
    } catch (error) {
      console.error('Error pursuing community property:', error);
      toast.error('Failed to pursue property.');
    }
  };

  const handleMessagePoster = (property) => {
    setSelectedProperty(property);
    setMessageRecipient(property.sharedBy);
    setEmailModalOpen(true);
  };

  const closeEmailModal = () => {
    setSelectedProperty(null);
    setMessageRecipient(null);
    setEmailModalOpen(false);
  };

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

  const displayedProperties = aiResults || filteredProperties;

  console.log (displayedProperties)

  const sortedProperties = [...displayedProperties].sort((a, b) => {
    const valA = a[sortKey];
    const valB = b[sortKey];

    if (!valA || !valB) return 0;

    if (typeof valA === 'string') {
      return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }

    if (!isNaN(Date.parse(valA))) {
      return sortOrder === 'asc'
        ? new Date(valA) - new Date(valB)
        : new Date(valB) - new Date(valA);
    }

    if (typeof valA === 'number') {
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    }

    return 0;
  });

  const propertyTypes = Array.from(new Set(sharedProperties.map((p) => p.propertyType).filter(Boolean)));

  if (loading) return <p className="p-6 text-gray-600">Loading community properties...</p>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">🏘️ Community Board - Shared Properties</h2>
      </div>

      <PropertyFilterBar
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
        onAiSearch={(results) => setAiResults(results)}
      />

      <PropertyViewSwitcher
        properties={sortedProperties}
        viewMode={viewMode}
        navigate={navigate}
        currentUser={currentUser}
        setSelectedPropertyForEmail={handleMessagePoster}
        setSelectedAgent={() => { }}
        setSelectedPropertyForNotes={() => { }}
        updateDecisionStatus={() => { }}
        deleteProperty={() => { }}
        restoreProperty={() => { }}
        handleShareProperty={() => { }}
        handleShareToCommunity={() => { }}
        handleUnshareFromCommunity={() => { }}
        handlePursueCommunityProperty={handlePursueCommunityProperty}
        handleSaveToMyList={handleSaveToMyList}
        deleteSavedProperty={() => { }}
      />

      {emailModalOpen && selectedProperty && messageRecipient && (
        <EmailModal
          property={selectedProperty}
          agent={messageRecipient}
          templates={[]}
          onClose={closeEmailModal}
        />
      )}
    </div>
  );
};

export default CommunityBoard;
