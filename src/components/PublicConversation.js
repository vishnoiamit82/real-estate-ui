// components/PublicConversation.js
import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';

const PublicConversation = ({ propertyId }) => {
  const [comments, setComments] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      const res = await axiosInstance.get(`/properties/${propertyId}/public-conversations`);
      setComments(res.data || []);
    };
    fetchComments();
  }, [propertyId]);

  const handleSubmit = async () => {
    if (!newMessage.trim()) return;
    const res = await axiosInstance.post(`/properties/${propertyId}/public-conversations`, {
      name,
      message: newMessage,
    });
    setComments(res.data.updatedConversations);
    setNewMessage('');
  };

  return (
    <div className="bg-white border mt-4 rounded p-4">
      <h3 className="text-lg font-semibold mb-2">💬 Public Conversation</h3>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {comments.map((c, i) => (
          <div key={i} className="border-b pb-2 text-sm">
            <div className="font-semibold">{c.name || 'Anonymous'}</div>
            <div>{c.message}</div>
            <div className="text-gray-400 text-xs">{new Date(c.timestamp).toLocaleString()}</div>
          </div>
        ))}
      </div>
      <div className="mt-3">
        <input
          type="text"
          className="w-full mb-1 p-2 border rounded"
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          rows={2}
          className="w-full p-2 border rounded"
          placeholder="Add a public message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className="mt-2 bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
          onClick={handleSubmit}
        >
          Post Comment
        </button>
      </div>
    </div>
  );
};

export default PublicConversation;
