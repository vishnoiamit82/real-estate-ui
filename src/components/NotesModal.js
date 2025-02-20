import React, { useState, useEffect } from "react";
import axiosInstance from '../axiosInstance';

const NotesModal = ({ property, onClose }) => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState("");

    // Fetch existing notes when modal opens
    useEffect(() => {
        if (property) {
            fetchNotes();
        }
    }, [property]);

    const fetchNotes = async () => {
        try {
            const response = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/properties/${property._id}/notes`);
            setNotes(response.data);
        } catch (error) {
            console.error("Error fetching notes:", error);
        }
    };

    const handleAddNote = async () => {
        if (!newNote.trim()) return;
        try {
            await axiosInstance.post(`${process.env.REACT_APP_API_BASE_URL}/properties/${property._id}/notes`, {
                content: newNote,
            });
            setNewNote("");
            fetchNotes(); // Refresh notes after adding
        } catch (error) {
            console.error("Error adding note:", error);
        }
    };

    if (!property) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
                <h2 className="text-xl font-bold mb-4">Notes for {property.address}</h2>

                {/* Existing Notes */}
                <div className="mb-4 max-h-60 overflow-y-auto bg-gray-100 p-3 rounded-md">
                    {notes.length > 0 ? (
                        notes.map((note, index) => (
                            <div key={index} className="p-2 border-b">
                                <p className="text-sm">{note.content}</p>
                                <span className="text-xs text-gray-500">
                                    {new Date(note.timestamp).toLocaleString()}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-sm">No notes yet.</p>
                    )}
                </div>

                {/* Add New Note */}
                <textarea
                    className="w-full p-2 border border-gray-300 rounded-md mb-2"
                    placeholder="Add a quick note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                />

                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                    >
                        Close
                    </button>
                    <button
                        onClick={handleAddNote}
                        className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
                    >
                        Add Note
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotesModal;
