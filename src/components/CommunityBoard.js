import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EmailModal from './EmailModal';
import PropertyCardList from './PropertyTable';
import { Search, Filter } from 'lucide-react';
import axiosInstance from '../axiosInstance';
import { toast } from 'react-toastify';



const CommunityBoard = () => {
  const [sharedProperties, setSharedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [messageRecipient, setMessageRecipient] = useState(null);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSharedProperties = async () => {
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/properties/community`);
        setSharedProperties(response.data);
      } catch (error) {
        console.error('Error fetching community properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedProperties();
  }, []);

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));



    // Save-to-My-List handler function
    const handleSaveToMyList = async (propertyId) => {
        try {
            await axiosInstance.post(`${process.env.REACT_APP_API_BASE_URL}/saved-properties`, {
                communityPropertyId: propertyId
            });
            toast.success('✅ Property saved to your list!');
        } catch (err) {
            if (err.response?.data?.message === 'Already saved.') {
                toast.info('This property is already in your saved list.');
            } else {
                console.error('Error saving property:', err);
                toast.error('Failed to save property. Please try again.');
            }
        }
    };

    const handlePursueCommunityProperty = async (property) => {
        try {
          let savedId = property.savedId;
      
          // 1. Auto-save if not already saved
          if (!savedId || property.source !== 'saved') {
            const response = await axiosInstance.post(`${process.env.REACT_APP_API_BASE_URL}/saved-properties`, {
              communityPropertyId: property._id,
            });
      
            savedId = response.data._id;
          }
      
          // 2. Update decision status
          await axiosInstance.patch(`${process.env.REACT_APP_API_BASE_URL}/saved-properties/${savedId}/decision`, {
            decisionStatus: 'pursue',
          });
      
          toast.success('Marked as pursued!');
        } catch (error) {
          console.error('Error pursuing community property:', error);
          toast.error('Failed to pursue property.');
        }
      };
      


  const handleMessagePoster = (property) => {
    setSelectedProperty(property);
    setMessageRecipient(property.sharedBy);
    setEmailModalOpen(true);
  };

  const closeEmailModal = () => {
    setSelectedProperty(null);
    setMessageRecipient(null);
    setEmailModalOpen(false);
  };

  const filteredProperties = sharedProperties.filter((property) => {
    const addressMatch = property.address?.toLowerCase().includes(searchQuery.toLowerCase());
    const propertyTypeMatch = propertyTypeFilter === 'all' || property.propertyType === propertyTypeFilter;
    return addressMatch && propertyTypeMatch;
  });

  const propertyTypes = Array.from(new Set(sharedProperties.map((p) => p.propertyType).filter(Boolean)));

  if (loading) return <p className="p-6 text-gray-600">Loading community properties...</p>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">🏘️ Community Board - Shared Properties</h2>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          ← Back to Property List
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-1/3">
          <Filter className="text-gray-600" />
          <select
            value={propertyTypeFilter}
            onChange={(e) => setPropertyTypeFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">All Property Types</option>
            {propertyTypes.map((type, idx) => (
              <option key={idx} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <PropertyCardList
        properties={filteredProperties}
        navigate={navigate}
        setSelectedPropertyForEmail={handleMessagePoster}
        setSelectedAgent={() => {}}
        setSelectedPropertyForNotes={() => {}}
        updateDecisionStatus={() => {}}
        deleteProperty={() => {}}
        restoreProperty={() => {}}
        handleShareProperty={() => {}}
        handleShareToCommunity={() => {}}
        handlePursueCommunityProperty={handlePursueCommunityProperty}
        handleSaveToMyList={handleSaveToMyList}
        currentUser={currentUser}
      />

      {emailModalOpen && selectedProperty && messageRecipient && (
        <EmailModal
          property={selectedProperty}
          agent={messageRecipient}
          templates={[]}
          onClose={closeEmailModal}
        />
      )}
    </div>
  );
};

export default CommunityBoard;
