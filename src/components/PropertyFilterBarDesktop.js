import React, { useState, useEffect } from 'react';
import {
  Search,
  Sparkles,
  X
} from 'lucide-react';
import axiosInstance from '../axiosInstance';
import { getRecentSearches, saveRecentSearch } from '../utils/recentSearchUtils';
import AISearchDrawer from './AISearchDrawer';

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
  filterOptions,
  onAiSearch = () => { },
  searchMode,
  setSearchMode
}) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [pendingFilters, setPendingFilters] = useState(() => {
    const saved = localStorage.getItem('lastAISearchFilters');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, [searchFocused]);

  const handleSelectRecent = (query) => {
    setSearchQuery(query);
    saveRecentSearch(query);
    setCurrentPage?.(1);
  };

  const exampleQueries = [
    "Looking for a house in Mildura for around $550k built after year 2000.",
    "Looking in Albury min land size of 600sqm",
    "Anything under $800k with dual income",
    "Properties with minimum yield of 6 percent",
    "Property with plans and permits in place"
  ];

  const handleAiSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_API_BASE_URL}/public/ai-search-preview`,
        { query: searchQuery }
      );

      const { parsedFilters = {} } = response.data;
      const updatedFilters = {
        ...Object.fromEntries(
          Object.keys(currentFilter || {}).map((key) => [key, 'Any'])
        ),
        ...parsedFilters
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
    setCurrentPage(1);
  };

  return (
    <div className="bg-[#F8F9FA] p-4 rounded-lg shadow-sm space-y-4 text-[#2D2D2D] border border-[#E5E7EB]">
      <div className="max-w-5xl mx-auto flex gap-2 text-sm">
        <button
          onClick={() => setSearchMode('ai')}
          className={`px-3 py-1 rounded-full ${searchMode === 'ai' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}
        >
          ✨ AI Search
        </button>

        <button
          onClick={() => setSearchMode('normal')}
          className={`px-3 py-1 rounded-full ${searchMode === 'normal' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-600'}`}
        >
          🔍 Normal Search
        </button>
      </div>

      <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-stretch gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-3 w-5 h-5 text-[#6B7280]" />
          <input
            type="text"
            placeholder={aiSearchActive ? 'AI filter applied...' : 'Search for properties...'}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (searchMode === 'normal') {
                onAiSearch(null);
                setAiSearchActive(false);
                setCurrentPage(1);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchMode === 'ai') {
                handleAiSearch();
              }
            }}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => {
              setTimeout(() => setSearchFocused(false), 100);
            }}
            className="w-full pl-12 pr-32 py-3 rounded-full border border-[#E5E7EB] bg-white placeholder-[#6B7280] text-sm shadow-sm"
            disabled={false}
          />

          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-28 top-3 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}

          {searchMode === 'ai' && (
            <button
              onClick={handleAiSearch}
              title="AI-powered search"
              className="absolute right-4 top-1.5 text-white bg-[#1F2937] hover:bg-[#111827] text-xs px-4 py-2 rounded-full"
              disabled={false}
            >
              <Sparkles size={14} className="inline-block mr-1" /> Search
            </button>
          )}
        </div>

        {/* Sort by Dropdown */}
        <select
          id="sortKey"
          value={sortKey}
          onChange={(e) => {
            const newKey = e.target.value;
            if (newKey === sortKey) {
              // Toggle sort order if the same key is clicked again
              setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
            } else {
              setSortKey(newKey);
              setSortOrder('desc'); // Or 'asc' if you prefer
            }
          }}
          className="px-2 py-2 border border-gray-300 rounded-md text-sm bg-white"
        >
          <option value="createdAt">Created Date</option>
          <option value="offerClosingDate">Offer Closing Date</option>
          <option value="askingPrice">Price</option>
          <option value="rentalYield">Rental Yield</option>
        </select>


      </div>

      <div className="max-w-5xl mx-auto transition-all duration-200" style={{ minHeight: '65px' }}>
        {searchFocused && !searchQuery && !aiSearchActive && searchMode === 'ai' && (
          <div className="text-xs text-[#6B7280]">
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

        {searchFocused && !searchQuery && !aiSearchActive && searchMode === 'normal' && (
          <div className="text-xs text-gray-600 mt-2 max-w-5xl mx-auto">
            <p className="mb-1">You can search by:</p>
            <ul className="list-disc list-inside text-gray-500 space-y-1">
              <li>🏠 Address (e.g., <em>12 Smith St</em>)</li>
              <li>👤 Agent or poster name (e.g., <em>John</em>)</li>
              <li>📍 Suburb or region (e.g., <em>Albury</em>, <em>Central Coast</em>)</li>
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

        <AISearchDrawer
          isOpen={aiDrawerOpen}
          onClose={() => setAiDrawerOpen(false)}
          filters={pendingFilters}
          setPendingFilters={setPendingFilters}
          onConfirm={async (finalFilters) => {
            try {
              saveRecentSearch(searchQuery);
              const resultsRes = await axiosInstance.post(
                `${process.env.REACT_APP_API_BASE_URL}/public/property/search`,
                finalFilters
              );
              setAiSearchActive(true);
              onAiSearch(resultsRes.data?.results || []);
              setCurrentPage(1);
              setAiDrawerOpen(false);
            } catch (err) {
              console.error('Search failed:', err);
              alert('Search failed. Please try again.');
            }
          }}
        />
      </div>
    </div>
  );
};

export default PropertyFilterBarDesktop;