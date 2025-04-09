import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import { Plus, Trash2 } from 'lucide-react';

const TAG_TYPES = ['location', 'feature', 'propertyType', 'region', 'username'];

const TagsManager = () => {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState({ name: '', type: 'location' });
  const [loading, setLoading] = useState(false);

  const fetchTags = async () => {
    try {
      const res = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/tags`);
      setTags(res.data);
    } catch (err) {
      console.error('Failed to load tags', err);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleCreate = async () => {
    if (!newTag.name.trim()) return;
    try {
      setLoading(true);
      await axiosInstance.post(`${process.env.REACT_APP_API_BASE_URL}/tags`, newTag);
      setNewTag({ name: '', type: 'location' });
      await fetchTags();
    } catch (err) {
      console.error('Failed to create tag', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`${process.env.REACT_APP_API_BASE_URL}/tags/${id}`);
      setTags(tags.filter(t => t._id !== id));
    } catch (err) {
      console.error('Failed to delete tag', err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6">
      <h2 className="text-xl font-semibold mb-2">🧩 Tag Manager</h2>

      {/* Add new tag */}
      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={newTag.name}
          onChange={e => setNewTag({ ...newTag, name: e.target.value })}
          placeholder="Enter tag name"
          className="flex-grow border rounded px-3 py-2 text-sm"
        />
        <select
          value={newTag.type}
          onChange={e => setNewTag({ ...newTag, type: e.target.value })}
          className="border rounded px-2 py-2 text-sm"
        >
          {TAG_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <button
          onClick={handleCreate}
          className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 text-sm"
          disabled={loading}
        >
          <Plus size={16} />
        </button>
      </div>

      {/* List existing tags */}
      <div className="space-y-2">
        {tags.map(tag => (
          <div
            key={tag._id}
            className="flex items-center justify-between border px-3 py-2 rounded text-sm bg-gray-50"
          >
            <div>
              <span className="font-medium">{tag.name}</span>
              <span className="text-gray-500 ml-2 text-xs">({tag.type})</span>
            </div>
            <button onClick={() => handleDelete(tag._id)} className="text-red-500 hover:text-red-700">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagsManager;