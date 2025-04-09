import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // ✅ include useNavigate
import axiosInstance from '../axiosInstance';
import PropertyCardList from './PropertyTable';

const TagSearchPage = () => {
  const { tagName } = useParams();
  const navigate = useNavigate(); // ✅ define navigate
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaggedProperties = async () => {
      try {
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_API_BASE_URL}/public/property/search`,
          { tags: [{ name: tagName }] }
        );
        setProperties(res.data?.results || []);
      } catch (err) {
        console.error('Tag-based search failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTaggedProperties();
  }, [tagName]);

  return (
    <div className="p-6">
      <button
        onClick={() => navigate('/public')}
        className="text-sm text-blue-600 hover:underline mb-4"
      >
        ⬅ Back to all properties
      </button>
      <h1 className="text-xl font-semibold mb-4">
        🔍 Showing results for tag: <span className="text-blue-600">#{tagName}</span>
      </h1>
      {loading ? (
        <p>Loading properties...</p>
      ) : properties.length === 0 ? (
        <p>No properties found for this tag.</p>
      ) : (
        <PropertyCardList properties={properties} />
      )}
    </div>
  );
};

export default TagSearchPage;
