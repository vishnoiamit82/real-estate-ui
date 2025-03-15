import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import PropertyCardList from './PropertyTable';
import { useNavigate } from 'react-router-dom';

const SavedPropertiesPage = () => {
  const [savedProperties, setSavedProperties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/saved-properties`);
        setSavedProperties(response.data);
      } catch (err) {
        console.error('Error fetching saved properties:', err);
      }
    };

    fetchSaved();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">📥 My Saved Properties</h2>
      <PropertyCardList
        properties={savedProperties}
        navigate={navigate}
        setSelectedPropertyForEmail={() => {}}
        setSelectedAgent={() => {}}
        setSelectedPropertyForNotes={() => {}}
        updateDecisionStatus={() => {}}
        deleteProperty={() => {}}
        restoreProperty={() => {}}
        handleShareProperty={() => {}}
        handleShareToCommunity={() => {}}
      />
    </div>
  );
};

export default SavedPropertiesPage;
