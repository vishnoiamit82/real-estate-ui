import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import { useNavigate,useParams } from 'react-router-dom';
import { Edit, Trash2, PlusCircle, RefreshCw, ArrowUpDown } from 'lucide-react'; // Importing icons

const AgentList = () => {
    const [agents, setAgents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(true);
    const [sortField, setSortField] = useState('createdAt'); // Default sorting by createdAt
    const [sortOrder, setSortOrder] = useState('desc'); // Default to descending order
    const { id } = useParams();

    const navigate = useNavigate();

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || "{}");


    // Fetch agents from backend
    useEffect(() => {
        const fetchAgents = async () => {
            try {
                // const currentUser = localStorage.getItem('currentUser');
                let response;
                if (currentUser?.role === "admin") {
                    // Admin can fetch all agents
                    response = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/agents`);
                } else if (currentUser?.role === "property_sourcer" && id) {
                    // Property Sourcer can fetch only their agent
                    response = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/agents/${id}`);
                    setAgents([response.data]); // Store it as an array to keep the UI consistent
                    return;
                } else {
                    setMessage({ text: 'Unauthorized to view this page.', type: 'error' });
                    return;
                }

                setAgents(response.data);
            } catch (error) {
                console.error('Error fetching agents:', error);
                setMessage({ text: 'Failed to fetch agents.', type: 'error' });
            } finally {
                setLoading(false);
            }
        };

        fetchAgents();
    }, [id]);

    // Delete agent
    const deleteAgent = async (id) => {
        if (!window.confirm('Are you sure you want to delete this agent?')) return;
        try {
            await axiosInstance.delete(`${process.env.REACT_APP_API_BASE_URL}/agents/${id}`);
            setAgents(agents.filter((agent) => agent._id !== id));
            setMessage({ text: 'Agent deleted successfully.', type: 'success' });
        } catch (error) {
            console.error('Error deleting agent:', error);
            setMessage({ text: 'Failed to delete agent.', type: 'error' });
        }
    };

    // Handle search
    const handleSearch = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    // Filter agents by search query
    const filteredAgents = agents.filter(
        (agent) =>
            agent.name.toLowerCase().includes(searchQuery) ||
            (agent.email && agent.email.toLowerCase().includes(searchQuery)) ||
            (agent.phoneNumber && agent.phoneNumber.includes(searchQuery)) ||
            (agent.agencyName && agent.agencyName.toLowerCase().includes(searchQuery)) ||
            (agent.region && agent.region.toLowerCase().includes(searchQuery))
    );

    // Handle sorting
    const handleSort = (field) => {
        const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortOrder(newOrder);
    };

    // Sort agents based on selected field
    const sortedAgents = [...filteredAgents].sort((a, b) => {
        if (!a[sortField]) return 1;
        if (!b[sortField]) return -1;
        return sortOrder === 'asc'
            ? new Date(a[sortField]) - new Date(b[sortField])
            : new Date(b[sortField]) - new Date(a[sortField]);
    });

    // Auto-dismiss messages after 3 seconds
    useEffect(() => {
        if (message.text) {
            const timer = setTimeout(() => setMessage({ text: '', type: '' }), 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Agent Management</h2>

            {/* Success/Error Message */}
            {message.text && (
                <p className={`mb-4 p-2 text-white rounded-md ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {message.text}
                </p>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4 mb-4">
                <button
                    onClick={() => navigate('/add-agent')}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                    <PlusCircle className="w-5 h-5" />
                    <span>Create New Agent</span>
                </button>

                <button
                    onClick={() => window.location.reload()}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    <RefreshCw className="w-5 h-5" />
                    <span>Refresh List</span>
                </button>
            </div>

            {/* Search Box */}
            <input
                type="text"
                placeholder="Search by name, email, phone, agency, or region"
                value={searchQuery}
                onChange={handleSearch}
                className="mb-4 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {/* Agent Table */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2 text-left">Name</th>
                            <th className="border p-2 text-left">Email</th>
                            <th className="border p-2 text-left">Phone</th>
                            <th className="border p-2 text-left">Agency</th>
                            <th className="border p-2 text-left">Region</th>
                            <th className="border p-2 text-left cursor-pointer" onClick={() => handleSort('createdAt')}>
                                Created At <ArrowUpDown className="inline-block w-4 h-4" />
                            </th>
                            <th className="border p-2 text-left cursor-pointer" onClick={() => handleSort('updatedAt')}>
                                Updated At <ArrowUpDown className="inline-block w-4 h-4" />
                            </th>
                            <th className="border p-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="8" className="text-center p-4">Loading agents...</td>
                            </tr>
                        ) : sortedAgents.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="text-center p-4">No agents found.</td>
                            </tr>
                        ) : (
                            sortedAgents.map((agent) => (
                                <tr key={agent._id} className="border-t hover:bg-gray-100">
                                    <td className="p-2">{agent.name}</td>
                                    <td className="p-2">{agent.email || 'N/A'}</td>
                                    <td className="p-2">{agent.phoneNumber || 'N/A'}</td>
                                    <td className="p-2">{agent.agencyName || 'N/A'}</td>
                                    <td className="p-2">{agent.region || 'N/A'}</td>
                                    <td className="p-2">{agent.createdAt ? new Date(agent.createdAt).toLocaleString() : ''}</td>
                                    <td className="p-2">{agent.updatedAt ? new Date(agent.updatedAt).toLocaleString() : ''}</td>
                                    <td className="p-2 flex space-x-4">
                                        <Edit
                                            onClick={() => navigate(`/edit-agent/${agent._id}`)}
                                            className="w-5 h-5 text-blue-500 cursor-pointer hover:text-blue-700"
                                        />
                                        <Trash2
                                            onClick={() => deleteAgent(agent._id)}
                                            className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700"
                                        />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AgentList;
