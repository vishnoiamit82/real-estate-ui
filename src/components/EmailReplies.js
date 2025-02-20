import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';

const EmailReplies = ({ email }) => {
    const [replies, setReplies] = useState([]);

    useEffect(() => {
        const fetchReplies = async () => {
            try {
                const response = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/email-replies?to=${email}`);
                setReplies(response.data);
            } catch (error) {
                console.error("Error fetching email replies:", error);
            }
        };
        fetchReplies();
    }, [email]);

    return (
        <div>
            <h3>Email Responses</h3>
            {replies.length === 0 ? (
                <p>No replies yet.</p>
            ) : (
                <ul>
                    {replies.map((reply, index) => (
                        <li key={index}>
                            <p><strong>From:</strong> {reply.from}</p>
                            <p><strong>Subject:</strong> {reply.subject}</p>
                            <p>{reply.body}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default EmailReplies;
