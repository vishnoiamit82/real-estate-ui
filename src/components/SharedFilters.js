import React from 'react';

const SharedFilters = ({
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  postedWithinDays,
  setPostedWithinDays,
  onReset,
  totalCount,
  allCount,
  currentPage,
  limit,
  aiSearchActive,
}) => {
  const safePage = Number(currentPage) || 1;
  const safeLimit = Number(limit) || 12;

  const resultCount = totalCount || 0;
  const hasResults = resultCount > 0;
  const start = hasResults ? (safePage - 1) * safeLimit + 1 : 0;
  const end = hasResults ? Math.min(start + safeLimit - 1, totalCount) : 0;

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 flex-wrap mb-6">
      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 w-full">
        {/* Price Range */}
        <div className="flex items-center gap-2">
          <label htmlFor="minPrice" className="text-sm text-gray-700 whitespace-nowrap min-w-[100px]">
            💰 Price range:
          </label>
          <input
            type="number"
            id="minPrice"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-24 text-sm border border-gray-300 rounded px-2 py-1"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            id="maxPrice"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-24 text-sm border border-gray-300 rounded px-2 py-1"
          />
        </div>

        {/* Posted Within */}
        <div className="flex items-center gap-2">
          <label htmlFor="postedWithinDays" className="text-sm text-gray-700 whitespace-nowrap min-w-[100px]">
            📅 Posted within:
          </label>
          <input
            type="range"
            id="postedWithinDays"
            min="1"
            max="90"
            step="1"
            value={postedWithinDays}
            onChange={(e) => setPostedWithinDays(Number(e.target.value))}
            className="w-[140px] h-2 accent-blue-600"
          />
          <span className="text-sm text-gray-700 whitespace-nowrap">{postedWithinDays} days</span>
        </div>

        {/* Reset */}
        <button
          onClick={onReset}
          className="text-sm text-blue-600 hover:underline whitespace-nowrap"
        >
          🔁 Reset filters
        </button>
      </div>

      {/* Result Summary */}
      {aiSearchActive && (
        <div className="text-sm text-gray-600 mt-2 md:mt-0">
          {hasResults && start && end ? (
            <>
              Showing <strong>{start}–{end}</strong> of <strong>{totalCount}</strong> matching properties
              {allCount && totalCount !== allCount && (
                <> (out of <strong>{allCount}</strong> total shared)</>
              )}
            </>
          ) : (
            <>No matching properties found.</>
          )}
        </div>
      )}
    </div>
  );
};

export default SharedFilters;
