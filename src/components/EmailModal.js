import React, { useState, useRef } from 'react';
import axios from 'axios';

const EmailModal = ({ property, agent, templates, onClose }) => {
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [subject, setSubject] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [isSending, setIsSending] = useState(false);
    const messageRef = useRef(null); // Use ref for contentEditable div

    const applyTemplate = (templateId) => {
        const template = templates.find(t => t._id === templateId);
        if (template) {
            setSelectedTemplate(templateId);
            const filledSubject = template.subject.replace('{{property_address}}', property.address);
            const filledBody = template.body
                .replace('{{property_address}}', property.address)
                .replace('{{sales_agent_name}}', agent.name);

            setSubject(filledSubject);
            if (messageRef.current) {
                messageRef.current.innerHTML = filledBody; // Set inner HTML for formatting
            }
        }
    };

    const handleSendEmail = async () => {
        setIsSending(true);
        try {
            const messageContent = messageRef.current.innerHTML; // Get the HTML content
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/send-email`, {
                to: agent.email,
                propertyAddress: property.address,
                clientName: agent.name,
                subject,
                message: messageContent, // Send as HTML
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

    const handleFileUpload = (event) => {
        const files = event.target.files;
        const fileArray = Array.from(files).map(file => ({
            filename: file.name,
            mimetype: file.type,
            base64: '' // Need to convert to base64 before sending
        }));
        setAttachments(fileArray);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 max-h-[85vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Send Email to {agent.name}</h2>
                <p><strong>Property Address:</strong> {property.address}</p>

                <select
                    className="w-full border p-2 rounded-md mt-4"
                    value={selectedTemplate}
                    onChange={(e) => applyTemplate(e.target.value)}
                >
                    <option value="">Select a template</option>
                    {templates.map(template => (
                        <option key={template._id} value={template._id}>{template.name}</option>
                    ))}
                </select>

                {/* Editable Subject */}
                <input
                    type="text"
                    className="w-full border p-2 rounded-md mt-4"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Email Subject"
                />

                {/* Editable Email Body (Rich Text) */}
                <div
                    ref={messageRef}
                    contentEditable
                    className="w-full border p-2 rounded-md mt-4 h-60 overflow-y-auto outline-none"
                    style={{ whiteSpace: 'pre-wrap' }} // Preserve line breaks
                />

                <input type="file" multiple onChange={handleFileUpload} className="mt-4" />

                <div className="flex justify-end mt-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2">Cancel</button>
                    <button
                        onClick={handleSendEmail}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
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
