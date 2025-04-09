import React, { useState, useRef, useEffect,useMemo } from 'react';
import PropertyMetaCard from './PropertyMetaCard';

import { useNavigate } from 'react-router-dom';

import {
    MoreVertical,
    Mail,
    StickyNote,
    Eye,
    Star,
    Send,
    Save,
    CheckCircle,
    Clock,
    Trash2,
    Share2,
    Share,
    Undo2,
    MessageSquare
} from 'lucide-react';
import { getPropertyActions } from '../utils/getPropertyActions';

    // Wherever you map over properties (e.g. PropertyCardList or PropertySourcingPage)
import useUnreadEmailCounts from '../hooks/userUnreadEmailCounts';



const PropertyCardList = ({
    properties = [],
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
    currentUser,
    setAiSearchActive,     // ✅ NEW
    onAiSearch,            // ✅ NEW
    setCurrentPage         // ✅ NEW
}) => {
    const [expandedCard, setExpandedCard] = useState(null);
    const dropdownRef = useRef(null);
    const navigateTo = useNavigate(); // keep this for navigation



    const propertyIds = useMemo(() => properties.map(p => p._id), [properties]);

    const unreadCounts = useUnreadEmailCounts(propertyIds);


    // ✅ Handle tag click to trigger backend search
    const handleTagClick = (tag) => {
        const tagName = typeof tag === 'object' ? tag.name : tag;
        navigate(`/search/tag/${encodeURIComponent(tagName)}`);
      };
      

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setExpandedCard(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const iconMap = {
        Email: Mail,
        Notes: StickyNote,
        View: Eye,
        'Save Property': Star,
        'Message Poster': MessageSquare,
        Pursue: CheckCircle,
        'On Hold': Clock,
        Delete: Trash2,
        Share: Share2,
        'Share to Community': Share,
        'Unshare from Community': Undo2,
        Restore: Undo2
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
            {properties.map((property) => {
                const actions = getPropertyActions({
                    property,
                    source: property.source,
                    unreadCounts, 
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
                    }
                });

                const primaryActions = actions.filter((a) => a.type === 'primary');
                const moreActions = actions.filter((a) => a.type === 'secondary');

                return (
                    <div
                        key={property._id}
                        className="relative bg-white dark:bg-gray-800 shadow-md rounded-2xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
                    >
                        {/* Header */}
                        <div className="mb-3">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                {property.propertyLink ? (
                                    <a
                                        href={property.propertyLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline hover:text-blue-800"
                                    >
                                        {property.address || 'N/A'}
                                    </a>
                                ) : (
                                    property.address || 'N/A'
                                )}
                            </h3>

                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                <span
                                    className={`px-2 py-1 text-xs font-semibold rounded-full ${property.isCommunityShared
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-blue-100 text-blue-800'
                                        }`}
                                >
                                    {property.source === 'created'
                                        ? property.isCommunityShared
                                            ? 'My Property (Shared)'
                                            : 'My Property (Private)'
                                        : property.isCommunityShared && property.sharedBy?._id === currentUser?.id
                                            ? 'Your Property on Community Board'
                                            : 'Community Property'}
                                </span>

                                {property.agentId?.name && (
                                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-700">
                                        Agent: {property.agentId.name}
                                    </span>
                                )}

                                {(property.source === 'created' || property.source === 'saved') && (
                                    <span
                                        className={`px-2 py-1 text-xs font-semibold rounded-full ${property.is_deleted
                                            ? 'bg-red-500 text-white'
                                            : property.decisionStatus === 'pursue'
                                                ? 'bg-green-500 text-white'
                                                : property.decisionStatus === 'on_hold'
                                                    ? 'bg-yellow-500 text-white'
                                                    : 'bg-gray-500 text-white'
                                            }`}
                                    >
                                        {property.is_deleted ? 'Deleted' : property.decisionStatus || 'Undecided'}
                                    </span>
                                )}
                            </div>

                            <p className="text-xs text-gray-500 mt-2">
                                {property.source === 'created' ? (
                                    property.isCommunityShared
                                        ? 'You created this property and shared it with the community.'
                                        : 'You created this property privately.'
                                ) : property.isCommunityShared && property.sharedBy?._id === currentUser?.id ? (
                                    'This property was created and shared by you.'
                                ) : (
                                    <>
                                        This property was shared by{' '}
                                        <span className="font-semibold text-indigo-700">
                                            {property.sharedBy?.name || 'another user'}
                                        </span>
                                        .
                                    </>
                                )}
                            </p>

                            {/* Timestamps */}
                            <div className="text-xs text-gray-400 mt-1">
                                Created: {new Date(property.createdAt).toLocaleString()}<br />
                                Updated: {new Date(property.updatedAt).toLocaleString()}
                            </div>
                        </div>

                        {/* Meta Info */}
                        <PropertyMetaCard property={property} />


                        {/* Tags */}
                        {
                            Array.isArray(property.tags) && property.tags.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {property.tags.map((tag, idx) => (
                                        <span
                                            key={idx}
                                            onClick={() => handleTagClick(tag)}
                                            className="inline-block text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200 cursor-pointer hover:bg-blue-100"
                                        >
                                            #{typeof tag === 'object' ? tag.name : tag}
                                        </span>
                                    ))}
                                </div>
                            )
                        }


                        {/* Actions */}
                        <div className="mt-auto pt-4">
                            <div className="grid grid-cols-2 gap-2 w-full">
                                {primaryActions.map((action, index) => {
                                    const Icon = iconMap[action.label] || Send;
                                    return (
                                        <button
                                            key={index}
                                            onClick={action.onClick}
                                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white bg-gray-600 hover:bg-gray-700"
                                        >
                                            <Icon size={16} />
                                            {action.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* More Actions Dropdown */}
                        <div className="relative mt-3">
                            {moreActions.length > 0 && (
                                <>
                                    <button
                                        onClick={() =>
                                            setExpandedCard(expandedCard === property._id ? null : property._id)
                                        }
                                        className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full w-full hover:bg-gray-300 dark:hover:bg-gray-600 flex justify-center"
                                    >
                                        <MoreVertical size={20} />
                                    </button>
                                    {expandedCard === property._id && (
                                        <div
                                            ref={dropdownRef}
                                            className="absolute top-12 right-0 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg z-50 animate-fade-in"
                                        >
                                            {moreActions.map((action, index) => {
                                                const Icon = iconMap[action.label] || Send;
                                                return (
                                                    <button
                                                        key={index}
                                                        onClick={() => {
                                                            action.onClick();
                                                            setExpandedCard(null);
                                                        }}
                                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                                                    >
                                                        <Icon size={16} />
                                                        {action.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default PropertyCardList;