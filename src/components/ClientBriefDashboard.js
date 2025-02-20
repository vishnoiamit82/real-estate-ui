import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit2, Trash, RotateCcw, NotebookText } from 'lucide-react'; // Icons

const ClientBriefDashboard = ({ buyerAgentId }) => {
    const [clientBriefs, setClientBriefs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClientBriefs = async () => {
            try {
                const response = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/client-briefs`, {
                    params: { buyerAgentId: buyerAgentId || '65b0f5c3e3a4c256d4f8a2b7' },
                });
                setClientBriefs(response.data);
            } catch (error) {
                console.error('Error fetching client briefs:', error);
            }
        };
        fetchClientBriefs();
    }, [buyerAgentId]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this client brief?')) return;
        try {
            await axiosInstance.delete(`${process.env.REACT_APP_API_BASE_URL}/client-briefs/${id}`);
            setClientBriefs(clientBriefs.filter((brief) => brief._id !== id));
        } catch (error) {
            console.error('Error deleting client brief:', error);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Client Briefs</h2>
                <button
                    onClick={() => navigate('/client-briefs/add')}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                    Add Client Brief
                </button>
            </div>
            {clientBriefs.length === 0 ? (
                <p>No client briefs found. Add a new one!</p>
            ) : (
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-2 text-left">Client Name</th>
                            <th className="border border-gray-300 p-2 text-left">Email</th>
                            <th className="border border-gray-300 p-2 text-left">Phone Number</th>
                            <th className="border border-gray-300 p-2 text-left">Address</th>
                            <th className="border border-gray-300 p-2 text-left">Purchaser Name</th>
                            <th className="border border-gray-300 p-2 text-left">Strategy</th>
                            <th className="border border-gray-300 p-2 text-left">Interest Rate</th>
                            <th className="border border-gray-300 p-2 text-left">Property Type</th>
                            <th className="border border-gray-300 p-2 text-left">Preferred Locations</th>
                            <th className="border border-gray-300 p-2 text-left">Features</th>
                            <th className="border border-gray-300 p-2 text-left">Bedrooms</th>
                            <th className="border border-gray-300 p-2 text-left">Bathrooms</th>
                            <th className="border border-gray-300 p-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientBriefs.map((brief) => (
                            <tr key={brief._id}>
                                <td className="p-2">{brief.clientName}</td>
                                <td className="p-2">{brief.email}</td>
                                <td className="p-2">{brief.phoneNumber}</td>
                                <td className="p-2">{brief.address}</td>
                                <td className="p-2">{brief.contractPurchaser}</td>
                                <td className="p-2">{brief.investmentStrategy}</td>
                                <td className="p-2">{brief.interestRate}%</td>
                                <td className="p-2">{brief.propertyType}</td>
                                <td className="p-2">{brief.preferredLocations.join(', ')}</td>
                                <td className="p-2">{brief.features.join(', ')}</td>
                                <td className="p-2">{brief.bedrooms}</td>
                                <td className="p-2">{brief.bathrooms}</td>
                                <td className="p-2 flex gap-2">
                                    <button onClick={() => navigate(`/client-briefs/${brief._id}/matches`)} className="text-blue-500 hover:text-blue-700">
                                        <Eye size={18} />
                                    </button>
                                    <button onClick={() => navigate(`/client-briefs/edit/${brief._id}`)} className="text-yellow-500 hover:text-yellow-700">
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(brief._id)} className="text-red-500 hover:text-red-700">
                                        <Trash size={18} />
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

export default ClientBriefDashboard;
