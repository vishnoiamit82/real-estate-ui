import React from 'react';
import {
  Bed,
  Bath,
  Car,
  Ruler,
  DollarSign,
  Home
} from 'lucide-react';

const PropertyHighlights = ({ property }) => {
  const DisplayValue = ({ value }) => <>{value || '–'}</>;

  return (
    <>
      <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">Property Highlights</h4>
      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-800 dark:text-gray-100">
        {/* Bedroom */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
          <Bed size={16} className="text-indigo-600" />
          <DisplayValue value={property.bedrooms} />
        </div>
        {/* Bathroom */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
          <Bath size={16} className="text-indigo-600" />
          <DisplayValue value={property.bathrooms} />
        </div>
        {/* Car */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
          <Car size={16} className="text-gray-600" />
          <DisplayValue value={property.carSpaces} />
        </div>
        {/* Land Size */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
          <Ruler size={16} className="text-gray-600" />
          <DisplayValue value={property.landSize} />
        </div>
        {/* Price */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
          <DollarSign size={16} className="text-green-600" />
          <DisplayValue value={property.askingPrice} />
        </div>
        {/* Rental Yield */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
          <Home size={16} className="text-blue-600" />
          <DisplayValue value={property.rental ? `${property.rental} | ${property.rentalYield}` : null} />
        </div>
      </div>
      <hr className="my-4 border-gray-200 dark:border-gray-700" />
    </>
  );
};

export default PropertyHighlights;
