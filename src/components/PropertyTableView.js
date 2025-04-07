import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import { propertyFieldDisplayConfig } from './propertyFieldDisplayConfig';

const PropertyTableView = ({
  properties = [],
  navigate,
  currentUser
}) => {
  const [expandedRows, setExpandedRows] = useState([]);

  const toggleRow = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const fieldsToShow = propertyFieldDisplayConfig.filter((f) => f.showIn.includes('table'));

  const renderCell = (field, property) => {
    return field.getValue ? field.getValue(property) : property[field.key] || '–';
  };

  if (!properties || properties.length === 0) {
    return <p className="text-center text-gray-500 py-6"></p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-md">
        <thead className="bg-gray-50">
          <tr>
            {fieldsToShow.map((field) => (
              <th
                key={field.key}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {field.label}
              </th>
            ))}
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              View
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {properties.map((property) => {
            const isExpanded = expandedRows.includes(property._id);
            const dd = property.dueDiligence || {};

            return (
              <React.Fragment key={property._id}>
                <tr
                  className="hover:bg-blue-50 cursor-pointer transition"
                  onClick={() => toggleRow(property._id)}
                >
                  {fieldsToShow.map((field) => (
                    <td key={field.key} className="px-4 py-3 text-sm text-gray-700">
                      {renderCell(field, property)}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-sm text-blue-600 underline hover:text-blue-800">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // prevent row toggle
                        window.open(`/shared/${property.shareToken}`, '_blank');
                      }}
                    >
                      <Eye size={14} className="inline-block mr-1" />
                      View
                    </button>
                  </td>
                </tr>

                {isExpanded && (
                  <tr>
                    <td colSpan={fieldsToShow.length + 1} className="bg-gray-50 px-6 py-4 text-sm text-gray-700">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><strong>Flood Zone:</strong> {dd.floodZone || '–'}</div>
                        <div><strong>Bushfire Zone:</strong> {dd.bushfireZone || '–'}</div>
                        <div><strong>Social Housing:</strong> {dd.socialHousing || '–'}</div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PropertyTableView;
