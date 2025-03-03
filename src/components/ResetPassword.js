import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../axiosInstance";

const ResetPassword = () => {
    const { token } = useParams(); // Get the token from the URL
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match!");
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/reset-password`, {
                token,
                newPassword
            });

            setMessage(response.data.message);
            setTimeout(() => navigate("/login"), 3000); // Redirect to login after success
        } catch (error) {
            setMessage("Failed to reset password. The link may be expired.");
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-md">
            <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
            {message && <p className="text-center text-red-500">{message}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1">New Password:</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1">Confirm Password:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                    Reset Password
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
