// PropertyFilterDrawer.js
import React from 'react';
import { Dialog } from '@headlessui/react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

const PropertyFilterDrawer = ({
  isOpen,
  onClose,
  currentFilter,
  setCurrentFilter,
  sortKey,
  setSortKey,
  sortOrder,
  setSortOrder,
  filterOptions,
  setCurrentPage
}) => {
  const defaultOptions = [
    { value: 'active', label: 'Active Properties' },
    { value: 'pursue', label: 'Pursue' },
    { value: 'on_hold', label: 'On Hold' },
    { value: 'undecided', label: 'Undecided' },
    { value: 'all', label: 'All Properties' },
    { value: 'deleted', label: 'Deleted Only' }
  ];

  const finalFilterOptions = filterOptions?.length > 0 ? filterOptions : defaultOptions;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Filter & Sort</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Filter Section */}
          <div>
            <label className="block mb-1 font-medium text-sm">Filter</label>
            <select
              value={currentFilter}
              onChange={(e) => {
                setCurrentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border rounded-md bg-white border-gray-300"
            >
              {finalFilterOptions.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* Sort Section */}
          <div>
            <label className="block mb-1 font-medium text-sm">Sort by</label>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-white border-gray-300"
            >
              <option value="createdAt">Created Date</option>
              <option value="offerClosingDate">Offer Closing Date</option>
              <option value="askingPrice">Price</option>
              <option value="rentalYield">Rental Yield</option>
            </select>
          </div>

          {/* Sort Order Toggle */}
          <div className="flex items-center justify-between">
            <label className="block font-medium text-sm">Sort Order</label>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm flex items-center gap-2"
            >
              {sortOrder === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </button>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={onClose}
            className="w-full bg-[#1F2937] hover:bg-[#111827] text-white py-2 rounded-md text-sm"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default PropertyFilterDrawer;
