import React from 'react';
import { useNavigate } from 'react-router-dom';

const BuyersAgentDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-3xl font-bold mb-6">Buyers' Agent Dashboard</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Client Brief Management */}
                <div
                    className="border rounded-md p-4 bg-gray-50 hover:shadow-lg cursor-pointer"
                    onClick={() => navigate('/client-briefs')}
                >
                    <h3 className="text-xl font-semibold mb-2">Client Briefs</h3>
                    <p>Manage your client briefs. Add, edit, or delete briefs and match properties to clients.</p>
                </div>

                {/* Property Management */}
                <div
                    className="border rounded-md p-4 bg-gray-50 hover:shadow-lg cursor-pointer"
                    onClick={() => navigate('/')}
                >
                    <h3 className="text-xl font-semibold mb-2">Property Management</h3>
                    <p>View and manage all listed properties.</p>
                </div>

                {/* Agent Management */}
                <div
                    className="border rounded-md p-4 bg-gray-50 hover:shadow-lg cursor-pointer"
                    onClick={() => navigate('/agents')}
                >
                    <h3 className="text-xl font-semibold mb-2">Agent Management</h3>
                    <p>Manage sales agents for properties.</p>
                </div>

                {/* Notifications */}
                <div
                    className="border rounded-md p-4 bg-gray-50 hover:shadow-lg cursor-pointer"
                    onClick={() => navigate('/notifications')}
                >
                    <h3 className="text-xl font-semibold mb-2">Notifications</h3>
                    <p>View new property matches for your client briefs.</p>
                </div>

                {/* Template Management */}
                <div
                    className="border rounded-md p-4 bg-gray-50 hover:shadow-lg cursor-pointer"
                    onClick={() => navigate('/template-management')}
                >
                    <h3 className="text-xl font-semibold mb-2">Template Management</h3>
                    <p>Create, edit, and manage email templates for communication.</p>
                </div>
            </div>
        </div>
    );
};

export default BuyersAgentDashboard;
