// utils/initialPropertyFormData.js or similar location
const initialPropertyFormData = {
    // Basic Info
    address: '',
    propertyLink: '',
    offerClosingDate: '',
    agentId: '',
    agentDetails: '', // name/email/phone combined
    currentStatus: 'available',
  
    // Financials
    askingPrice: '',
    rental: '',
    rentalYield: '',
    councilRate: '',
    insurance: '',
  
    // Location & Zoning
    floodZone: '',
    bushfireZone: '',
    zoningType: '',
    landSize: '',
    nearbySchools: [],
    publicTransport: [],
  
    // Visibility Settings
    publicListing: false,
    showAddress: true,
  
    // Media & Docs
    documents: [],
    videos: [],
  
    // Communication
    conversation: [],
    publicConversations: [],
  
    // Optional Future Extension
    rentalYieldPercent: null,
    rentPerWeek: null
  };
  
  export default initialPropertyFormData;
  