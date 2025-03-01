import React, { useState } from 'react';
import { Eye, Edit2, Trash, RotateCcw, NotebookText, Mail, Share2, PanelRight, X } from 'lucide-react';

const PropertyTable = ({ properties, navigate, setSelectedPropertyForEmail, setSelectedAgent, setSelectedPropertyForNotes, handleSort, sortKey, sortOrder, updateDecisionStatus, restoreProperty, deleteProperty, handleShareProperty }) => {
    const [selectedProperty, setSelectedProperty] = useState(null);

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 dark:border-gray-700 text-xs md:text-sm lg:text-base">
                <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800 text-left">
                        <th className="border p-2">Decision</th>
                        <th className="border p-2">Address</th>
                        <th className="border p-2">Notes</th>
                        <th className="border p-2 cursor-pointer" onClick={() => handleSort('offerClosingDate')}>Offer Date {sortKey === 'offerClosingDate' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                        <th className="border p-2">Status</th>
                        <th className="border p-2">Agent</th>
                        <th className="border p-2">Price</th>
                        <th className="border p-2 cursor-pointer" onClick={() => handleSort('createdAt')}>Created {sortKey === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                        <th className="border p-2">Yield</th>
                        <th className="border p-2 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {properties.length === 0 ? (
                        <tr>
                            <td colSpan="10" className="text-center p-4">No properties found.</td>
                        </tr>
                    ) : (
                        properties.map((property) => (
                            <tr key={property._id} className="border-t border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs md:text-sm lg:text-base">
                                <td className="p-2 text-center">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-md ${property.decisionStatus === 'pursue' ? 'bg-green-500 text-white' : property.decisionStatus === 'on_hold' ? 'bg-yellow-500 text-white' : 'bg-gray-500 text-white'}`}>{property.decisionStatus}</span>
                                </td>
                                <td className="p-2 truncate max-w-[120px] md:max-w-[200px]">
                                    {property.showAddress ? (
                                        property.propertyLink ? (
                                            <a href={property.propertyLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-700">{property.address || "N/A"}</a>
                                        ) : (
                                            <span>{property.address || "N/A"}</span>
                                        )
                                    ) : (
                                        <span>Hidden</span>
                                    )}
                                </td>
                                <td className="p-2 text-center">
                                    <button onClick={() => setSelectedPropertyForNotes(property)} className="px-2 py-1 bg-purple-500 text-white rounded-md hover:bg-purple-600 flex items-center">
                                        <NotebookText size={14} />
                                    </button>
                                </td>
                                <td className="p-2 text-center">{property.offerClosingDate ? new Date(property.offerClosingDate).toLocaleDateString() : "N/A"}</td>
                                <td className="p-2 text-center">{property.currentStatus === "available" ? "Available" : "Sold"}</td>
                                <td className="p-2 truncate max-w-[120px] md:max-w-[150px]">
                                    <a href={`/agents/${property.agentId?._id}`} className="text-blue-500 underline hover:text-blue-700">
                                        {property.agentId?.name || "N/A"}
                                    </a>
                                </td>
                                <td className="p-2 text-center">{property.askingPrice || "N/A"}</td>
                                <td className="p-2 text-center">{property.createdAt ? new Date(property.createdAt).toLocaleDateString() : "N/A"}</td>
                                <td className="p-2 text-center">{property.rental ? `${property.rental} | ${property.rentalYield}` : "N/A"}</td>

                                {/* Actions Column */}
                                <td className="p-2 text-center relative">
                                    <button onClick={() => setSelectedProperty(property)} className="p-2 bg-gray-600 text-white rounded-md">
                                        <PanelRight size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Side Panel for Actions */}
            {selectedProperty && (
                <div className="fixed right-0 top-0 w-72 md:w-96 h-full bg-white dark:bg-gray-900 shadow-lg p-6 z-50 border-l border-gray-300 dark:border-gray-700 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Actions</h3>
                        <button onClick={() => setSelectedProperty(null)} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                            <X size={20} />
                        </button>
                    </div>
                    <button onClick={() => navigate(`/properties/${selectedProperty._id}`)} className="w-full mb-2 p-3 bg-gray-500 text-white rounded-md hover:bg-gray-600">View</button>
                    <button onClick={() => navigate(`/edit-property/${selectedProperty._id}`)} className="w-full mb-2 p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600">Edit</button>
                    <button onClick={() => {
                        setSelectedPropertyForEmail(selectedProperty);
                        setSelectedAgent(selectedProperty.agentId); // Ensure agent is also set
                    }} className="w-full mb-2 p-3 bg-purple-500 text-white rounded-md hover:bg-purple-600">Email</button>
                    <button onClick={() => updateDecisionStatus(selectedProperty._id, "pursue")} className="w-full mb-2 p-3 bg-green-500 text-white rounded-md hover:bg-green-600">Pursue</button>
                    <button onClick={() => updateDecisionStatus(selectedProperty._id, "on_hold")} className="w-full mb-2 p-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">Hold</button>
                    <button onClick={() => handleShareProperty(selectedProperty._id)} className="w-full mb-2 p-3 bg-indigo-500 text-white rounded-md hover:bg-indigo-600">Share</button>
                </div>
            )}
        </div>
    );
};

export default PropertyTable;
