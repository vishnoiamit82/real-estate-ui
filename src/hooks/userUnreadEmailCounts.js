import { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';

const useUnreadEmailCounts = (propertyIds = []) => {
  const [counts, setCounts] = useState({});
  const [lastFetchedIds, setLastFetchedIds] = useState([]);

  useEffect(() => {
    const idsChanged = JSON.stringify(lastFetchedIds.sort()) !== JSON.stringify([...propertyIds].sort());
    if (!propertyIds.length || !idsChanged) return;

    const fetchCounts = async () => {
      try {
        const response = await axiosInstance.get(
          `${process.env.REACT_APP_API_BASE_URL}/property-conversations/unread-counts?ids=${propertyIds.join(',')}`
        );
        setCounts(response.data || {});
        setLastFetchedIds([...propertyIds]);
      } catch (error) {
        console.error('Failed to fetch unread email counts', error);
      }
    };

    fetchCounts();
  }, [propertyIds, lastFetchedIds]);

  return counts;
};

export default useUnreadEmailCounts;
