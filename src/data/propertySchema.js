const propertySchemaFields = {
    "Basic Information": [
        { key: "address", label: "🏡 Address", type: "text" },
        { key: "propertyLink", label: "🔗 Property Link", type: "text" },
        { key: "propertyType", label: "🏠 Property Type", type: "text" },
        { key: "yearBuilt", label: "📅 Year Built", type: "text" },
        { key: "isOffmarket", label: "📉 Is Off-Market", type: "boolean" },
        { key: "offerClosingDate", label: "📅 Offer Closing Date", type: "text" },
        { key: "upcomingInspectionDate", label: "🔍 Upcoming Inspection", type: "text" },
        { key: "videoAvailableDate", label: "🎥 Video Available Date", type: "text" }
    ],

    "Financial Information": [
        { key: "askingPrice", label: "💰 Asking Price", type: "text" },
        { key: "rental", label: "🏠 Rental Per Week", type: "text" },
        { key: "rentalYield", label: "📈 Rental Yield", type: "text" },
        { key: "councilRate", label: "🏛️ Council Rate", type: "text" },
        { key: "insurance", label: "🛡️ Insurance Amount", type: "text" }
    ],

    "Property Details": [
        { key: "bedrooms", label: "🛏️ Bedrooms", type: "number" },
        { key: "bathrooms", label: "🛁 Bathrooms", type: "number" },
        { key: "carSpaces", label: "🚗 Car Spaces", type: "number" },
        { key: "landSize", label: "📏 Land Size", type: "text" },
        { key: "features", label: "✨ Features", type: "array" }
    ],

    "Location & Zoning": [
        { key: "zoningType", label: "📐 Zoning Type", type: "text" },
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
        { key: "decisionStatus", label: "📊 Decision Status", type: "dropdown", options: ["undecided", "pursue", "on_hold"] }
    ],

    "Agent & Created Info": [
        { key: "agentId.name", label: "👤 Agent Name", type: "text" },
        { key: "agentId.email", label: "📧 Agent Email", type: "text" },
        { key: "agentId.phoneNumber", label: "📞 Agent Phone", type: "text" },
        { key: "createdBy.name", label: "👨‍💼 Created By (User Name)", type: "text" }
    ],

    "Audit & Timestamps": [
        { key: "createdAt", label: "📅 Created At", type: "datetime" },
        { key: "updatedAt", label: "📅 Updated At", type: "datetime" },
        { key: "deleted_at", label: "🗑️ Deleted At", type: "datetime" }
    ]

};

export default propertySchemaFields;
