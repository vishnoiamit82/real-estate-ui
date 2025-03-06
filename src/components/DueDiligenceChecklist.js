import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';

const DueDiligenceChecklist = ({ propertyId, createdBy }) => {
    const [dueDiligence, setDueDiligence] = useState({});
    const [additionalChecks, setAdditionalChecks] = useState([]); // Stores dynamic due diligence items
    const [newCheckName, setNewCheckName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentUser, setCurrentUser] = useState(null); // Get logged-in user from local storage

    useEffect(() => {
        fetchDueDiligence();
        getCurrentUserFromLocalStorage();
    }, []);

    // ✅ Fetch Due Diligence Data
    const fetchDueDiligence = async () => {
        try {
            const response = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/properties/${propertyId}/due-diligence`);
            setDueDiligence(response.data.dueDiligence);
            setAdditionalChecks(response.data.dueDiligence.additionalChecks || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching due diligence:', error);
            setError('Failed to load due diligence data.');
        }
    };

    // ✅ Retrieve Logged-in User from Local Storage
    const getCurrentUserFromLocalStorage = () => {
        const userData = localStorage.getItem('currentUser'); // Ensure 'user' is set during login
        if (userData) {
            setCurrentUser(JSON.parse(userData)); // Parse stored user data
        }
    };

    // ✅ Update Due Diligence (Only if current user is the property creator)
    const updateDueDiligence = async (check, status) => {
        if (!currentUser || currentUser._id !== createdBy) {
            alert("You are not authorized to update this property.");
            return;
        }
        try {
            await axiosInstance.patch(`${process.env.REACT_APP_API_BASE_URL}/properties/${propertyId}/due-diligence`, {
                [check]: status
            });
            setDueDiligence({ ...dueDiligence, [check]: status });
        } catch (error) {
            console.error('Error updating due diligence:', error);
            setError('Failed to update due diligence.');
        }
    };

    // ✅ Update Additional Due Diligence Checks
    const updateAdditionalCheck = async (index, field, value) => {
        if (!currentUser || currentUser._id !== createdBy) {
            alert("You are not authorized to update this property.");
            return;
        }

        const updatedChecks = [...additionalChecks];
        updatedChecks[index][field] = value;
        setAdditionalChecks(updatedChecks);

        try {
            await axiosInstance.patch(`${process.env.REACT_APP_API_BASE_URL}/properties/${propertyId}/due-diligence`, {
                additionalChecks: updatedChecks
            });
        } catch (error) {
            console.error('Error updating additional due diligence:', error);
            setError('Failed to update additional due diligence.');
        }
    };

    // ✅ Add a New Additional Due Diligence Check
    const addNewCheck = async () => {
        if (!currentUser || currentUser._id !== createdBy) {
            alert("You are not authorized to update this property.");
            return;
        }
        if (!newCheckName.trim()) {
            alert("Please enter a valid check name.");
            return;
        }

        const newCheck = { name: newCheckName.trim(), status: "pending" };
        const updatedChecks = [...additionalChecks, newCheck];

        setAdditionalChecks(updatedChecks);
        setNewCheckName('');

        try {
            await axiosInstance.patch(`${process.env.REACT_APP_API_BASE_URL}/properties/${propertyId}/due-diligence`, {
                additionalChecks: updatedChecks
            });
        } catch (error) {
            console.error('Error adding new due diligence check:', error);
            setError('Failed to add new due diligence check.');
        }
    };

    if (loading) return <p>Loading due diligence data...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-4 border rounded-md bg-gray-50">
            <h3 className="text-lg font-bold mb-3">Due Diligence Checklist</h3>
            <ul>
                {/* Render Predefined Due Diligence Checks */}
                {Object.keys(dueDiligence).map((check) => (
                    check !== 'additionalChecks' && (
                        <li key={check} className="flex justify-between items-center mb-2">
                            <span className="capitalize">{check.replace(/([A-Z])/g, ' $1')}:</span>
                            <select
                                value={dueDiligence[check]}
                                onChange={(e) => updateDueDiligence(check, e.target.value)}
                                className="border p-1 rounded-md"
                                disabled={!currentUser || currentUser._id !== createdBy}
                            >
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                                <option value="failed">Failed</option>
                            </select>
                        </li>
                    )
                ))}
            </ul>

            {/* Render Additional Checks as Editable Fields */}
            <h4 className="text-md font-bold mt-4">Additional Due Diligence</h4>
            {additionalChecks.map((check, index) => (
                <div key={index} className="flex justify-between items-center mb-2">
                    <input
                        type="text"
                        value={check.name}
                        className="border p-1 rounded-md flex-1 mr-2"
                        readOnly
                    />
                    <select
                        value={check.status}
                        onChange={(e) => updateAdditionalCheck(index, "status", e.target.value)}
                        className="border p-1 rounded-md"
                        disabled={!currentUser || currentUser._id !== createdBy}
                    >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                    </select>
                </div>
            ))}

            {/* Add New Additional Check */}
            {currentUser && currentUser._id === createdBy && (
                <div className="mt-3">
                    <input
                        type="text"
                        placeholder="Enter new check"
                        value={newCheckName}
                        onChange={(e) => setNewCheckName(e.target.value)}
                        className="border p-2 rounded-md w-full"
                    />
                    <button
                        onClick={addNewCheck}
                        className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                        Add Check
                    </button>
                </div>
            )}

            {!currentUser || currentUser._id !== createdBy ? (
                <p className="text-gray-500 text-sm mt-2">Only the property owner can update due diligence.</p>
            ) : null}
        </div>
    );
};

export default DueDiligenceChecklist;
