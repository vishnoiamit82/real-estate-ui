export function formatAiSearchSummaryGrouped(filters = {}, { showAll = false } = {}) {
    const isValid = (val) => val !== undefined && val !== null && val !== '';
  
    const highlightIfPresent = (fieldName, content) =>
      isValid(filters[fieldName])
        ? `<span class="bg-yellow-100 px-1 rounded">${content}</span>`
        : showAll
        ? `<span class="text-gray-400 italic">${content}</span>`
        : null;
  
    const group = (title, items) => {
      const content = items.filter(Boolean).join('<br>');
      return content
        ? `<div class="mb-4"><div class="font-semibold text-sm text-gray-700 mb-1">${title}</div>${content}</div>`
        : '';
    };
  
    const pricing = group('💰 Pricing', [
      highlightIfPresent('minPrice', `From $${formatPrice(filters.minPrice)}`),
      highlightIfPresent('maxPrice', `To $${formatPrice(filters.maxPrice)}`),
      highlightIfPresent('rentalYieldMin', `Yield ≥ ${filters.rentalYieldMin}%`),
      highlightIfPresent('rentalYieldMax', `Yield ≤ ${filters.rentalYieldMax}%`),
      highlightIfPresent('minRent', `Rent ≥ $${formatPrice(filters.minRent)}/week`),
      highlightIfPresent('maxRent', `Rent ≤ $${formatPrice(filters.maxRent)}/week`)
    ]);
  
    const propertyDetails = group('🏠 Property Details', [
      highlightIfPresent('propertyType', `Type: ${capitalize(filters.propertyType)}`),
      highlightIfPresent('bedrooms', `Min Bedrooms: ${filters.bedrooms}`),
      highlightIfPresent('bathrooms', `Min Bathrooms: ${filters.bathrooms}`),
      highlightIfPresent('carSpaces', `Min Car Spaces: ${filters.carSpaces}`),
      highlightIfPresent('landSizeMin', `Land Size ≥ ${filters.landSizeMin} sqm`),
      highlightIfPresent('yearBuiltMin', `Built after ${filters.yearBuiltMin}`)
    ]);
  
    const tags = group('🏷️ Tags & Features', [
      highlightIfPresent('mustHaveTags', `Must have: ${filters.mustHaveTags?.join(', ')}`)
    ]);
  
    const locations = group('📍 Location', [
      highlightIfPresent('locations', `Regions/Suburbs: ${filters.locations?.join(', ')}`)
    ]);
  
    return [pricing, propertyDetails, tags, locations].filter(Boolean).join('\n') || '⚠️ No specific filters found in your query.';
  }
  
  // Required helpers
  function formatPrice(val) {
    return isNaN(val) ? val : Number(val).toLocaleString();
  }
  
  function capitalize(str) {
    return str?.charAt(0).toUpperCase() + str.slice(1);
  }
  