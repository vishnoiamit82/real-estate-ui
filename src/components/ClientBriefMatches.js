import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import { useParams } from 'react-router-dom';

const ClientBriefMatches = () => {
    const { briefId } = useParams(); // Get the briefId from the URL
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('Client Brief ID from URL:', briefId);
        if (!briefId) {
            setLoading(false);
            return;
        }

        const fetchMatches = async () => {
            try {
                const response = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/client-briefs/${briefId}/matches`);
                setMatches(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching matches:', error);
            }
        };

        fetchMatches();
    }, [briefId]);

    if (!briefId) {
        return <p className="text-center text-red-500">No Client Brief ID provided.</p>;
    }

    if (loading) return <p>Loading matches...</p>;

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Matched Properties</h2>
            {matches.length === 0 ? (
                <p>No matches found for this client brief.</p>
            ) : (
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-2 text-left">Address</th>
                            <th className="border border-gray-300 p-2 text-left">Asking Price</th>
                            <th className="border border-gray-300 p-2 text-left">Features</th>
                            <th className="border border-gray-300 p-2 text-left">Match Score</th>
                            <th className="border border-gray-300 p-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {matches.map(({ property, score }) => (
                            <tr key={property._id}>
                                <td className="p-2">{property.address}</td>
                                <td className="p-2">${property.askingPrice}</td>
                                <td className="p-2">{Array.isArray(property.features) ? property.features.join(', ') : 'N/A'}</td>
                                <td className="p-2">
                                    <div className="bg-gray-200 w-full rounded">
                                        <div
                                            className={`bg-green-500 text-white text-center text-xs rounded`}
                                            style={{ width: `${score}%` }}
                                        >
                                            {score}%
                                        </div>
                                    </div>
                                </td>
                                <td className="p-2">
                                    <button
                                        onClick={() => window.open(`/properties/${property._id}`, '_blank')}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};


export default ClientBriefMatches;


