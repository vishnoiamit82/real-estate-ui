// ✅ ClientBriefDashboard using useCurrentUser hook instead of props
import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit2, Trash, Share2 } from 'lucide-react';
import { useAuth } from './AuthContext';

const PropertyList = () => {
  const { currentUser } = useAuth();
  console.log("User ID:", currentUser?._id);
};


const ClientBriefDashboard = () => {
  const { currentUser } = useAuth();
  const userId = currentUser?.id || '';
  const userRole = currentUser?.role || '';
  const [clientBriefs, setClientBriefs] = useState([]);
  const [filterBy, setFilterBy] = useState('all');
  const [inviteLink, setInviteLink] = useState('');
  const navigate = useNavigate();
  const [matchCounts, setMatchCounts] = useState({});


  console.log('Dashboard', currentUser)


  useEffect(() => {
    const fetchClientBriefs = async () => {
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/client-briefs`);
        const briefs = response.data;
        setClientBriefs(briefs);

        // Fetch match counts in parallel
        const counts = {};
        await Promise.all(
          briefs.map(async (brief) => {
            try {
              const res = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/client-briefs/${brief._id}/matches`);
              counts[brief._id] = res.data?.matchCount || 0;
            } catch (err) {
              console.error(`Error fetching match count for ${brief._id}`, err);
              counts[brief._id] = 0;
            }
          })
        );
        setMatchCounts(counts);
      } catch (error) {
        console.error('Error fetching client briefs:', error);
      }
    };
    fetchClientBriefs();
  }, []);


  useEffect(() => {
    if (currentUser && currentUser.id) {
      const link = `${window.location.origin}/client-briefs/add?buyerAgentId=${currentUser.id}&invitedBy=${currentUser.id}`;
      setInviteLink(link);
    }
  }, [currentUser]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this client brief?')) return;
    try {
      await axiosInstance.delete(`${process.env.REACT_APP_API_BASE_URL}/client-briefs/${id}`);
      setClientBriefs(clientBriefs.filter((brief) => brief._id !== id));
    } catch (error) {
      console.error('Error deleting client brief:', error);
    }
  };

  const handleCopyInviteLink = () => {
    if (!inviteLink) {
      alert('Invite link is not ready yet.');
      return;
    }
    navigator.clipboard.writeText(inviteLink)
      .then(() => alert('✅ Invite link copied to clipboard!'))
      .catch(() => alert('❌ Failed to copy invite link. Please copy manually.'));
  };

  const filteredBriefs = clientBriefs.filter((brief) => {
    if (filterBy === 'created') return brief.createdBy === userId;
    if (filterBy === 'owned') return brief.buyerAgentId === userId;
    if (filterBy === 'invited') return brief.invitedBy === userId;
    return true;
  });

  const canEditOrDelete = (brief) => {
    return (
      brief.createdBy === userId ||
      brief.buyerAgentId === userId ||
      userRole === 'admin'
    );
  };

  const getOwnershipTag = (brief) => {
    if (brief.buyerAgentId === userId) return { label: 'My Brief', color: 'bg-green-100 text-green-700' };
    if (brief.createdBy === userId) return { label: 'Created by Me', color: 'bg-blue-100 text-blue-700' };
    if (brief.invitedBy === userId) return { label: "Other Buyer's Agent's Brief", color: 'bg-yellow-100 text-yellow-700' };
    return null;
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
        <h2 className="text-2xl font-bold">Client Briefs</h2>
        <div className="flex flex-col md:flex-row gap-2 items-center w-full md:w-auto">
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="border p-2 rounded text-sm w-full md:w-auto"
          >
            <option value="all">All</option>
            <option value="created">Created by Me</option>
            <option value="owned">My Client Briefs</option>
            <option value="invited">Other Buyers Agents' Briefs</option>
          </select>
          <button
            onClick={() => navigate('/client-briefs/add')}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm w-full md:w-auto"
          >
            Add Client Brief
          </button>
          <button
            onClick={handleCopyInviteLink}
            className="px-3 py-2 flex items-center gap-1 bg-blue-100 text-blue-700 border border-blue-300 rounded-md text-sm hover:bg-blue-200 w-full md:w-auto"
          >
            <Share2 size={16} /> Copy Invite Link
          </button>
        </div>
      </div>

      {inviteLink && (
        <div className="mb-4 bg-blue-50 border border-blue-300 text-blue-700 text-sm p-3 rounded-md break-words">
          <strong>Invite Link:</strong><br />
          <a href={inviteLink} className="underline" target="_blank" rel="noopener noreferrer">
            {inviteLink}
          </a>
        </div>
      )}

      {filteredBriefs.length === 0 ? (
        <p className="text-gray-600 text-sm">No client briefs found for selected filter.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBriefs.map((brief) => {

            const tag = getOwnershipTag(brief);
            return (
              <div key={brief._id} className="border rounded-lg p-4 shadow-sm bg-white">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{brief.clientName}</h3>
                  {tag && (
                    <span className={`text-xs px-2 py-1 rounded font-medium ${tag.color}`}>{tag.label}</span>
                  )}
                </div>

                <p className="text-sm text-gray-600">Email: {brief.email}</p>
                <p className="text-sm text-gray-600">Phone: {brief.phoneNumber}</p>
                <p className="text-sm text-gray-600">Address: {brief.address}</p>
                <p className="text-sm text-gray-600">Strategy: {brief.investmentStrategy}</p>
                <p className="text-sm text-gray-600">Interest Rate: {brief.interestRate}%</p>
                <p className="text-sm text-gray-600">Locations: {brief.preferredLocations?.join(', ')}</p>
                {matchCounts[brief._id] > 0 && (
                  <p className="text-sm text-green-600 font-medium mt-2">
                    💡 {matchCounts[brief._id]} properties match above 80%
                  </p>
                )}

                <div className="flex gap-2 mt-3">
                  <button onClick={() => navigate(`/client-briefs/${brief._id}/matches`)} className="text-blue-500 hover:text-blue-700">
                    <Eye size={18} />
                  </button>
                  {canEditOrDelete(brief) && (
                    <>
                      <button onClick={() => navigate(`/client-briefs/edit/${brief._id}`)} className="text-yellow-500 hover:text-yellow-700">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(brief._id)} className="text-red-500 hover:text-red-700">
                        <Trash size={18} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ClientBriefDashboard;
