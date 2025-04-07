export const PROPERTY_SECTION_CONFIGS = {
  full: {
    visibleSections: [
      "Initial Info",
      "Audit & Timestamps",
      "Agent & Created Info",
      "Basic Information",
      "Financial Information",
      "Property Details",
      "Location & Zoning",
      "Due Diligence",
      "Status Tracking",
      "Additional Due Diligence",
      "Documents & Media",
      "Audit & Timestamps",
      

    ],
    showCommLog: true,
    showOriginalDescription: true,
    showDueDiligenceChecklist: true
  },

  shared: {
    visibleSections: [
      "Initial Info",
      "Audit & Timestamps",
      "Basic Information",
      "Financial Information",
      "Property Details",
      "Due Diligence",
      "Location & Zoning",
      "Documents & Media"

    ],
    showCommLog: false,
    showOriginalDescription: false,
    showDueDiligenceChecklist: true // ✅ Usually shared properties need due diligence for transparency
  },

  client: {
    visibleSections: [
      "Basic Information",
      "Financial Information",
      "Property Details",
      "Documents & Media"
    ],
    showCommLog: false,
    showOriginalDescription: false,
    showDueDiligenceChecklist: false
  }
};
