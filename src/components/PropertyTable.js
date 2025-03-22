
import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';
import { getPropertyActions } from '../utils/getPropertyActions';

const PropertyCardList = ({
    properties,
    navigate,
    setSelectedPropertyForEmail,
    setSelectedAgent,
    setSelectedPropertyForNotes,
    updateDecisionStatus,
    restoreProperty,
    deleteProperty,
    handleShareProperty,
    handleShareToCommunity,
    handleSaveToMyList,
    handleUnshareFromCommunity,
    handlePursueCommunityProperty,
    deleteSavedProperty,
    currentUser
}) => {
    const [expandedCard, setExpandedCard] = useState(null);
    const dropdownRef = useRef(null);


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
                properties.map((property) => {
                    const actions = getPropertyActions({
                        property,
                        source: property.source,
                        handlers: {
                            navigate,
                            setSelectedPropertyForEmail,
                            setSelectedAgent,
                            setSelectedPropertyForNotes,
                            updateDecisionStatus,
                            deleteProperty,
                            restoreProperty,
                            handleShareProperty,
                            handleShareToCommunity,
                            handleSaveToMyList,
                            handleUnshareFromCommunity,
                            handlePursueCommunityProperty,
                            deleteSavedProperty,
                            currentUser
                        },
                    });

                    const primaryActions = actions.filter(action => action.type === 'primary');
                    const moreActions = actions.filter(action => action.type === 'secondary');


                    return (
                        <div
                            key={property._id}
                            className={`relative bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 border ${property.isCommunityShared ? 'border-green-500' : 'border-gray-300'
                                } dark:border-gray-700 flex flex-col`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-semibold truncate">
                                        {property.propertyLink ? (
                                            <a href={property.propertyLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">
                                                {property.address || "N/A"}
                                            </a>
                                        ) : (
                                            property.address || "N/A"
                                        )}
                                    </h3>


                                    {/* 🏷 Property Source Badge */}
                                    {property.source === 'created' ? (
                                        <span className={`text-xs px-2 py-1 rounded-md mt-1 font-medium inline-block ${property.isCommunityShared ? 'bg-blue-100 text-blue-800' : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            🛠 {property.isCommunityShared ? 'My Property (Shared on Community Board)' : 'My Property (Private)'}
                                        </span>
                                    ) : (
                                        // Special case: Property on community board but created by the current user (edge case on community page)
                                        (property.isCommunityShared && property.sharedBy?._id === currentUser?.id) ? (
                                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md mt-1 font-medium inline-block">
                                                🪪 Your Property on Community Board
                                            </span>
                                        ) : (
                                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-md mt-1 font-medium inline-block">
                                                🌍 Community Property
                                            </span>
                                        )
                                    )}

                                    {/* 📍 Source Subtext Description */}
                                    <div className="text-xs text-gray-500 mt-1">
                                        {property.source === 'created' ? (
                                            property.isCommunityShared ? (
                                                <>You created this property and shared it with the community.</>
                                            ) : (
                                                <>You created this property privately.</>
                                            )
                                        ) : (
                                            (property.isCommunityShared && property.sharedBy?._id === currentUser?.id) ? (
                                                <>This property was created and shared by you.</>
                                            ) : (
                                                <>This property was shared by <span className="font-semibold text-indigo-700">{property.sharedBy?.name || 'another user'}</span>.</>
                                            )
                                        )}
                                    </div>
                                </div>


                                {/* Decision Status Tag (only show for non-community properties) */}
                                {(property.source === 'created' || property.source === 'saved') && (
                                    <div className="flex-shrink-0 ml-2">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-md ${property.is_deleted
                                            ? 'bg-red-500 text-white'
                                            : property.decisionStatus === 'pursue'
                                                ? 'bg-green-500 text-white'
                                                : property.decisionStatus === 'on_hold'
                                                    ? 'bg-yellow-500 text-white'
                                                    : 'bg-gray-500 text-white'
                                            }`}>
                                            {property.is_deleted ? 'Deleted' : property.decisionStatus || 'Undecided'}
                                        </span>
                                    </div>
                                )}
                            </div>


                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700 dark:text-gray-300 mt-2">
                                <div><strong>Offer Date:</strong> {property.offerClosingDate ? new Date(property.offerClosingDate).toLocaleDateString() : "N/A"}</div>

                                <div>
                                    {property.isCommunityShared ? (
                                        <> <strong>Posted by:</strong> <span className="font-semibold text-indigo-700">{property.sharedBy?.name || 'Unknown'}</span> </>
                                    ) : (
                                        <> <strong>Agent:</strong> <span className="text-gray-700">{property.agentId?.name || 'N/A'}</span> </>
                                    )}
                                </div>

                                <div><strong>Price:</strong> {property.askingPrice || "N/A"}</div>
                                <div><strong>Rental Yield:</strong> {property.rental ? `${property.rental} | ${property.rentalYield}` : "N/A"}</div>
                                <div><strong>Bedrooms:</strong> {property.bedrooms || 'N/A'}</div>
                                <div><strong>Bathrooms:</strong> {property.bathrooms || 'N/A'}</div>
                                <div><strong>Car Spaces:</strong> {property.carSpaces || 'N/A'}</div>
                                <div><strong>Land Size:</strong> {property.landSize || 'N/A'}</div>
                                <div><strong>Year Built:</strong> {property.yearBuilt || 'N/A'}</div>
                                <div><strong>Zoning:</strong> {property.zoningType || 'N/A'}</div>
                                <div><strong>Flood Zone:</strong> {property.floodZone || 'N/A'}</div>
                                <div><strong>Bushfire Zone:</strong> {property.bushfireZone || 'N/A'}</div>
                            </div>





                            <div className="flex justify-between mt-4">
                                <div className="grid grid-cols-2 gap-2 w-full">
                                    {primaryActions.map((action, index) => (
                                        <button
                                            key={index}
                                            onClick={action.onClick}
                                            className={`flex items-center gap-1 px-3 py-2 rounded text-sm text-white
                                        ${action.label === 'View' ? 'bg-gray-600 hover:bg-gray-700' :
                                                    action.label === 'Notes' ? 'bg-purple-600 hover:bg-purple-700' :
                                                        action.label === 'Pursue' ? 'bg-green-600 hover:bg-green-700' :
                                                            action.label === 'On Hold' ? 'bg-yellow-500 hover:bg-yellow-600' :
                                                                action.label === 'Save Property' ? 'bg-blue-600 hover:bg-blue-700' :
                                                                    action.label === 'Message Poster' ? 'bg-pink-600 hover:bg-pink-700' : 'bg-gray-400'}`}
                                        >
                                            <action.icon size={16} />
                                            {action.label}
                                        </button>
                                    ))}
                                </div>

                            </div>

                            <div className="relative mt-2">
                                <button
                                    onClick={() => setExpandedCard(expandedCard === property._id ? null : property._id)}
                                    className="p-2 bg-gray-300 dark:bg-gray-700 rounded-full hover:bg-gray-400 dark:hover:bg-gray-600 w-full flex justify-center"
                                >
                                    <MoreVertical size={20} />
                                </button>

                                {expandedCard === property._id && moreActions.length > 0 && (
                                    <div
                                        ref={dropdownRef}
                                        className="absolute top-10 right-0 w-52 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-md z-50 animate-fade-in"
                                    >
                                        {moreActions.map((action, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    action.onClick();
                                                    setExpandedCard(null);
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-150 rounded"
                                            >
                                                <action.icon size={16} className="text-gray-500" />
                                                <span className="truncate">{action.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}


                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default PropertyCardList;
