import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import DueDiligenceChecklist from './DueDiligenceChecklist';
import PropertyFields from "./PropertyFields";
import { PROPERTY_SECTION_CONFIGS } from '../config/propertySectionConfigs';

const PropertyDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({});
    const [property, setProperty] = useState(null);
    const [message, setMessage] = useState('');
    const [smsMessage, setSmsMessage] = useState('');
    const [smsStatus, setSmsStatus] = useState('');

    const displayMode = location.pathname.includes('/shared/') ? 'shared' : 'full';
    const config = PROPERTY_SECTION_CONFIGS[displayMode];

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/properties/${id}`);
                setProperty(response.data);
                setFormData(response.data);
            } catch (error) {
                console.error('Error fetching property:', error);
                setMessage('Failed to load property details.');
            }
        };
        fetchProperty();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this property?')) return;
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

    if (!property) return <p className="text-center mt-4">Loading...</p>;

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

            <div className="mb-4 text-sm text-gray-600">
                <strong>Property Source:</strong>{' '}
                {property.source === 'created'
                    ? 'Created by you'
                    : `Saved from Community (Posted by ${property.sharedBy?.name || 'Unknown'})`}
            </div>

            <PropertyFields
                formData={formData}
                setFormData={setFormData}
                visibleSections={config.visibleSections}
                readOnly={true}
                mode="view"
            />

            {config.showCommLog && (
                <div className="p-4 border rounded-md bg-gray-50 mt-6">
                    <h3 className="text-xl font-semibold mb-2">📬 Communication Log</h3>
                    {property.conversation?.length > 0 ? (
                        <ul className="space-y-2 text-sm">
                            {property.conversation.map((conv, idx) => (
                                <li key={idx} className="border-b pb-2">
                                    <p className="text-gray-700 whitespace-pre-wrap">{conv.content}</p>
                                    <p className="text-xs text-gray-500">{new Date(conv.timestamp).toLocaleString()}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500">No communication history yet.</p>
                    )}
                </div>
            )}

            {/* {config.showDueDiligenceChecklist && (
                <div id="due-diligence" className="mt-6">
                    <h2 className="text-2xl font-semibold mb-4">Due Diligence Checklist</h2>
                    <DueDiligenceChecklist propertyId={property._id} createdBy={property.createdBy?._id} />
                </div>
            )} */}
        </div>
    );
};

export default PropertyDetail;
