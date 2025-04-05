// Mobile-first responsive PropertyFilterBar (premium styled)
import React, { useState } from 'react';
import { Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';

const PropertyFilterBarMobile = ({
  currentFilter,
  setCurrentFilter,
  searchQuery,
  setSearchQuery,
  setCurrentPage,
  filterOptions,
  onAiSearch = () => {},
}) => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const defaultOptions = [
    { value: 'active', label: 'Active Properties' },
    { value: 'pursue', label: 'Pursue' },
    { value: 'on_hold', label: 'On Hold' },
    { value: 'undecided', label: 'Undecided' },
    { value: 'all', label: 'All Properties' },
    { value: 'deleted', label: 'Deleted Only' },
  ];

  const exampleQueries = [
    "Looking for a house in Mildura for around $550k built after year 2000.",
    "Looking in Albury min land size of 600sqm",
    "Anything under $800k with dual income",
    "Prperties with minimum yield of 6 percent",
    "Property with plans and permits in place"
  ];

  const finalFilterOptions = filterOptions?.length > 0 ? filterOptions : defaultOptions;

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    onAiSearch(searchQuery);
    setCurrentPage(1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-[#F8F9FA] p-3 rounded-lg shadow-sm relative text-[#2D2D2D] border border-[#E5E7EB]">
      {/* 🔍 Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-[#6B7280]" />
        <input
          type="text"
          placeholder="Search properties..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setTimeout(() => setSearchFocused(false), 100)}
          className="w-full p-2 pl-10 border border-[#E5E7EB] rounded-lg bg-white text-sm placeholder-[#6B7280]"
        />
        <button
          onClick={() => setShowDrawer(true)}
          className="absolute right-3 top-2 text-[#1F2937] hover:text-[#D4AF37]"
        >
          <Filter size={20} />
        </button>
      </div>

      {/* 💡 AI Suggestions */}
      {searchFocused && !searchQuery && (
        <div className="text-xs text-[#6B7280] overflow-x-auto whitespace-nowrap py-2">
          <p className="mb-1">Try one of these:</p>
          <div className="flex gap-2">
            {exampleQueries.map((q, i) => (
              <button
                key={i}
                onClick={() => {
                  setSearchQuery(q);
                  handleSearch();
                }}
                className="bg-[#E5E4F0] hover:bg-[#D4AF37]/20 text-[#1F2937] px-3 py-1 rounded-full text-xs"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 🧾 Bottom Sheet / Drawer */}
      {showDrawer && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-[#E5E7EB] rounded-t-xl z-50 p-4 animate-slide-up max-h-[50vh] overflow-y-auto text-[#2D2D2D]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Filter Properties</h3>
            <button
              onClick={() => setShowDrawer(false)}
              className="text-sm text-[#6B7280]"
            >
              Close
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#2D2D2D] mb-1">Status Filter</label>
              <select
                value={currentFilter}
                onChange={(e) => {
                  setCurrentFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full p-2 border border-[#E5E7EB] rounded-md bg-white text-sm"
              >
                {finalFilterOptions.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyFilterBarMobile;