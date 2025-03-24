import React from 'react';
import {
  Calendar,
  User,
  Building2,
  Landmark,
  Droplet,
  Flame
} from 'lucide-react';

const PropertyAdditionalInformation = ({ property }) => {
  const DisplayValue = ({ value }) => <>{value || '–'}</>;

  return (
    <details className="mt-4 text-sm text-gray-700 dark:text-gray-300 group">
      <summary className="cursor-pointer text-blue-600 hover:underline font-medium mb-2">
        View additional property information
      </summary>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div className="flex items-start gap-2">
          <Calendar size={16} className="text-gray-500 mt-1" />
          <span><strong>Offer Date:</strong> <DisplayValue value={property.offerClosingDate ? new Date(property.offerClosingDate).toLocaleDateString() : null} /></span>
        </div>
        <div className="flex items-start gap-2">
          <User size={16} className="text-gray-500 mt-1" />
          <span><strong>Agent:</strong> <DisplayValue value={property.agentId?.name} /></span>
        </div>
        <div className="flex items-start gap-2">
          <Building2 size={16} className="text-gray-500 mt-1" />
          <span><strong>Year Built:</strong> <DisplayValue value={property.yearBuilt} /></span>
        </div>
        <div className="flex items-start gap-2">
          <Landmark size={16} className="text-gray-500 mt-1" />
          <span><strong>Zoning:</strong> <DisplayValue value={property.zoningType} /></span>
        </div>
        <div className="flex items-start gap-2">
          <Droplet size={16} className="text-blue-600 mt-1" />
          <span><strong>Flood Zone:</strong> <DisplayValue value={property.floodZone} /></span>
        </div>
        <div className="flex items-start gap-2">
          <Flame size={16} className="text-red-600 mt-1" />
          <span><strong>Bushfire Zone:</strong> <DisplayValue value={property.bushfireZone} /></span>
        </div>
      </div>
    </details>
  );
};

export default PropertyAdditionalInformation;
