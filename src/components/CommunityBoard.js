import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EmailModal from './EmailModal';
import axiosInstance from '../axiosInstance';
import { toast } from 'react-toastify';
import PropertyFilterBar from './PropertyFilterBar';
import PropertyViewSwitcher from './PropertyViewSwitcher';
import Pagination from '@mui/material/Pagination';

const CommunityBoard = () => {
  const [sharedProperties, setSharedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [messageRecipient, setMessageRecipient] = useState(null);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('active');
  const [postedWithinDays, setPostedWithinDays] = useState('10');
  const [debouncedPostedWithinDays, setDebouncedPostedWithinDays] = useState(10);

  const [viewMode, setViewMode] = useState('card');
  const [sortKey, setSortKey] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [aiResults, setAiResults] = useState(null);
  const [searchMode, setSearchMode] = useState('ai');
  const [aiSearchActive, setAiSearchActive] = useState(false);
  const navigate = useNavigate();
  const limit = 12;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedPostedWithinDays(postedWithinDays);
    }, 400);
    return () => clearTimeout(timeout);
  }, [postedWithinDays]);

  useEffect(() => {
    const fetchSharedProperties = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (debouncedPostedWithinDays && debouncedPostedWithinDays !== 9999) {
          params.append('posted_within_days', debouncedPostedWithinDays.toString());
        }

        if (propertyTypeFilter === 'active') {
          params.append('is_deleted', 'false');
        } else if (propertyTypeFilter === 'all') {
          params.append('include_deleted', 'true');
        }

        params.append('page', currentPage.toString());
        params.append('limit', limit.toString());

        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/properties/community?${params.toString()}`
        );

        const result = response.data;
        setSharedProperties(Array.isArray(result) ? result : result.data || []);
        setTotalPages(result.totalPages || 1);
      } catch (error) {
        console.error('Error fetching community properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedProperties();
  }, [propertyTypeFilter, debouncedPostedWithinDays, currentPage]);

  const filteredProperties = sharedProperties.filter((property) => {
    const address = property.address?.toLowerCase() || '';
    const sharedByName = property.sharedBy?.name?.toLowerCase() || '';
    return (
      address.includes(searchQuery.toLowerCase()) ||
      sharedByName.includes(searchQuery.toLowerCase())
    );
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
        <h2 className="text-2xl md:text-3xl font-bold">🏘️ Community Board - Shared Properties</h2>

        <div className="flex items-center gap-2 md:gap-3">
          <label htmlFor="postedWithinDays" className="text-sm text-gray-600 whitespace-nowrap">
            Posted within:
          </label>
          <input
            type="range"
            id="postedWithinDays"
            min="1"
            max="90"
            step="1"
            value={postedWithinDays}
            onChange={(e) => {
              setPostedWithinDays(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="w-[120px] h-2 accent-blue-600"
          />
          <span className="text-sm text-gray-700">{postedWithinDays} days</span>
        </div>
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
          { value: 'active', label: 'Active Only' },
          { value: 'all', label: 'All Shared' },
        ]}
      />

      <PropertyViewSwitcher
        properties={sortedProperties}
        loading={loading}
        viewMode={viewMode}
        navigate={navigate}
        currentUser={JSON.parse(localStorage.getItem('currentUser'))}
        setSelectedPropertyForEmail={(property) => {
          setSelectedProperty(property);
          setMessageRecipient(property.sharedBy);
          setEmailModalOpen(true);
        }}
        setSelectedAgent={() => {}}
        setSelectedPropertyForNotes={() => {}}
        updateDecisionStatus={() => {}}
        deleteProperty={() => {}}
        restoreProperty={() => {}}
        handleShareProperty={() => {}}
        handleShareToCommunity={() => {}}
        handleUnshareFromCommunity={() => {}}
        handlePursueCommunityProperty={() => {}}
        handleSaveToMyList={() => {}}
        deleteSavedProperty={() => {}}
        isPublic={true}
      />

      {/* Pagination UI */}
      {!aiSearchActive && totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, value) => setCurrentPage(value)}
            variant="outlined"
            shape="rounded"
          />
        </div>
      )}

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
