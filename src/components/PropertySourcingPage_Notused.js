
import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import PropertyCardList from './PropertyCardList';
import Pagination from '@mui/material/Pagination';
import { useNavigate } from 'react-router-dom';
import PropertyFilterBar from './PropertyFilterBar';

const PropertySourcingPage = () => {
  const [createdProperties, setCreatedProperties] = useState([]);
  const [savedProperties, setSavedProperties] = useState([]);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [aiSearchActive, setAiSearchActive] = useState(false);
  const [aiResults, setAiResults] = useState([]);

  const propertiesPerPage = 12;

  const navigate = useNavigate();

  const getStatusQueryFromFilter = (filter) => {
    switch (filter) {
      case 'pursue':
        return 'pursue';
      case 'on_hold':
        return 'on_hold';
      case 'undecided':
        return 'undecided';
      case 'deleted':
        return 'deleted';
      case 'active':
        return 'pursue,undecided,on_hold';
      default:
        return ''; // 'all'
    }
  };


  useEffect(() => {
    fetchSavedProperties();
    fetchEmailTemplates();
  }, []);

  useEffect(() => {
    console.log("⏳ useEffect triggered for filter:", currentFilter);
    fetchCreatedProperties();
    setCurrentPage(1);
  }, [currentFilter]);



  const fetchCreatedProperties = async () => {
    try {
      const statusQuery = getStatusQueryFromFilter(currentFilter);
      console.log('[FETCH] calling with filter:', currentFilter, '→', statusQuery); // 👀 log this

      const queryParams = new URLSearchParams();
      if (statusQuery) queryParams.append('status', statusQuery);
      queryParams.append('mine', 'true');

      const response = await axiosInstance.get(
        `${process.env.REACT_APP_API_BASE_URL}/properties?${queryParams.toString()}`
      );
      setCreatedProperties(response.data.map((p) => ({ ...p, source: 'created' })));
    } catch (error) {
      console.error('Error fetching created properties:', error);
    }
  };



  const fetchSavedProperties = async () => {
    try {
      const response = await axiosInstance.get('/saved-properties');
      const transformed = response.data.map((item) => ({
        ...item.communityPropertyId,
        decisionStatus: item.decisionStatus,
        savedId: item._id,
        source: 'saved',
      }));
      setSavedProperties(transformed);
    } catch (error) {
      console.error('Error fetching saved properties:', error);
    }
  };

  const handleUpdateDecisionStatus = async (property, status) => {
    try {
      if (property.source === 'saved') {
        await axiosInstance.patch(`/saved-properties/${property.savedId}/decision`, { decisionStatus: status });
        fetchSavedProperties();
      } else {
        await axiosInstance.patch(`/properties/${property._id}/decision`, { decisionStatus: status });
        fetchCreatedProperties();
      }
    } catch (error) {
      console.error('Failed to update decision status:', error);
    }
  };

  const getFilteredProperties = () => {
    const list = currentFilter === 'created'
      ? createdProperties
      : currentFilter === 'saved'
        ? savedProperties
        : [...createdProperties, ...savedProperties];

    const searched = list.filter((property) => {
      const address = property.address?.toLowerCase() || '';
      const agent = property.agentId?.name?.toLowerCase() || '';
      return address.includes(searchQuery) || agent.includes(searchQuery);
    });

    const sorted = [...searched].sort((a, b) => {
      const valA = a[sortKey] || '';
      const valB = b[sortKey] || '';
      if (typeof valA === 'string') return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      if (!isNaN(Date.parse(valA))) return sortOrder === 'asc' ? new Date(valA) - new Date(valB) : new Date(valB) - new Date(valA);
      if (typeof valA === 'number') return sortOrder === 'asc' ? valA - valB : valB - valA;
      return 0;
    });

    return sorted;
  };
  
  const allFiltered = aiSearchActive ? aiResults : getFilteredProperties();

  const paginatedProperties = allFiltered.slice(
    (currentPage - 1) * propertiesPerPage,
    currentPage * propertiesPerPage
  );
  
  const totalPages = Math.ceil(allFiltered.length / propertiesPerPage);
  

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <h2 className="text-2xl font-bold mb-4">📁 Property Sourcing Amit</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate('/add-property')}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            + Add Property
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">

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
          aiSearchActive={aiSearchActive}
          setAiSearchActive={setAiSearchActive}
          onAiSearch={setAiResults}
        />

      </div>

      <PropertyCardList
        properties={paginatedProperties}
        navigate={navigate}
        updateDecisionStatus={(id, status, property) => handleUpdateDecisionStatus(property, status)}
        setSelectedPropertyForEmail={() => { }}
        setSelectedAgent={() => { }}
        setSelectedPropertyForNotes={() => { }}
        handleShareProperty={() => { }}
        handleShareToCommunity={() => { }}
        deleteProperty={() => { }}
        restoreProperty={() => { }}
      />

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
