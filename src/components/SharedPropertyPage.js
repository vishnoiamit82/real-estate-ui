import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import PropertyFields from './PropertyFields';
import { PROPERTY_SECTION_CONFIGS } from '../config/propertySectionConfigs';
import ShareButtons from './ShareButtons';

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

    const shareUrl = `${window.location.origin}/shared/${shareToken}`;

    return (
        <div className="container mx-auto p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold">
                    {property?.address || 'Property Details'}
                </h2>
                <button
                    onClick={() => window.location.href = '/public'}
                    className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg shadow transition duration-200"
                >
                    🏘️ View All Shared Properties
                </button>
            </div>

            {/* Share Buttons */}
            <ShareButtons property={property} shareUrl={shareUrl} />

            <PropertyFields
                formData={property}
                setFormData={() => { }}
                visibleSections={config.visibleSections}
                readOnly={true}
                mode="shared"
            />
        </div>
    );
};

export default SharedPropertyPage;