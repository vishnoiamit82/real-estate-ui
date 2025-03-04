import React, { useState, useRef, useEffect } from 'react';
import { Eye, Edit2, NotebookText, Share2, MoreVertical, Trash, RotateCcw, Mail } from 'lucide-react';

const PropertyCardList = ({ 
    properties, 
    navigate, 
    setSelectedPropertyForEmail, 
    setSelectedAgent, 
    setSelectedPropertyForNotes, 
    updateDecisionStatus, 
    restoreProperty, 
    deleteProperty, 
    handleShareProperty 
}) => {
    const [expandedCard, setExpandedCard] = useState(null);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setExpandedCard(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
            {properties.length === 0 ? (
                <p className="text-center text-gray-500 w-full">No properties found.</p>
            ) : (
                properties.map((property) => (
                    <div key={property._id} className="relative bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 border border-gray-300 dark:border-gray-700 flex flex-col">
                        
                        {/* Property Title and Decision Status */}
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold truncate">{property.address || "N/A"}</h3>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-md ${property.is_deleted ? 'bg-red-500 text-white' :
                                property.decisionStatus === 'pursue' ? 'bg-green-500 text-white' :
                                property.decisionStatus === 'on_hold' ? 'bg-yellow-500 text-white' :
                                'bg-gray-500 text-white'}`}>
                                {property.is_deleted ? 'Deleted' : property.decisionStatus || 'Undecided'}
                            </span>
                        </div>

                        {/* Property Details */}
                        <p className="text-sm text-gray-600 dark:text-gray-300">Offer Date: {property.offerClosingDate ? new Date(property.offerClosingDate).toLocaleDateString() : "N/A"}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            {/* Agent: <a href={`/agents/${property.agentId?._id}`} className="text-blue-500 hover:underline">{property.agentId?.name || "N/A"}</a> */}
                            Agent: <span className="text-gray-700">{property.agentId?.name || "N/A"}</span>

                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Price: {property.askingPrice || "N/A"}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Rental Yield: {property.rental ? `${property.rental} | ${property.rentalYield}` : "N/A"}</p>

                        {/* Primary Actions */}
                        <div className="flex justify-between mt-4">
                            <div className="grid grid-cols-2 gap-2 w-full">
                                <button onClick={() => navigate(`/properties/${property._id}`)} className="flex items-center gap-1 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm">
                                    <Eye size={16} /> View
                                </button>
                                <button onClick={() => setSelectedPropertyForNotes(property)} className="flex items-center gap-1 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 text-sm">
                                    <NotebookText size={16} /> Notes
                                </button>
                                <button onClick={() => updateDecisionStatus(property._id, "pursue")} className="flex items-center gap-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm">
                                    Pursue
                                </button>
                                <button onClick={() => updateDecisionStatus(property._id, "on_hold")} className="flex items-center gap-1 px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm">
                                    Hold
                                </button>
                            </div>
                        </div>

                        {/* More Actions Dropdown */}
                        <div className="relative mt-2">
                            <button 
                                onClick={() => setExpandedCard(expandedCard === property._id ? null : property._id)} 
                                className="p-2 bg-gray-300 dark:bg-gray-700 rounded-full hover:bg-gray-400 dark:hover:bg-gray-600 w-full flex justify-center"
                            >
                                <MoreVertical size={20} />
                            </button>

                            {/* Dropdown for More Actions */}
                            {expandedCard === property._id && (
                                <div ref={dropdownRef} className="absolute top-10 right-0 bg-white dark:bg-gray-900 shadow-lg border border-gray-300 dark:border-gray-700 rounded-lg p-2 w-40 z-10">
                                    <button onClick={() => navigate(`/edit-property/${property._id}`)} className="flex items-center w-full gap-2 px-3 py-2 text-blue-600 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md text-sm">
                                        <Edit2 size={16} /> Edit
                                    </button>
                                    <button onClick={() => {
                                        setSelectedPropertyForEmail(property);
                                        setSelectedAgent(property.agentId);
                                    }} className="flex items-center w-full gap-2 px-3 py-2 text-pink-600 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md text-sm">
                                        <Mail size={16} /> Email
                                    </button>
                                    <button onClick={() => handleShareProperty(property._id)} className="flex items-center w-full gap-2 px-3 py-2 text-indigo-600 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md text-sm">
                                        <Share2 size={16} /> Share
                                    </button>
                                    {property.is_deleted ? (
                                        <button onClick={() => restoreProperty(property._id)} className="flex items-center w-full gap-2 px-3 py-2 text-green-600 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md text-sm">
                                            <RotateCcw size={16} /> Restore
                                        </button>
                                    ) : (
                                        <button onClick={() => deleteProperty(property._id)} className="flex items-center w-full gap-2 px-3 py-2 text-red-600 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md text-sm">
                                            <Trash size={16} /> Delete
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default PropertyCardList;
