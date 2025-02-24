import React, { useState, useRef, useEffect } from 'react';
import axiosInstance from '../axiosInstance';

const EmailModal = ({ property, agent, templates, onClose }) => {
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [subject, setSubject] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [isSending, setIsSending] = useState(false);
    const [ccEmail, setCcEmail] = useState(''); // initialize as empty string
    const messageRef = useRef(null);

    // Update ccEmail after mount to avoid hydration issues
    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            try {
                const currentUser = JSON.parse(storedUser);
                if (currentUser?.email) {
                    setCcEmail(currentUser.email);
                }
            } catch (error) {
                console.error('Error parsing currentUser from localStorage:', error);
            }
        }
    }, []);

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
                messageRef.current.innerHTML = filledBody;
            }
        }
    };

    const handleSendEmail = async () => {
        setIsSending(true);
        try {
            const messageContent = messageRef.current.innerHTML;
            await axiosInstance.post(`${process.env.REACT_APP_API_BASE_URL}/send-email`, {
                to: agent.email,
                cc: ccEmail, // Use the ccEmail state value
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

                <input
                    type="text"
                    className="w-full border p-2 rounded-md mt-4"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Email Subject"
                />

                {/* Form field for CC email */}
                <input
                    type="text"
                    className="w-full border p-2 rounded-md mt-4"
                    value={ccEmail}
                    onChange={(e) => setCcEmail(e.target.value)}
                    placeholder="CC Email"
                />

                <div
                    ref={messageRef}
                    contentEditable
                    className="w-full border p-2 rounded-md mt-4 h-60 overflow-y-auto outline-none"
                    style={{ whiteSpace: 'pre-wrap' }}
                />

                <input type="file" multiple onChange={handleFileUpload} className="mt-4" />

                <div className="flex justify-end mt-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2">
                        Cancel
                    </button>
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
