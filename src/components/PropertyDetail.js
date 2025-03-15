import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import DueDiligenceChecklist from './DueDiligenceChecklist';
import PropertyFields from "./PropertyFields"; // ✅ Import PropertyFields

const PropertyDetail = () => {
    const { id } = useParams(); // Get the property ID from the URL
    const navigate = useNavigate();

    // ✅ Define formData state
    const [formData, setFormData] = useState({});
    const [property, setProperty] = useState(null);
    const [message, setMessage] = useState('');
    const [smsMessage, setSmsMessage] = useState('');
    const [smsStatus, setSmsStatus] = useState('');

    const visibleSections = ["Basic Information", "Financial Information", "Property Details", "Due Diligence", "Additional Due Diligence"];

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/properties/${id}`);
                setProperty(response.data);
                setFormData(response.data); // ✅ Set initial formData from property details
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

            <div className="mb-4 text-sm text-gray-600">
                <strong>Property Source:</strong>{' '}
                {property.source === 'created'
                    ? 'Created by you'
                    : `Saved from Community (Posted by ${property.sharedBy?.name || 'Unknown'})`}
            </div>


            {/* ✅ Pass formData & setFormData */}
            <PropertyFields
                formData={formData}
                setFormData={setFormData}
                visibleSections={visibleSections}
                readOnly={true} // ✅ View mode (Read-Only)
            />


            {/* Integrate Due Diligence Checklist
            <div id="due-diligence">
                <h2 className="text-2xl font-semibold mb-4">Due Diligence Checklist</h2>
                <DueDiligenceChecklist propertyId={property._id} createdBy={property.createdBy._id} />
            </div> */}
        </div>
    );
};

export default PropertyDetail;
