// ✅ PropertyConversationLog.js -  Reusable UI Component to Display Conversation Log per Property
import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import { MessageCircle, Mail, FileText } from 'lucide-react';

const PropertyConversationLog = ({ propertyId }) => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/property-conversations/${propertyId}`);
                setLogs(response.data);
            } catch (error) {
                console.error('Failed to load conversation log:', error);
            } finally {
                setLoading(false);
            }
        };

        if (propertyId) fetchLogs();
    }, [propertyId]);

    if (!propertyId) return null;
    if (loading) return <p className="text-sm text-gray-600">Loading conversation log...</p>;

    return (
        <div className="mt-6 bg-white border border-gray-200 rounded-md p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <MessageCircle size={18} /> Property Conversations
            </h3>

            {logs.length === 0 ? (
                <p className="text-sm text-gray-500">No conversations logged for this property.</p>
            ) : (
                <div className="space-y-4">
                    {logs.map((log, idx) => (
                        <div key={idx} className="border-b pb-3">
                            <div className="flex justify-between text-sm mb-1">
                                <div>
                                    <span className="font-medium">{log.type.toUpperCase()}</span>
                                    {log.subject && <span className="ml-2 text-gray-600 italic">{log.subject}</span>}
                                </div>
                                <span className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</span>
                            </div>

                            {['sent', 'reply'].includes(log.type) ? (
                                <div
                                    className="text-sm text-gray-700"
                                    dangerouslySetInnerHTML={{ __html: log.message }}
                                />
                            ) : (
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{log.message}</p>
                            )}


                            {log.from?.email && (
                                <p className="text-xs text-gray-500 mt-1">From: {log.from.name} &lt;{log.from.email}&gt;</p>
                            )}
                            {log.to?.email && (
                                <p className="text-xs text-gray-500">To: {log.to.name} &lt;{log.to.email}&gt;</p>
                            )}

                            {log.attachments?.length > 0 && (
                                <div className="mt-2 text-xs flex gap-2 items-center">
                                    <FileText size={14} className="text-gray-500" /> Attachments:
                                    {log.attachments.map((file, fidx) => (
                                        <a key={fidx} href={file} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                                            {file.split('/').pop()}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PropertyConversationLog;