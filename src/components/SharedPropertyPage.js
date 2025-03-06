import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import PropertyFields from './PropertyFields'; // ✅ Import PropertyFields

const SharedPropertyPage = () => {
    const { shareToken } = useParams();
    const [property, setProperty] = useState(null);
    const [error, setError] = useState('');

    const visibleSections = ["Basic Information", "Financial Information", "Property Details", "Due Diligence", "Additional Due Diligence"];

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/properties/shared/${shareToken}`);
                setProperty(response.data);
            } catch (err) {
                setError('Property not found or link expired.');
            }
        };
        fetchProperty();
    }, [shareToken]);

    if (error) return <div className="text-red-500">{error}</div>;
    if (!property) return <div>Loading...</div>;

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Shared Property Details</h2>

            {/* ✅ Pass property data as read-only formData */}
            <PropertyFields 
                formData={property}  // ✅ Use property directly as formData
                setFormData={() => {}} // ✅ No need to update formData in view mode
                visibleSections={visibleSections} 
                readOnly={true} // ✅ Read-Only Mode
            />
        </div>
    );
};

export default SharedPropertyPage;
