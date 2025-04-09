import React from 'react';
import PropertyHighlights from './PropertyHighlights';
import PropertyAdditionalInformation from './PropertyAdditionalInformation';

const PropertyMetaCard = ({ property }) => {
    return (
        <div className="flex-grow flex flex-col justify-between min-h-[160px]">
            <div className="min-h-[80px]">
                <PropertyHighlights property={property} />
                <hr className="my-3 border-gray-200 dark:border-gray-700" />
            </div>
            <div className="mt-auto">
                <PropertyAdditionalInformation property={property} />
            </div>
        </div>
    );
};



export default PropertyMetaCard;
