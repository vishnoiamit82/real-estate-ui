import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";




const TemplateManagement = () => {
    const [templates, setTemplates] = useState([]);
    const [newTemplate, setNewTemplate] = useState({ name: '', subject: '', body: '', type: 'custom' });
    const [editingTemplate, setEditingTemplate] = useState(null);


    // Initialize Tiptap Editor
    const editor = useEditor({
        extensions: [StarterKit],
        content: newTemplate.body,
        onUpdate: ({ editor }) => {
            setNewTemplate({ ...newTemplate, body: editor.getHTML() });
        },
    });

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const response = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/email-templates`);
            setTemplates(response.data);
        } catch (error) {
            console.error('Error fetching templates:', error);
        }
    };

    const handleCreateOrUpdate = async () => {
        try {
            if (editingTemplate) {
                await axiosInstance.put(`${process.env.REACT_APP_API_BASE_URL}/email-templates/${editingTemplate._id}`, newTemplate);
            } else {
                await axiosInstance.post(`${process.env.REACT_APP_API_BASE_URL}/email-templates`, newTemplate);
            }
            setNewTemplate({ name: '', subject: '', body: '', type: 'custom' });
            setEditingTemplate(null);
            fetchTemplates();
        } catch (error) {
            console.error('Error saving template:', error);
        }
    };

    const handleEdit = (template) => {
        setEditingTemplate(template);
        setNewTemplate(template);
    };

    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`${process.env.REACT_APP_API_BASE_URL}/email-templates/${id}`);
            fetchTemplates();
        } catch (error) {
            console.error('Error deleting template:', error);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Email Template Management</h2>
            <div className="bg-white p-4 shadow rounded-md">
                <h3 className="text-xl mb-2">{editingTemplate ? 'Edit Template' : 'Create New Template'}</h3>
                <input
                    type="text"
                    placeholder="Template Name"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                    className="w-full p-2 border rounded mb-2"
                />
                <input
                    type="text"
                    placeholder="Subject"
                    value={newTemplate.subject}
                    onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })}
                    className="w-full p-2 border rounded mb-2"
                />
                {/* Tiptap Rich Text Editor */}
                <div className="border p-2 rounded">
                    <EditorContent editor={editor} />
                </div>

                <select
                    value={newTemplate.type}
                    onChange={(e) => setNewTemplate({ ...newTemplate, type: e.target.value })}
                    className="w-full p-2 border rounded mb-2"
                >
                    <option value="inquiry">Inquiry</option>
                    <option value="offer">Offer</option>
                    <option value="custom">Custom</option>
                </select>
                <button onClick={handleCreateOrUpdate} className="px-4 py-2 bg-blue-500 text-white rounded-md">
                    {editingTemplate ? 'Update Template' : 'Create Template'}
                </button>
            </div>
            <h3 className="text-xl font-bold mt-6">Existing Templates</h3>
            <ul className="mt-4">
                {templates.map((template) => (
                    <li key={template._id} className="p-4 border-b flex justify-between items-center">
                        <div>
                            <h4 className="font-bold">{template.name}</h4>
                            <p className="text-gray-600">{template.subject}</p>
                        </div>
                        <div>
                            <button onClick={() => handleEdit(template)} className="px-3 py-1 bg-yellow-500 text-white rounded-md mr-2">Edit</button>
                            <button onClick={() => handleDelete(template._id)} className="px-3 py-1 bg-red-500 text-white rounded-md">Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TemplateManagement;
