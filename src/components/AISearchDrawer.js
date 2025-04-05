import React, { useEffect } from 'react';

const enumFields = {
  propertyType: ["house", "apartment", "townhouse", "unit", "villa"],
  currentStatus: ["available", "sold", "offer_accepted"],
  decisionStatus: ["undecided", "pursue", "on_hold"],
  mustHaveTags: [
    "Recently Renovated",
    "Needs Renovation",
    "Subdivision Potential",
    "Plans & Permits",
    "Granny Flat",
    "Dual Living",
    "Zoned for Development"
  ],
  floodZone: ["No flooding", "Uncertain"],
  bushfireZone: ["No risk", "Uncertain"],
  socialHousing: ["Not nearby", "Uncertain"]
};

const fieldLabels = {
  propertyType: "Property Type",
  bedrooms: "Minimum Bedrooms",
  bathrooms: "Minimum Bathrooms",
  carSpaces: "Minimum Car Spaces",
  landSizeMin: "Land Size (sqm)",
  yearBuiltMin: "Built After (Year)",
  minPrice: "Min Price",
  maxPrice: "Max Price",
  minRent: "Min Rent ($/week)",
  maxRent: "Max Rent ($/week)",
  rentalYieldMin: "Minimum Yield (%)",
  rentalYieldMax: "Maximum Yield (%)",
  locations: "Locations",
  mustHaveTags: "Required Tags",
  floodZone: "Flood Zone",
  bushfireZone: "Bushfire Zone",
  socialHousing: "Social Housing"
};

const groupedFieldSections = [
  {
    title: '💰 Pricing',
    fields: ['minPrice', 'maxPrice', 'minRent', 'rentalYieldMin']
  },
  {
    title: '🏠 Property Details',
    fields: ['propertyType', 'bedrooms', 'bathrooms', 'carSpaces', 'landSizeMin', 'yearBuiltMin']
  },
  {
    title: '🏷️ Tags & Features',
    fields: ['mustHaveTags']
  },
  {
    title: '📍 Location',
    fields: ['locations']
  },
  {
    title: '⚠️ Due Diligence',
    fields: ['floodZone', 'bushfireZone', 'socialHousing']
  }
];

const getDefaultFilters = () => {
  const defaults = {};
  Object.keys(fieldLabels).forEach(key => {
    if (Array.isArray(enumFields[key])) {
      defaults[key] = [];
    } else {
      defaults[key] = "Any";
    }
  });
  return defaults;
};

const AISearchDrawer = ({ isOpen, onClose, filters = {}, parsedKeys = [], onConfirm, setPendingFilters }) => {
  const mergedFilters = { ...getDefaultFilters(), ...filters };

  useEffect(() => {
    if (isOpen) {
      setPendingFilters(mergedFilters);
      localStorage.setItem('lastAISearchFilters', JSON.stringify(mergedFilters));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isValid = (val) => val !== undefined && val !== null && val !== '' && !(Array.isArray(val) && val.length === 0);
  const hasParsedFilters = parsedKeys.some(key => isValid(filters[key]));

  const handleChange = (field, value) => {
    setPendingFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleMultiSelectChange = (field, option) => {
    setPendingFilters(prev => {
      const current = prev[field] || [];
      const updated = current.includes(option)
        ? current.filter(i => i !== option)
        : [...current, option];
      return { ...prev, [field]: updated };
    });
  };

  const renderField = (field, value) => {
    const isMultiSelect = Array.isArray(value) && enumFields[field];
    const isEnum = enumFields[field] && !isMultiSelect;

    if (isMultiSelect) {
      return (
        <div className="flex flex-wrap gap-2">
          {enumFields[field].map(option => (
            <button
              key={option}
              onClick={() => handleMultiSelectChange(field, option)}
              className={`px-3 py-1 rounded-full text-xs border ${value.includes(option) ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-800'}`}
            >
              {option}
            </button>
          ))}
        </div>
      );
    }

    if (isEnum) {
      return (
        <select
          className="border rounded p-1 text-sm"
          value={value === "Any" ? '' : value || ''}
          onChange={e => handleChange(field, e.target.value || "Any")}
        >
          <option value="">Any</option>
          {enumFields[field].map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );
    }

    return (
      <input
        type="text"
        className="border rounded p-1 text-sm w-full"
        value={value === "Any" ? '' : value || ''}
        onChange={e => handleChange(field, e.target.value || "Any")}
      />
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-50">
      <div className="w-full max-w-md bg-white shadow-lg p-6 space-y-4 overflow-y-auto">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-lg font-semibold">🔍 Confirm Your AI Search</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-sm">✖ Close</button>
        </div>

        {!hasParsedFilters && (
          <div className="text-yellow-700 bg-yellow-100 border border-yellow-300 rounded p-3 text-sm">
            ⚠️ We couldn’t extract any filters from your query. You can manually apply filters below or rephrase your query.
          </div>
        )}

        {/* Grouped Filters */}
        {groupedFieldSections.map(({ title, fields }) => (
          <div key={title} className="mb-4">
            <div className="font-semibold text-xs text-gray-600 mb-1">{title}</div>
            {fields.map(field => (
              <div key={field} className="mb-2">
                <div className="text-xs mb-1 text-gray-600">{fieldLabels[field] || field}</div>
                {renderField(field, mergedFilters[field])}
              </div>
            ))}
          </div>
        ))}

        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(mergedFilters)}
            className="px-4 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Run Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default AISearchDrawer;