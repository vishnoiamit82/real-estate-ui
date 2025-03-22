import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import { useParams } from 'react-router-dom';

const ClientBriefMatches = () => {
    const { briefId } = useParams();
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedRows, setExpandedRows] = useState({});

    useEffect(() => {
        if (!briefId) {
            setLoading(false);
            return;
        }

        const fetchMatches = async () => {
            try {
                const response = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/client-briefs/${briefId}/matches`);
                setMatches(response.data);
            } catch (error) {
                console.error('Error fetching matches:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, [briefId]);

    const toggleExpand = (id) => {
        setExpandedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'bg-green-500';
        if (score >= 60) return 'bg-yellow-500';
        if (score >= 40) return 'bg-orange-500';
        return 'bg-red-500';
    };


    if (!briefId) return <p className="text-center text-red-500">No Client Brief ID provided.</p>;
    if (loading) return <p className="text-center text-gray-600">Loading matches...</p>;

    return (


        <div className="container mx-auto p-4">


            <h2 className="text-2xl font-bold mb-4 text-center">Matched Properties</h2>
            <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-700">
                <div className="flex items-center gap-2"><span className="w-4 h-4 bg-green-500 rounded"></span> Strong Match (80–100%)</div>
                <div className="flex items-center gap-2"><span className="w-4 h-4 bg-yellow-500 rounded"></span> Good Match (60–79%)</div>
                <div className="flex items-center gap-2"><span className="w-4 h-4 bg-orange-500 rounded"></span> Weak Match (40–59%)</div>
                <div className="flex items-center gap-2"><span className="w-4 h-4 bg-red-500 rounded"></span> Poor Match (&lt;40%)</div>
            </div>

            {matches.length === 0 ? (
                <p className="text-center text-gray-600">No matches found for this client brief.</p>
            ) : (
                <div className="space-y-6">
                    {matches.map(({ property, score, scoreDetails = [], suggestions = [] }) => (
                        <div key={property._id} className="border border-gray-300 rounded-lg shadow-sm p-4 bg-white">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div className="mb-2 sm:mb-0">
                                    <h3 className="text-lg font-semibold">{property.address}</h3>
                                    <p className="text-sm text-gray-600">Asking Price: ${property.askingPrice}</p>
                                    <p className="text-sm text-gray-600">Features: {Array.isArray(property.features) ? property.features.join(', ') : 'N/A'}</p>
                                    <p className="text-sm text-gray-600">Date Created: {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'N/A'}</p>
                                </div>

                                <div className="w-full sm:w-1/2 mt-2 sm:mt-0">
                                    <div className="text-sm text-gray-700 mb-1 font-medium">Match Score:</div>
                                    <div className="bg-gray-200 rounded h-4 w-full">
                                        <div
                                            className={`h-4 rounded text-white text-xs flex items-center justify-center ${getScoreColor(score)}`}
                                            style={{ width: `${score}%` }}
                                        >

                                            {score}%
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-3">
                                <button
                                    onClick={() => window.open(`/properties/${property._id}`, '_blank')}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
                                >
                                    View Property
                                </button>
                                <button
                                    onClick={() => toggleExpand(property._id)}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700"
                                >
                                    {expandedRows[property._id] ? 'Hide Match Explanation' : 'Explain Match'}
                                </button>
                            </div>

                            {expandedRows[property._id] && (
                                <div className="mt-4 bg-gray-50 border border-gray-200 p-4 rounded-md text-sm">
                                    <h4 className="font-semibold mb-2 text-gray-800">Why this property matched:</h4>
                                    {scoreDetails.length > 0 ? (
                                        <ul className="list-disc pl-5 space-y-1 text-gray-700">
                                            {scoreDetails.map((detail, idx) => (
                                                <li key={idx}>
                                                    <span className="inline-flex items-center gap-1">
                                                        <span className="text-base">{detail.icon || '✅'}</span>
                                                        <span>{detail.reason}</span>
                                                    </span>
                                                    <span className="ml-2 text-gray-500">+{detail.points} pts</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500">No score explanation available.</p>
                                    )}

                                    {/* 💡 Suggestions Section */}
                                    {suggestions.length > 0 && (
                                        <div className="mt-4 border-t pt-3">
                                            <h4 className="text-sm font-semibold text-orange-700 mb-2">💡 How to Improve Your Brief:</h4>
                                            <ul className="list-disc pl-5 text-orange-700 space-y-1 text-sm">
                                                {suggestions.map((s, idx) => <li key={idx}>{s}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ClientBriefMatches;
