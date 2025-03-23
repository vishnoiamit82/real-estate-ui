// utils/logPropertyConversation.js
import axiosInstance from '../axiosInstance';

export const logPropertyConversation = async ({
  propertyId,
  type = 'sent',
  subject,
  message,
  from,
  to,
  attachments = [],
  clientBriefId = null
}) => {
  try {
    const payload = {
      propertyId,
      type,
      subject,
      message,
      from,
      to,
      attachments,
      clientBriefId,
    };
    await axiosInstance.post(`${process.env.REACT_APP_API_BASE_URL}/property-conversations`, payload);
  } catch (err) {
    console.error('Failed to log property conversation:', err);
  }
};
