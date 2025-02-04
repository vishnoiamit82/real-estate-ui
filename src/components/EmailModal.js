import React, { useState } from 'react';
import axios from 'axios';

const EmailModal = ({ property, agent, templates, onClose }) => {
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [message, setMessage] = useState('');
    const [subject, setSubject] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [isSending, setIsSending] = useState(false);

    const applyTemplate = (templateId) => {
        const template = templates.find(t => t._id === templateId);
        if (template) {
            setSelectedTemplate(templateId);
            const filledSubject = template.subject.replace('{{property_address}}', property.address);
            const filledBody = template.body
                .replace('{{property_address}}', property.address)
                .replace('{{sales_agent_name}}', agent.name);

            setSubject(filledSubject);
            setMessage(filledBody);
        }
    };

    const handleSendEmail = async () => {
        setIsSending(true);
        try {
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/send-email`, {
                to: agent.email,
                propertyAddress: property.address,
                clientName: agent.name,
                subject,
                message,
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
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
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

                <div
                    className="w-full border p-2 rounded-md mt-4"
                    dangerouslySetInnerHTML={{ __html: message }}
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
