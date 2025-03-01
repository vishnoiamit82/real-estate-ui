import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Paragraph from "@tiptap/extension-paragraph";

const TemplateManagement = () => {
    const [templates, setTemplates] = useState([]);
    const [newTemplate, setNewTemplate] = useState({
        name: '',
        subject: '',
        body: '',
        type: 'custom'
    });
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [message, setMessage] = useState('');

    // Initialize Tiptap Editor
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                paragraph: {
                    HTMLAttributes: { class: "mb-2 text-gray-700" } // Adds spacing and styling
                }
            }),
            Paragraph // Explicitly include the Paragraph extension
        ],
        content: newTemplate.body || "<p>Write email content here with Dynamic placeholder..</p><p>Hi {{sales_agent_name}},</p><p>How are you?</p><p>I would like to enquire about {{property_address}}</p>",
        editorProps: {
            attributes: {
                class: "prose prose-sm p-2 border rounded-md min-h-[150px] focus:outline-none" // Styling for better UX
            }
        },
        onUpdate: ({ editor }) => {
            setNewTemplate((prev) => ({ ...prev, body: editor.getHTML() }));
        }
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
            const updatedTemplate = { ...newTemplate, body: editor?.getHTML() };
            if (editingTemplate) {
                await axiosInstance.put(`${process.env.REACT_APP_API_BASE_URL}/email-templates/${editingTemplate._id}`, updatedTemplate);
                setMessage('Template updated successfully!');
            } else {
                await axiosInstance.post(`${process.env.REACT_APP_API_BASE_URL}/email-templates`, updatedTemplate);
                setMessage('Template created successfully!');
            }
            setNewTemplate({ name: '', subject: '', body: '', type: 'custom' });
            setEditingTemplate(null);
            fetchTemplates();
        } catch (error) {
            console.error('Error saving template:', error);
            setMessage('Failed to save template. Please try again.');
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Email Template Management</h2>
            {message && <p className="mb-4 text-green-600 bg-green-100 p-2 rounded">{message}</p>}
            
            {/* How to Use Dynamic Variables */}
            <div className="mb-6 bg-gray-100 p-4 rounded-md">
                <h3 className="text-lg font-semibold mb-2">How to Use Dynamic Placeholders</h3>
                <p className="text-gray-700">Use the following placeholders in your email templates to dynamically insert property details:</p>
                <ul className="list-disc list-inside mt-2 text-gray-700">
                    <li><strong>{'{{property_address}}'}</strong> - Inserts the property address</li>
                    {/* <li><strong>{'{client_name}'}</strong> - Inserts the recipient's name</li> */}
                    <li><strong>{'{{sales_agent_name}}'}</strong> - Inserts the assigned agent's name</li>
                </ul>
            </div>
            
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
                <div className="border p-2 rounded min-h-[150px] overflow-y-auto">
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
                            <button onClick={() => setEditingTemplate(template)} className="px-3 py-1 bg-yellow-500 text-white rounded-md mr-2">Edit</button>
                            <button onClick={() => axiosInstance.delete(`${process.env.REACT_APP_API_BASE_URL}/email-templates/${template._id}`).then(fetchTemplates)} className="px-3 py-1 bg-red-500 text-white rounded-md">Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TemplateManagement;
