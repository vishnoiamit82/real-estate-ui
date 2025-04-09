// components/ShareButtons.js
import React from 'react';
import {
  FacebookIcon,
  FacebookShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  LinkedinIcon,
  LinkedinShareButton,
} from 'react-share';

const formatValue = (value) => value ? value : 'TBC';

const generateFullSummary = (property, shareUrl) => {
  if (!property) return '';

  const lines = [
  
    `🏠 *Property Details*`,
    `• 📍 Address: ${formatValue(property.address)}`,
    `• 🏡 Type: ${formatValue(property.propertyType)}`,
    `• 🛏 Bedrooms: ${formatValue(property.bedrooms)}`,
    `• 🛁 Bathrooms: ${formatValue(property.bathrooms)}`,
    `• 🚗 Car Spaces: ${formatValue(property.carSpaces)}`,
    `• 📐 Land Size: ${formatValue(property.landSize)}`,
    `• 🛠️ Year Built: ${formatValue(property.yearBuilt)}`,
    '',
    `💰 *Financial Information*`,
    `• 💵 Asking Price: ${formatValue(property.askingPrice)}`,
    `• 💸 Rent: ${formatValue(property.rental)}`,
    `• 📅 Rent/Week: ${formatValue(property.rentPerWeek)}`,
    `• 📈 Yield: ${formatValue(property.rentalYield)}`,
    `• 🏛️ Council Rate: ${formatValue(property.councilRate)}`,
    `• 🛡️ Insurance: ${formatValue(property.insurance)}`,
    `• 📆 Offer Closing: ${formatValue(property.offerClosingDate)}`,
    '',
    `🔎 *Due Diligence*`,
    `• 🌊 Flood Zone: ${formatValue(property.dueDiligence?.floodZone)}`,
    `• 🔥 Bushfire Zone: ${formatValue(property.dueDiligence?.bushfireZone)}`,
    `• 🏘️ Social Housing: ${formatValue(property.dueDiligence?.socialHousing)}`,
    property.dueDiligence?.additionalChecks?.length
      ? `• ✅ Additional Checks: ${property.dueDiligence.additionalChecks.join(', ')}`
      : null,
    '',
    property.tags?.length
      ? `🏷️ *Tags*: ${(property.tags || []).map(tag => tag.name).join(', ')}`
      : null,
    '',
    `🔗 *View Property:* ${shareUrl}`
  ].filter(Boolean);

  return lines.join('\n');
};

const ShareButtons = ({ property, shareUrl }) => {
  if (!property || !shareUrl) return null;

  const fullSummary = generateFullSummary(property, shareUrl);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullSummary);
      alert('Summary copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy summary.');
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <WhatsappShareButton url={shareUrl} title={fullSummary}>
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>

      <FacebookShareButton url={shareUrl} quote={fullSummary}>
        <FacebookIcon size={32} round />
      </FacebookShareButton>

      <LinkedinShareButton url={shareUrl} summary={fullSummary}>
        <LinkedinIcon size={32} round />
      </LinkedinShareButton>

      <button
        onClick={handleCopy}
        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-sm rounded shadow"
      >
        📋 Copy Summary
      </button>
    </div>
  );
};

export default ShareButtons;