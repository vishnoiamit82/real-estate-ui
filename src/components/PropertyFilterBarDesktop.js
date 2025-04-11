import React, { useState, useEffect } from 'react';
import {
  Search,
  Sparkles,
  X
} from 'lucide-react';
import axiosInstance from '../axiosInstance';
import { getRecentSearches, saveRecentSearch } from '../utils/recentSearchUtils';
import AISearchDrawer from './AISearchDrawer';
import { useCallback } from 'react';
import debounce from 'lodash.debounce'; // or write your own


const PropertyFilterBarDesktop = ({
  currentFilter,
  setCurrentFilter,
  searchQuery,
  setSearchQuery,
  aiSearchActive,
  setAiSearchActive,
  sortKey,
  setSortKey,
  sortOrder,
  setSortOrder,
  setCurrentPage,
  viewMode,
  setViewMode,
  showViewToggle = false,
  filterOptions = [], // Dynamic filter list
  onAiSearch = () => { },
  searchMode,
  setSearchMode
}) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [liveResults, setLiveResults] = useState([]);

  const [recentSearches, setRecentSearches] = useState([]);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [availableTags, setAvailableTags] = useState([]);
  const [pendingFilters, setPendingFilters] = useState(() => {
    const saved = localStorage.getItem('lastAISearchFilters');
    return saved ? JSON.parse(saved) : null;
  });

  const exampleQueries = [
    "Looking for a house in Mildura for around $550k built after year 2000.",
    "Looking in Albury min land size of 600sqm",
    "Anything under $800k with dual income",
    "Properties with minimum yield of 6 percent",
    "Property with plans and permits in place"
  ];

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, [searchFocused]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/public/property/tags`);
        setAvailableTags(res.data || []);
      } catch (err) {
        console.error("Failed to fetch tags:", err);
      }
    };
    fetchTags();
  }, []);

  const handleSelectRecent = (query) => {
    setSearchQuery(query);
    saveRecentSearch(query);
    setCurrentPage?.(1);
  };

  const handleAiSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const response = await axiosInstance.post(`${process.env.REACT_APP_API_BASE_URL}/public/ai-search-preview`, {
        query: searchQuery,
      });

      const parsedFilters = response.data?.parsedFilters || {};
      const tagSet = new Set();

      if (Array.isArray(parsedFilters.mustHaveTags)) {
        parsedFilters.mustHaveTags.forEach(tag => tagSet.add(tag));
      }

      if (Array.isArray(parsedFilters.locations)) {
        parsedFilters.locations.forEach(loc => {
          if (availableTags.some(tag => tag.name.toLowerCase() === loc.toLowerCase())) {
            tagSet.add(loc);
          }
        });
      }

      if (tagSet.size > 0) {
        parsedFilters.tags = Array.from(tagSet).map(tagName => {
          const match = availableTags.find(tag => tag.name.toLowerCase() === tagName.toLowerCase());
          return match || { name: tagName, type: 'unknown' };
        });
      }

      delete parsedFilters.mustHaveTags;

      const updatedFilters = {
        ...Object.fromEntries(
          Object.keys(currentFilter || {}).map((key) => [key, 'Any'])
        ),
        ...parsedFilters,
      };

      setPendingFilters(updatedFilters);
      setAiDrawerOpen(true);
    } catch (error) {
      console.error('AI Search failed:', error);
      alert('AI Search failed. Please try again.');
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setAiSearchActive(false);
    onAiSearch(null);
    setCurrentPage?.(1);
  };

  // const debouncedSearch = useCallback(
  //   debounce(async (query) => {
  //     if (!query.trim()) {
  //       setLiveResults([]);
  //       return;
  //     }
  //     try {
  //       const res = await axiosInstance.post(`${process.env.REACT_APP_API_BASE_URL}/public/property/search`, {
  //         address: query,
  //       });
  //       setLiveResults(res.data?.results || []);
  //       setAiSearchActive(true);
  //       onAiSearch(res.data?.results || []);
  //       setCurrentPage?.(1);
  //     } catch (error) {
  //       console.error('Live search failed:', error);
  //     }
  //   }, 400),
  //   []
  // );


  return (
    <div className="bg-[#F8F9FA] p-4 rounded-lg shadow-sm space-y-4 text-[#2D2D2D] border border-[#E5E7EB]">
      <div className="max-w-5xl mx-auto flex gap-2 text-sm">
        {/* <button
          onClick={() => setSearchMode('normal')}
          className={`px-3 py-1 rounded-full ${searchMode === 'normal' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-600'}`}
        >
          🔍 Normal Search
        </button> */}

        {/* <button
          onClick={() => setSearchMode('ai')}
          className={`px-3 py-1 rounded-full ${searchMode === 'ai' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}
        >
          ✨ AI Search
        </button> */}

      </div>

      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Input */}
        <div className="relative col-span-2">
          <Search className="absolute left-4 top-3 w-5 h-5 text-[#6B7280]" />
          <input
            type="text"
            placeholder={
              searchMode === 'ai'
                ? 'Type a natural query (e.g., high yield house in Logan under 800k)'
                : 'Search by address or tag'
            }

            value={searchQuery}
            onChange={(e) => {
              const query = e.target.value;
              setSearchQuery(query);
              // if (searchMode === 'normal') {
              //   debouncedSearch(query);
              // }
            }}

            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchMode === 'ai') handleAiSearch();
            }}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 100)}
            className="w-full pl-12 pr-32 py-3 rounded-full border border-[#E5E7EB] bg-white placeholder-[#6B7280] text-sm shadow-sm"
          />

          {searchQuery && (
            <button onClick={handleClearSearch} className="absolute right-28 top-3 text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          )}

          {searchMode === 'ai' && (
            <button
              onClick={handleAiSearch}
              title="AI-powered search"
              className="absolute right-4 top-1.5 text-white bg-[#1F2937] hover:bg-[#111827] text-xs px-4 py-2 rounded-full"
            >
              <Sparkles size={14} className="inline-block mr-1" /> Search
            </button>
          )}
        </div>

        {/* Sort & Filter */}
        <div className="flex gap-3">
          {filterOptions?.length > 0 && (
            <select
              value={currentFilter}
              onChange={(e) => {
                setCurrentFilter(e.target.value);
                setCurrentPage?.(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white w-full"
            >
              {filterOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}

          <select
            id="sortKey"
            value={sortKey}
            onChange={(e) => {
              const newKey = e.target.value;
              if (newKey === sortKey) {
                setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
              } else {
                setSortKey(newKey);
                setSortOrder('desc');
              }
            }}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white w-full"
          >
            <option value="createdAt">Created Date</option>
            <option value="offerClosingDate">Offer Closing Date</option>
            <option value="askingPrice">Price</option>
            <option value="rentalYield">Rental Yield</option>
          </select>
        </div>
      </div>

      {/* AI Drawer & Hints */}
      <div className="max-w-5xl mx-auto">
        {searchFocused && !searchQuery && !aiSearchActive && searchMode === 'ai' && (
          <div className="text-xs text-[#6B7280] mt-2">
            <p className="mb-1">Try one of these:</p>
            <div className="flex flex-wrap gap-2">
              {exampleQueries.map((q, i) => (
                <button
                  key={i}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setSearchQuery(q);
                  }}
                  className="bg-[#E5E4F0] hover:bg-[#D4AF37]/20 text-[#1F2937] px-3 py-1 rounded-full text-xs transition"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {searchFocused && !searchQuery && searchMode === 'normal' && (
          <div className="text-xs text-[#6B7280] mt-2">
            <p className="mb-1">Try searching:</p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-gray-600">
              <li><span className="font-medium text-gray-800">Suburb:</span> <code>logan</code>, <code>ipswich</code></li>
              <li><span className="font-medium text-gray-800">Tag/Feature:</span> <code>depreciationBenefit</code>, <code></code></li>
              <li><span className="font-medium text-gray-800">Partial Match:</span> <code>lacewing</code> (to match addresses)</li>
            </ul>
          </div>
        )}


        {searchFocused && !searchQuery && recentSearches.length > 0 && (
          <div className="mt-2 space-y-1 text-sm text-gray-600">
            <p className="text-xs text-gray-400">Recent Searches</p>
            {recentSearches.map((query, index) => (
              <button
                key={index}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelectRecent(query);
                }}
                className="block text-left w-full px-3 py-1 hover:bg-gray-100 rounded"
              >
                🔎 {query}
              </button>
            ))}
          </div>
        )}
      </div>

      <AISearchDrawer
        isOpen={aiDrawerOpen}
        onClose={() => setAiDrawerOpen(false)}
        filters={pendingFilters}
        setPendingFilters={setPendingFilters}
        availableTags={availableTags}
        onConfirm={async (finalFilters) => {
          try {
            saveRecentSearch(searchQuery);
            const resultsRes = await axiosInstance.post(
              `${process.env.REACT_APP_API_BASE_URL}/public/property/search`,
              finalFilters
            );
            setAiSearchActive(true);
            onAiSearch(resultsRes.data?.results || []);
            setCurrentPage?.(1);
            setAiDrawerOpen(false);
          } catch (err) {
            console.error('Search failed:', err);
            alert('Search failed. Please try again.');
          }
        }}
      />
    </div>
  );
};

export default PropertyFilterBarDesktop;
