import React, { useState } from "react";
import { useAuth } from '../components/AuthContext'; // ✅ Use your existing context

const PublicConversationInput = ({ value = [], onChange, readOnly = false }) => {
  const { currentUser } = useAuth(); // ✅ Get currentUser from context
  const [newName, setNewName] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const loggedInName = currentUser?.name || null;

  const handleAdd = () => {
    if (!newMessage.trim()) return;

    const comment = {
      name: loggedInName || newName || "Anonymous",
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    const updated = [...value, comment];
    onChange(updated);
    setNewName('');
    setNewMessage('');
  };

  const handleRemove = (index) => {
    const updated = [...value];
    updated.splice(index, 1);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {value.map((item, index) => (
        <div key={index} className="bg-gray-100 p-3 rounded relative">
          <div className="text-sm text-gray-800 font-medium">{item.name}</div>
          <div className="text-sm text-gray-700 mt-1">{item.message}</div>
          <div className="text-xs text-gray-500 mt-1">{new Date(item.timestamp).toLocaleString()}</div>
          {!readOnly && (
            <button
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
              onClick={() => handleRemove(index)}
            >
              ✖
            </button>
          )}
        </div>
      ))}

      {!readOnly && (
        <div className="flex flex-col gap-2">
          {!loggedInName && (
            <input
              type="text"
              placeholder="Your Name (optional)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="p-2 border rounded"
            />
          )}
          <textarea
            placeholder="Write your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="p-2 border rounded resize-none"
          />
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 self-start"
          >
            Add Comment
          </button>
        </div>
      )}
    </div>
  );
};

export default PublicConversationInput;
