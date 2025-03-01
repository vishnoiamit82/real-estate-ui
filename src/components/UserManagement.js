import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [updatedRole, setUpdatedRole] = useState('');
    const [updatedSubscription, setUpdatedSubscription] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('authToken');
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

    const handleUpdateUser = async (userId) => {
        try {
            const token = localStorage.getItem('authToken');
            await axiosInstance.put(
                `${process.env.REACT_APP_API_BASE_URL}/users/${userId}`,
                {
                    role: updatedRole,
                    subscriptionTier: updatedSubscription
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            alert('User updated successfully');
            window.location.reload();
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Failed to update user');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            const token = localStorage.getItem('authToken');
            await axiosInstance.delete(`${process.env.REACT_APP_API_BASE_URL}/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('User deleted successfully');
            setUsers(users.filter(user => user._id !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user');
        }
    };

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
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                {editingUser === user._id ? (
                                    <input
                                        type="text"
                                        value={updatedRole}
                                        onChange={(e) => setUpdatedRole(e.target.value)}
                                    />
                                ) : (
                                    user.role
                                )}
                            </td>
                            <td>
                                {editingUser === user._id ? (
                                    <input
                                        type="text"
                                        value={updatedSubscription}
                                        onChange={(e) => setUpdatedSubscription(e.target.value)}
                                    />
                                ) : (
                                    user.subscriptionTier
                                )}
                            </td>
                            <td>
                                {editingUser === user._id ? (
                                    <button onClick={() => handleUpdateUser(user._id)} className="px-2 py-1 bg-green-500 text-white rounded-md">Save</button>
                                ) : (
                                    <button onClick={() => setEditingUser(user._id)} className="px-2 py-1 bg-blue-500 text-white rounded-md">Edit</button>
                                )}
                                <button onClick={() => handleDeleteUser(user._id)} className="ml-2 px-2 py-1 bg-red-500 text-white rounded-md">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManagement;
