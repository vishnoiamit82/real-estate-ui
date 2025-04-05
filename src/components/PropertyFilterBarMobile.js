// components/PropertyFilterBarMobile.js
import React, { useState } from 'react';
import {
    Search,
    Sparkles,
    X,
    SlidersHorizontal
} from 'lucide-react';

const PropertyFilterBarMobile = ({
    searchQuery,
    setSearchQuery,
    aiSearchActive,
    setAiSearchActive,
    searchMode,
    setSearchMode,
    onAiSearch,
    onOpenFilterDrawer,
    setCurrentPage
}) => {
    const [searchFocused, setSearchFocused] = useState(false);

    const exampleQueries = [
        "Looking for a house in Mildura for around $550k built after year 2000.",
        "Looking in Albury min land size of 600sqm",
        "Anything under $800k with dual income",
        "Properties with minimum yield of 6 percent",
        "Property with plans and permits in place"
    ];

    const handleAiSearch = async () => {
        if (!searchQuery.trim()) return;

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/public/ai-search`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: searchQuery })
            });
            const data = await response.json();
            setAiSearchActive(true);
            onAiSearch(data.results || []);
            setCurrentPage(1);
        } catch (err) {
            console.error('AI Search failed:', err);
            alert('AI Search failed. Please try again.');
        }
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setAiSearchActive(false);
        onAiSearch(null);
        setCurrentPage(1);
    };

    return (
        <div className="bg-white px-4 py-3 shadow rounded-md space-y-3">
            <div className="flex gap-2 text-sm">
                <button
                    onClick={() => setSearchMode('ai')}
                    className={`flex-1 py-1 rounded-full ${searchMode === 'ai' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                    ✨ AI Search
                </button>
                <button
                    onClick={() => setSearchMode('normal')}
                    className={`flex-1 py-1 rounded-full ${searchMode === 'normal' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                    🔍 Normal
                </button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder={aiSearchActive ? 'AI filter applied...' : 'Search...'}
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (searchMode === 'normal') {
                            setAiSearchActive(false);
                            onAiSearch(null);
                            setCurrentPage(1);
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && searchMode === 'ai') handleAiSearch();
                    }}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setTimeout(() => setSearchFocused(false), 100)}
                    className="w-full pl-10 pr-24 py-2 text-sm border rounded-full border-gray-300"
                    disabled={aiSearchActive && searchMode === 'ai'}
                />
                {searchQuery && (
                    <button
                        onClick={handleClearSearch}
                        className="absolute right-16 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                        <X size={16} />
                    </button>
                )}
                {searchMode === 'ai' && (
                    <button
                        onClick={handleAiSearch}
                        className="absolute right-2 top-1.5 text-xs px-3 py-1 bg-gray-800 text-white rounded-full"
                        disabled={aiSearchActive}
                    >
                        <Sparkles size={12} className="inline-block mr-1" /> Search
                    </button>
                )}
            </div>

            <div className="flex justify-end">
                <button
                    onClick={onOpenFilterDrawer}
                    className="flex items-center text-sm text-gray-600 border border-gray-300 px-3 py-1 rounded-full"
                >
                    <SlidersHorizontal className="w-4 h-4 mr-1" /> Filters
                </button>
            </div>

            {searchFocused && !searchQuery && !aiSearchActive && searchMode === 'ai' && (
                <div className="text-xs text-gray-500">
                    <p className="mb-1">Try:</p>
                    <div className="flex flex-wrap gap-2">
                        {exampleQueries.map((q, i) => (
                            <button
                                key={i}
                                type="button"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    setSearchQuery(q);
                                }}
                                className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-xs"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {searchFocused && !searchQuery && !aiSearchActive && searchMode === 'normal' && (
                <div className="text-xs text-gray-600 mt-2 max-w-5xl mx-auto">
                    <p className="mb-1">You can search by:</p>
                    <ul className="list-disc list-inside text-gray-500 space-y-1">
                        <li>🏠 Address (e.g., <em>12 Smith St</em>)</li>
                        <li>👤 Agent or poster name (e.g., <em>John</em>)</li>
                        <li>📍 Suburb or region (e.g., <em>Albury</em>, <em>Central Coast</em>)</li>
                        <li>💬 Keywords (e.g., <em>dual income</em>, <em>renovation</em>)</li>
                    </ul>
                </div>
            )}

        </div>
    );
};

export default PropertyFilterBarMobile;