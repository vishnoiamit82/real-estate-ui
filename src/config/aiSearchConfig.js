// aiSearchConfig.js

export const fieldLabels = {
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
    tags: "Required Tags",
    floodZone: "Flood Zone",
    bushfireZone: "Bushfire Zone",
    socialHousing: "Social Housing"
  };
  
  export const groupedFieldSections = [
    {
      title: '🏷️ Tags & Features',
      fields: ['tags']
    },
    {
      title: '💰 Pricing',
      fields: ['minPrice', 'maxPrice', 'minRent', 'rentalYieldMin']
    },
    {
      title: '🏠 Property Details',
      fields: ['propertyType', 'bedrooms', 'bathrooms', 'carSpaces', 'landSizeMin', 'yearBuiltMin']
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