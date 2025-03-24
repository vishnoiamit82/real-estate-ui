import React from 'react';
import PropertyHighlights from './PropertyHighlights';
import PropertyAdditionalInformation from './PropertyAdditionalInformation';

const PropertyMetaCard = ({ property }) => {
  return (
    <div className="mt-4">
      <PropertyHighlights property={property} />
      <PropertyAdditionalInformation property={property} />
    </div>
  );
};

export default PropertyMetaCard;
