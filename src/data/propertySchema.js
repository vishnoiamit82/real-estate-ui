const propertySchemaFields = {
    "Basic Information": [
        { key: "address", label: "🏡 Address", type: "text" },
        { key: "propertyLink", label: "🔗 Property Link", type: "text" },
        { key: "propertyType", label: "🏠 Property Type", type: "text" },
        { key: "yearBuilt", label: "📅 Year Built", type: "text" },
        { key: "offMarketStatus", label: "📉 Is Off-Market", type: "boolean" }
    ],
    "Financial Information": [
        { key: "askingPrice", label: "💰 Asking Price", type: "text" },
        { key: "rental", label: "🏠 Rental Price", type: "text" },
        { key: "rentalYield", label: "📈 Rental Yield", type: "text" },
        { key: "councilRate", label: "🏛️ Council Rate", type: "text" }
    ],
    "Property Details": [
        { key: "bedrooms", label: "🛏️ Bedrooms", type: "number" },
        { key: "bathrooms", label: "🛁 Bathrooms", type: "number" },
        { key: "carSpaces", label: "🚗 Car Spaces", type: "number" },
        { key: "landSize", label: "📏 Land Size", type: "text" }
    ],
    "Location & Zoning": [
        { key: "nearbySchools", label: "🏫 Nearby Schools", type: "array" },
        { key: "publicTransport", label: "🚌 Public Transport", type: "array" }
    ],
    "Due Diligence": [
        { key: "dueDiligence.insurance", label: "🛡️ Insurance Status", type: "dropdown", options: ["pending", "completed", "failed"] },
        { key: "dueDiligence.floodZone", label: "🌊 Flood Zone Status", type: "dropdown", options: ["pending", "completed", "failed"] },
        { key: "dueDiligence.bushfireZone", label: "🔥 Bushfire Zone Status", type: "dropdown", options: ["pending", "completed", "failed"] },
        { key: "dueDiligence.socialHousing", label: "🏢 Social Housing Status", type: "dropdown", options: ["pending", "completed", "failed"] }
    ],
    "Additional Due Diligence": [
        { key: "dueDiligence.additionalChecks", label: "➕ Additional Checks", type: "array", editable: true }
    ],
    "Status Tracking": [
        { key: "currentStatus", label: "📌 Current Status", type: "dropdown", options: ["available", "sold", "offer_accepted"] },
        { key: "decisionStatus", label: "📊 Decision Status", type: "dropdown", options: ["undecided", "pursue", "on_hold"] },
        { key: "propertyCondition", label: "🏚️ Property Condition", type: "text" }
    ]
};

export default propertySchemaFields;
