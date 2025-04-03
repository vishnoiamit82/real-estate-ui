import React, { useState } from 'react';
import {
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  Table,
  Sparkles,
  X
} from 'lucide-react';
import axios from 'axios';

const PropertyFilterBar = ({
  currentFilter,
  setCurrentFilter,
  searchQuery,
  setSearchQuery,
  sortKey,
  setSortKey,
  sortOrder,
  setSortOrder,
  setCurrentPage,
  viewMode,
  setViewMode,
  showViewToggle = false,
  filterOptions,
  onAiSearch = () => {}
}) => {
  const [aiSearchActive, setAiSearchActive] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false); // 👈 New focus state

  const exampleQueries = [
    "Looking for a house in Mildura for around $550k built after year 2000.",
    "Looking in Albury min land size of 600sqm",
    "Anything under $800k with dual income",
    "Prperties with minimum yield of 6 percent",
    "Property with plans and permits in place"
  ];

  const defaultOptions = [
    { value: 'active', label: 'Active Properties' },
    { value: 'pursue', label: 'Pursue' },
    { value: 'on_hold', label: 'On Hold' },
    { value: 'undecided', label: 'Undecided' },
    { value: 'all', label: 'All Properties' },
    { value: 'deleted', label: 'Deleted Only' }
  ];

  const finalFilterOptions = filterOptions?.length > 0 ? filterOptions : defaultOptions;

  const handleAiSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/public/ai-search`,
        { query: searchQuery }
      );

      const results = response.data?.results || [];
      setAiSearchActive(true);
      onAiSearch(results);
      setCurrentPage(1);
    } catch (error) {
      console.error('AI Search failed:', error);
      alert('AI Search failed. Please try again.');
    }
  };

  const handleClearAiSearch = () => {
    setAiSearchActive(false);
    onAiSearch(null);
    setCurrentPage(1);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm space-y-3">
      {/* Top Controls */}
      <div className="flex flex-col lg:flex-row flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-col md:flex-row gap-3 flex-1 w-full md:w-auto">
          {/* Filter */}
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
              {finalFilterOptions.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="relative flex-grow min-w-[200px]">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder={aiSearchActive ? 'AI filter applied...' : 'Search by address or agent...'}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 100)}
              className="w-full p-2 pl-10 border rounded-lg bg-white border-gray-300"
              disabled={aiSearchActive}
            />
          </div>

          {/* AI Buttons */}
          <div className="flex gap-2 items-center">
            <button
              onClick={handleAiSearch}
              title="AI-powered search"
              className="flex items-center px-3 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-md"
              disabled={aiSearchActive}
            >
              <Sparkles size={16} className="mr-1" />
              AI Search
            </button>
            {aiSearchActive && (
              <button
                onClick={handleClearAiSearch}
                title="Clear AI Filter"
                className="flex items-center px-2 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-600 rounded-md"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Sort & View Toggle */}
        <div className="flex items-center gap-3 flex-wrap">
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

          {showViewToggle && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('card')}
                className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium border ${viewMode === 'card' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border-gray-300'}`}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium border ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border-gray-300'}`}
              >
                <Table size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* AI Example Suggestions on focus only */}
      {searchFocused && !searchQuery && !aiSearchActive && (
        <div className="text-xs text-gray-600">
          <p className="mb-1">Try one of these:</p>
          <div className="flex flex-wrap gap-2">
            {exampleQueries.map((q, i) => (
              <button
                key={i}
                onClick={() => {
                  setSearchQuery(q);
                  handleAiSearch();
                }}
                className="bg-gray-200 hover:bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs transition"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyFilterBar;
