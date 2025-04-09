// components/PropertySummary.js
import React from 'react';

const PropertySummary = ({ property }) => {
  if (!property) return null;

  const shareUrl = `${window.location.origin}/shared/${property.shareToken}`;

  return (
    <div className="space-y-6">
      {/* Property Details */}
      <section>
        <h3 className="text-lg font-semibold mb-2">🏠 Property Details</h3>
        <ul className="text-sm space-y-1">
          <li><strong>Address:</strong> {property.address}</li>
          <li><strong>Property Type:</strong> {property.propertyType}</li>
          <li><strong>Bedrooms:</strong> {property.bedrooms}</li>
          <li><strong>Bathrooms:</strong> {property.bathrooms}</li>
          <li><strong>Car Spaces:</strong> {property.carSpaces}</li>
          <li><strong>Land Size:</strong> {property.landSize}</li>
          <li><strong>Year Built:</strong> {property.yearBuilt}</li>
        </ul>
      </section>

      {/* Financial Information */}
      <section>
        <h3 className="text-lg font-semibold mb-2">💰 Financial Information</h3>
        <ul className="text-sm space-y-1">
          <li><strong>Asking Price:</strong> {property.askingPrice}</li>
          <li><strong>Rent:</strong> {property.rental}</li>
          <li><strong>Rent Per Week:</strong> ${property.rentPerWeek}</li>
          <li><strong>Yield:</strong> {property.rentalYield}</li>
          <li><strong>Council Rate:</strong> {property.councilRate}</li>
          <li><strong>Insurance:</strong> {property.insurance}</li>
          <li><strong>Offer Closing Date:</strong> {property.offerClosingDate || 'N/A'}</li>
        </ul>
      </section>

      {/* Due Diligence */}
      {property.dueDiligence && (
        <section>
          <h3 className="text-lg font-semibold mb-2">🔎 Due Diligence</h3>
          <ul className="text-sm space-y-1">
            <li><strong>Flood Zone:</strong> {property.dueDiligence.floodZone}</li>
            <li><strong>Bushfire Zone:</strong> {property.dueDiligence.bushfireZone}</li>
            <li><strong>Social Housing:</strong> {property.dueDiligence.socialHousing}</li>
            {property.dueDiligence.additionalChecks?.length > 0 && (
              <li><strong>Additional Checks:</strong> {property.dueDiligence.additionalChecks.join(', ')}</li>
            )}
          </ul>
        </section>
      )}

      {/* Tags */}
      {property.tags?.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold mb-2">🏷️ Tags</h3>
          <div className="flex flex-wrap gap-2">
            {property.tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
              >
                {tag.name} ({tag.type})
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Link */}
      {property.shareToken && (
        <section>
          <p className="text-sm text-gray-500 mt-4">
            🔗 Shared Link:{' '}
            <a
              href={shareUrl}
              className="text-blue-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {shareUrl}
            </a>
          </p>
        </section>
      )}
    </div>
  );
};

export default PropertySummary;
