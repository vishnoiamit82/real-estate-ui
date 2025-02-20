import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';

const PropertyDetail = () => {
    const { id } = useParams(); // Get the property ID from the URL
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [message, setMessage] = useState('');
    const [smsMessage, setSmsMessage] = useState('');
    const [smsStatus, setSmsStatus] = useState('');

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/properties/${id}`);
                setProperty(response.data);
            } catch (error) {
                console.error('Error fetching property:', error);
                setMessage('Failed to load property details.');
            }
        };
        fetchProperty();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this property?')) {
            return;
        }
        try {
            await axiosInstance.delete(`${process.env.REACT_APP_API_BASE_URL}/properties/${id}`);
            setMessage('Property deleted successfully.');
            navigate('/');
        } catch (error) {
            console.error('Error deleting property:', error);
            setMessage('Failed to delete property.');
        }
    };

    const handleSendSMS = async () => {
        try {
            await axiosInstance.post(`${process.env.REACT_APP_API_BASE_URL}/properties/${id}/send-sms`, { message: smsMessage });
            setSmsStatus('SMS sent successfully!');
            setSmsMessage('');
        } catch (error) {
            console.error('Error sending SMS:', error);
            setSmsStatus('Failed to send SMS.');
        }
    };

    if (!property) {
        return <p className="text-center mt-4">Loading...</p>;
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <button onClick={() => navigate('/')} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Back to Summary</button>
                <div className="flex space-x-2">
                    <button onClick={() => navigate(`/edit-property/${id}`)} className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">Edit</button>
                    <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Delete</button>
                </div>
            </div>

            {message && <p className={`text-${message.includes('successfully') ? 'green' : 'red'}-600`}>{message}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-md bg-gray-50">
                    <h3 className="text-xl font-semibold mb-2">Property Details</h3>
                    <p><strong>Address:</strong> {property.address}</p>
                    <p><strong>Property Type:</strong> {property.propertyType}</p>
                    <p><strong>Bedrooms:</strong> {property.bedrooms}</p>
                    <p><strong>Bathrooms:</strong> {property.bathrooms}</p>
                    <p><strong>Car Spaces:</strong> {property.carSpaces}</p>
                    <p><strong>Land Size:</strong> {property.landSize}</p>
                    <p><strong>Year Built:</strong> {property.yearBuilt}</p>
                    <p><strong>Market Trends:</strong> {property.marketTrends}</p>
                </div>

                <div className="p-4 border rounded-md bg-gray-50">
                    <h3 className="text-xl font-semibold mb-2">Financial Information</h3>
                    <p><strong>Asking Price:</strong> {property.askingPrice || 'N/A'}</p>
                    <p><strong>Rental:</strong> {property.rental || 'N/A'}</p>
                    <p><strong>Yield:</strong> {property.rentalYield || 'N/A'}</p>
                    <p><strong>Council Rate:</strong> {property.councilRate || 'N/A'}</p>
                    <p><strong>Insurance:</strong> {property.insurance || 'N/A'}</p>
                </div>
            </div>

            <div className="p-4 border rounded-md bg-gray-50">
                <h3 className="text-xl font-semibold mb-2">Property Features</h3>
                {property.features?.length > 0 ? (
                    <ul className="list-disc pl-5">{property.features.map((feat, idx) => <li key={idx}>{feat}</li>)}</ul>
                ) : <p>N/A</p>}
            </div>

            {/* Zoning Information */}
            <div className="p-4 border rounded-md bg-gray-50">
                <h3 className="text-xl font-semibold mb-2">Zoning Information</h3>
                <p><strong>Flood Zone:</strong> {property.floodZone || 'N/A'}</p>
                <p><strong>Bushfire Zone:</strong> {property.bushfireZone || 'N/A'}</p>
                <p><strong>Zoning Type:</strong> {property.zoningType || 'N/A'}</p>
            </div>

            <div className="p-4 border rounded-md bg-gray-50">
                <h3 className="text-xl font-semibold mb-2">Conversations</h3>
                <div className="h-40 overflow-y-auto border p-2 rounded-md bg-white">
                    {property.conversation?.length > 0 ? property.conversation.map((conv, idx) => (
                        <p key={idx}><strong>{new Date(conv.timestamp).toLocaleString()}:</strong> {conv.content}</p>
                    )) : <p>No conversations yet.</p>}
                </div>
            </div>

            <div className="p-4 border rounded-md bg-gray-50">
                <h3 className="text-xl font-semibold mb-2">Follow-Up Tasks</h3>
                {property.followUpTasks?.length > 0 ? (
                    <ul className="list-disc pl-5">
                        {property.followUpTasks.map((task, idx) => (
                            <li key={idx}><strong>{task.task}</strong> - Due: {task.followUpDate ? new Date(task.followUpDate).toLocaleDateString() : 'N/A'} ({task.reason})</li>
                        ))}
                    </ul>
                ) : <p>No follow-up tasks assigned.</p>}
            </div>
        </div>
    );
};

export default PropertyDetail;
