// components/UnreadEmailBadge.js
import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';

const UnreadEmailBadge = ({ propertyId }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const response = await axiosInstance.get(
                    `${process.env.REACT_APP_API_BASE_URL}/property-conversations/${propertyId}/unread-count`
                );
                setCount(response.data.unreadCount || 0);
            } catch (error) {
                console.error('Failed to fetch unread email count:', error);
            }
        };

        if (propertyId) {
            fetchUnreadCount();
        }
    }, [propertyId]);

    if (count === 0) return null;

    return (
        <span className="ml-2 inline-block bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {count}
        </span>
    );
};

export default UnreadEmailBadge;
