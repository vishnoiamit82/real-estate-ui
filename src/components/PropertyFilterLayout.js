import React, { useState } from 'react';
import PropertyFilterBarDesktop from './PropertyFilterBarDesktop';
import PropertyFilterDrawer from './PropertyFilterDrawer';

const PropertyFilterLayout = ({
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
  filterOptions,
  onAiSearch,
  aiSearchActive,
  setAiSearchActive,
  searchMode,
  setSearchMode
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <PropertyFilterBarDesktop
        currentFilter={currentFilter}
        setCurrentFilter={setCurrentFilter}
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
        filterOptions={filterOptions}
        onAiSearch={onAiSearch}
        aiSearchActive={aiSearchActive}
        setAiSearchActive={setAiSearchActive}
        searchMode={searchMode}
        setSearchMode={setSearchMode}
        onOpenFilterDrawer={() => setIsDrawerOpen(true)}
      />

      <PropertyFilterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        currentFilter={currentFilter}
        setCurrentFilter={setCurrentFilter}
        sortKey={sortKey}
        setSortKey={setSortKey}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        filterOptions={filterOptions}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
};

export default PropertyFilterLayout;
