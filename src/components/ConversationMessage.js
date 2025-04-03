// components/ConversationMessage.js
import React from 'react';
import { FileText } from 'lucide-react';
import axiosInstance from '../axiosInstance';

const ConversationMessage = ({ log, onMarkAsUnread }) => {
  const handleMarkAsUnread = async () => {
    try {
      await axiosInstance.patch(`${process.env.REACT_APP_API_BASE_URL}/property-conversations/${log._id}/mark-as-unread`);
      onMarkAsUnread && onMarkAsUnread();
    } catch (err) {
      console.error('Failed to mark as unread:', err);
    }
  };

  return (
    <div className="border-b pb-3">
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
            <a
              key={fidx}
              href={file}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              {file.split('/').pop()}
            </a>
          ))}
        </div>
      )}

      {/* Show Mark as Unread button if it's already read */}
      {log.isRead && log.type === 'reply' && (
        <button
          onClick={handleMarkAsUnread}
          className="mt-2 text-xs text-blue-600 hover:underline"
        >
          Mark as Unread
        </button>
      )}
    </div>
  );
};

export default ConversationMessage;
