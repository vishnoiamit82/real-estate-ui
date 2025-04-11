import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EmailModal from './EmailModal';
import axiosInstance from '../axiosInstance';
import { toast } from 'react-toastify';
import PropertyFilterBar from './PropertyFilterBar';
import PropertyViewSwitcher from './PropertyViewSwitcher';
import Pagination from '@mui/material/Pagination';
import { useCallback } from 'react';
import debounce from 'lodash.debounce';
import SharedFilters from './SharedFilters';


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
  const [searchMode, setSearchMode] = useState('normal');
  const [aiSearchActive, setAiSearchActive] = useState(false);
  const navigate = useNavigate();
  const limit = 12;
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [allCount, setAllCount] = useState(0);

  




  const debouncedFetch = useCallback(
    debounce((filters) => {
      const fetchData = async () => {
        try {
          const res = await axiosInstance.post(`${process.env.REACT_APP_API_BASE_URL}/public/property/search`, filters);
          setAiResults(res.data?.results || []);
          setAiSearchActive(true);
          setTotalPages(res.data?.totalPages || 1);
          setCurrentPage(filters.page || 1);
          setTotalCount(res.data?.totalCount || 0);
          setAllCount(res.data?.allCount || 0);
        } catch (err) {
          console.error('Search failed:', err);
          toast.error('Failed to fetch properties.');
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, 400),
    []
  );



  useEffect(() => {
    setLoading(true);

    const payload = {
      address: searchQuery || '',
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      postedWithinDays: Number(postedWithinDays),
      status: propertyTypeFilter,
      page: currentPage,
      limit,
      sortKey,
      sortOrder,
    };

    debouncedFetch(payload);
    return () => debouncedFetch.cancel();
  }, [
    searchQuery,
    minPrice,
    maxPrice,
    postedWithinDays,
    propertyTypeFilter,
    currentPage,
    sortKey,
    sortOrder,
  ]);



  // const filteredProperties = sharedProperties.filter((property) => {
  //   const address = property.address?.toLowerCase() || '';
  //   const sharedByName = property.sharedBy?.name?.toLowerCase() || '';
  //   return (
  //     address.includes(searchQuery.toLowerCase()) ||
  //     sharedByName.includes(searchQuery.toLowerCase())
  //   );
  // });

  const displayedProperties = aiSearchActive
    ? aiResults || []
    : sharedProperties;


  const sortedProperties = aiSearchActive
    ? aiResults || []
    : sharedProperties;

  const resultCount = aiResults?.length || 0;
  const hasResults = aiSearchActive && resultCount > 0;

  const start = hasResults ? (currentPage - 1) * limit + 1 : 0;
  const end = hasResults ? start + resultCount - 1 : 0;

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* Heading */}
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
        🏘️ Community Board - Shared Properties
      </h2>
  
      {/* Search, Filter, Sort, View Toggle */}
      <PropertyFilterBar
        currentFilter={propertyTypeFilter}
        setCurrentFilter={setPropertyTypeFilter}
        searchQuery={searchQuery}
        setSearchQuery={(query) => {
          setSearchQuery(query);
          if (searchMode === 'normal') {
            const filters = {
              address: query,
              minPrice: minPrice ? Number(minPrice) : undefined,
              maxPrice: maxPrice ? Number(maxPrice) : undefined,
              postedWithinDays: Number(postedWithinDays),
              status: propertyTypeFilter,
              page: 1,
              limit,
              sortKey,
              sortOrder,
            };
            debouncedFetch(filters);
            setCurrentPage(1);
          }
        }}
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
  
      {/* Filters + Result Summary */}
      <SharedFilters
        minPrice={minPrice}
        maxPrice={maxPrice}
        setMinPrice={setMinPrice}
        setMaxPrice={setMaxPrice}
        postedWithinDays={postedWithinDays}
        setPostedWithinDays={setPostedWithinDays}
        currentPage={currentPage}
        limit={limit}
        totalCount={totalCount}
        allCount={allCount}
        aiSearchActive={aiSearchActive}
        onReset={() => {
          setMinPrice('');
          setMaxPrice('');
          setPostedWithinDays(10);
          setSearchQuery('');
          setAiResults(null);
          setAiSearchActive(false);
          setCurrentPage(1);
        }}
      />
  
      {/* Property Cards or Table */}
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
  
      {/* Pagination */}
      {totalPages > 1 && (
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
  
      {/* Email Modal */}
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
