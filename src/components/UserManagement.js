// UserManagement.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';

const UserManagement = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // ✅ Get the JWT token from localStorage
                const token = localStorage.getItem('authToken');

                // ✅ Make the API request with Authorization header
                const response = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/users`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">User Management</h2>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Subscription</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>{user.subscriptionTier}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManagement;
