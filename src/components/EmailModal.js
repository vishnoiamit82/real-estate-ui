import React, { useState, useRef, useEffect } from 'react';
import axiosInstance from '../axiosInstance';

const EmailModal = ({ property, agent, templates, onClose }) => {
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [subject, setSubject] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [isSending, setIsSending] = useState(false);
    const [ccEmail, setCcEmail] = useState('');
    const [toEmail, setToEmail] = useState(agent.email || '');
    const messageRef = useRef(null);

    useEffect(() => {
        document.body.classList.add("modal-open");
        return () => document.body.classList.remove("modal-open");
    }, []);
    

    // Load CC email after mount
    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            try {
                const currentUser = JSON.parse(storedUser);
                if (currentUser?.email) {
                    setCcEmail("info@nationalpropertyconsultant.com.au");
                }
            } catch (error) {
                console.error('Error parsing currentUser from localStorage:', error);
            }
        }
    }, []);

    // Apply email template
    const applyTemplate = (templateId) => {
        const template = templates.find(t => t._id === templateId);
        if (template) {
            setSelectedTemplate(templateId);
            const filledSubject = template.subject.replace('{{property_address}}', property.address);
            const filledBody = template.body
                .replace('{{property_address}}', property.address)
                .replace('{{sales_agent_name}}', agent.name.split(' ')[0]);

            setSubject(filledSubject);
            if (messageRef.current) {
                messageRef.current.innerHTML = filledBody;
            }
        }
    };

    // Send email
    const handleSendEmail = async () => {
        setIsSending(true);
        try {
            const messageContent = messageRef.current.innerHTML;
            await axiosInstance.post(`${process.env.REACT_APP_API_BASE_URL}/send-email`, {
                to: toEmail,
                cc: ccEmail,
                propertyAddress: property.address,
                clientName: agent.name,
                subject,
                message: messageContent,
                attachments
            });
            alert('Email sent successfully!');
            onClose();
        } catch (error) {
            console.error('Error sending email:', error);
            alert('Failed to send email.');
        } finally {
            setIsSending(false);
        }
    };

    // Handle file upload
    const handleFileUpload = (event) => {
        const files = event.target.files;
        const fileArray = Array.from(files).map(file => ({
            filename: file.name,
            mimetype: file.type,
            base64: '' // Convert the file to base64 as needed
        }));
        setAttachments(fileArray);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 modal-backdrop p-4">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto modal-content">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Send Email to {agent.name}</h2>
                    <button onClick={onClose} className="text-gray-600 dark:text-gray-400 hover:text-red-500">
                        ✕
                    </button>
                </div>

                {/* Property Address */}
                <p className="text-gray-700 dark:text-gray-300"><strong>Property:</strong> {property.address}</p>

                {/* Template Selection */}
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mt-4">Select Email Template:</label>
                <select
                    className="w-full border p-2 rounded-md bg-white dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                    value={selectedTemplate}
                    onChange={(e) => applyTemplate(e.target.value)}
                >
                    <option value="">Select a template</option>
                    {templates.map(template => (
                        <option key={template._id} value={template._id}>{template.name}</option>
                    ))}
                </select>

                {/* Email Fields */}
                <div className="mt-4 space-y-3">
                    <input
                        type="text"
                        className="w-full border p-2 rounded-md bg-white dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                        value={toEmail}
                        onChange={(e) => setToEmail(e.target.value)}
                        placeholder="To Email"
                    />
                    <input
                        type="text"
                        className="w-full border p-2 rounded-md bg-white dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                        value={ccEmail}
                        onChange={(e) => setCcEmail(e.target.value)}
                        placeholder="CC Email"
                    />
                    <input
                        type="text"
                        className="w-full border p-2 rounded-md bg-white dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Email Subject"
                    />
                </div>

                {/* Email Body (Editable) */}
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mt-4">Email Message:</label>
                <div
                    ref={messageRef}
                    contentEditable
                    className="w-full border p-2 rounded-md bg-white dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500 h-40 overflow-y-auto outline-none"
                    style={{ whiteSpace: 'pre-wrap' }}
                />

                {/* Attachments */}
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mt-4">Attachments:</label>
                <input type="file" multiple onChange={handleFileUpload} className="mt-2 w-full" />

                {/* Actions */}
                <div className="flex justify-end mt-6 space-x-3">
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSendEmail}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                        disabled={isSending}
                    >
                        {isSending ? 'Sending...' : 'Send Email'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmailModal;
