import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../axiosInstance';

const SharedPropertyPage = () => {
    const { shareToken } = useParams();
    const [property, setProperty] = useState(null);
    const [error, setError] = useState('');

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

    if (error) return <div>{error}</div>;
    if (!property) return <div>Loading...</div>;

    return (
        <div>
            <h2>{property.address}</h2>
            {/* Render other property details as needed */}
        </div>
    );
};

export default SharedPropertyPage;
