// usePropertySearch.js
import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce';
import axiosInstance from '../axiosInstance';

const usePropertySearch = ({
  initialQuery = '',
  initialMinPrice = '',
  initialMaxPrice = '',
  initialPostedWithinDays = 10,
  initialStatus = 'active',
  initialSortKey = 'createdAt',
  initialSortOrder = 'desc',
  limit = 12,
} = {}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [postedWithinDays, setPostedWithinDays] = useState(initialPostedWithinDays);
  const [status, setStatus] = useState(initialStatus);
  const [sortKey, setSortKey] = useState(initialSortKey);
  const [sortOrder, setSortOrder] = useState(initialSortOrder);
  const [currentPage, setCurrentPage] = useState(1);

  const [results, setResults] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [allCount, setAllCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const debouncedFetch = useCallback(
    debounce(async (filters) => {
      setLoading(true);
      try {
        const res = await axiosInstance.post(`${process.env.REACT_APP_API_BASE_URL}/public/property/search`, filters);
        setResults(res.data?.results || []);
        setTotalPages(res.data?.totalPages || 1);
        setTotalCount(res.data?.totalCount || 0);
        setAllCount(res.data?.allCount || 0);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    }, 400),
    []
  );

  const runSearch = () => {
    const filters = {
      address: searchQuery,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      postedWithinDays: Number(postedWithinDays),
      status,
      page: currentPage,
      limit,
      sortKey,
      sortOrder,
    };
    debouncedFetch(filters);
  };

  useEffect(() => {
    runSearch();
    return () => debouncedFetch.cancel();
  }, [
    searchQuery,
    minPrice,
    maxPrice,
    postedWithinDays,
    status,
    currentPage,
    sortKey,
    sortOrder,
  ]);

  const resetFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setPostedWithinDays(10);
    setSearchQuery('');
    setCurrentPage(1);
  };

  return {
    results,
    totalPages,
    totalCount,
    allCount,
    loading,
    searchQuery,
    setSearchQuery,
    minPrice,
    maxPrice,
    setMinPrice,
    setMaxPrice,
    postedWithinDays,
    setPostedWithinDays,
    status,
    setStatus,
    sortKey,
    setSortKey,
    sortOrder,
    setSortOrder,
    currentPage,
    setCurrentPage,
    resetFilters,
  };
};

export default usePropertySearch;
