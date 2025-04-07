import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import PropertyFields from './PropertyFields';
import { PROPERTY_SECTION_CONFIGS } from '../config/propertySectionConfigs';


const SharedPropertyPage = () => {
    const { shareToken } = useParams();
    const [property, setProperty] = useState(null);
    const [error, setError] = useState('');

    const config = PROPERTY_SECTION_CONFIGS.shared;

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/shared/${shareToken}`);
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
             <h2 className="text-2xl font-bold mb-6">
                {property?.address || 'Property Details'}
            </h2>

            <PropertyFields 
                formData={property}
                setFormData={() => {}} 
                visibleSections={config.visibleSections}
                readOnly={true}
                mode="shared"
            />
        </div>
    );
};

export default SharedPropertyPage;
