import React, { useState } from 'react';
import Select from 'react-select';
import { fieldLabels, groupedFieldSections } from '../config/aiSearchConfig';

const isFieldFilled = (val) => {
  if (Array.isArray(val)) return val.length > 0;
  if (typeof val === 'string') return val.trim().toLowerCase() !== 'any' && val.trim() !== '';
  return val !== null && val !== undefined;
};

const AISearchDrawer = ({
  isOpen,
  onClose,
  filters = {},
  availableTags = [],
  setPendingFilters,
  onConfirm,
}) => {
  const [showOtherFilters, setShowOtherFilters] = useState(false);

  const handleChange = (field, value) => {
    setPendingFilters(prev => ({ ...prev, [field]: value }));
  };


  const renderField = (field, value) => {
    if (field === 'tags') {
      const tagArray = Array.isArray(value) ? value : [];

      if (!availableTags || availableTags.length === 0) {
        return <div className="text-sm text-gray-400 italic">Loading tag options...</div>;
      }

      return (
        <Select
          isMulti
          options={availableTags.map(tag => ({
            label: `${tag.name} (${tag.type})`,
            value: tag,
          }))}
          value={tagArray.map(tag => {
            if (typeof tag === 'object' && tag.name && tag.type) {
              return { label: `${tag.name} (${tag.type})`, value: tag };
            } else if (typeof tag === 'string') {
              return { label: tag, value: { name: tag, type: 'unknown' } };
            }
            return { label: 'Invalid', value: tag };
          })}
          onChange={(selected) => {
            const selectedTags = selected.map(option => option.value);
            handleChange(field, selectedTags);
          }}
          className="text-sm"
          placeholder="Search and select tags..."
        />
      );
    }


    if (Array.isArray(value)) {
      return (
        <div className="flex flex-wrap gap-2">
          {value.map((option, index) => (
            <span key={index} className="px-3 py-1 rounded-full text-xs bg-gray-200">
              {typeof option === 'object' && option.name
                ? `${option.name} (${option.type})`
                : String(option)}
            </span>
          ))}
        </div>
      );
    }


    return (
      <input
        type="text"
        className="border rounded p-1 text-sm w-full"
        value={value === 'Any' ? '' : value || ''}
        onChange={e => handleChange(field, e.target.value || 'Any')}
      />
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-50">
      <div className="w-full max-w-md bg-white shadow-lg p-6 space-y-4 overflow-y-auto">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-lg font-semibold">🔍 Confirm Your AI Search</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-sm">✖ Close</button>
        </div>

        {/* Filled Fields */}
        {groupedFieldSections.map(({ title, fields }) => (
          <div key={title} className="mb-4">
            <div className="font-semibold text-xs text-gray-600 mb-1">{title}</div>
            {fields.map(field => {
              const value = filters[field];
              const filled = isFieldFilled(value);

              return (
                <div key={field} className={`mb-2 transition-all ${filled ? 'bg-purple-50 border border-purple-200 p-2 rounded-md' : ''}`}>
                  <div className="text-xs mb-1 text-gray-600">{fieldLabels[field] || field}</div>
                  {renderField(field, value)}
                </div>
              );
            })}
          </div>
        ))}


        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(filters)}
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
