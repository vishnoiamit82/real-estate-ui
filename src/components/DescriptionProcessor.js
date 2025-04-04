// components/DescriptionProcessor.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';


const Spinner = () => (
    <div className="flex justify-center items-center mt-3">
        <div className="w-6 h-6 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
    </div>
);

const DescriptionProcessor = ({ formData, setFormData, onMessage, onProcessedSuccess, onDescriptionProcessed }) => {
    const [description, setDescription] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [message, setMessage] = useState('');
    const [overwriteExisting, setOverwriteExisting] = useState(false);

    useEffect(() => {
        console.log("formData.nearbySchools updated to:", formData.nearbySchools);
    }, [formData.nearbySchools]);


    const handleProcessDescription = async () => {
        if (!description.trim()) {
            setMessage('⚠️ Please enter a description to process.');
            return;
        }



        setIsProcessing(true);
        setMessage('');
        onMessage && onMessage('');

        try {
            const response = await axiosInstance.post(
                `${process.env.REACT_APP_API_BASE_URL}/process-description`,
                { description },
                { headers: { 'Content-Type': 'application/json' } }
            );

            const structuredData = response.data.structuredData;

            setFormData((prev) => {
                const updated = { ...prev };

                for (const key in structuredData) {
                    let incoming = structuredData[key];

                    // Deep merge dueDiligence
                    if (key === "dueDiligence" && typeof incoming === "object") {
                        updated.dueDiligence = {
                            ...(prev.dueDiligence || {}),
                            ...incoming,
                        };
                    } else {
                        const shouldOverwrite =
                            overwriteExisting || !prev[key] || (Array.isArray(prev[key]) && prev[key].length === 0);

                        if (shouldOverwrite && incoming !== undefined && incoming !== null) {
                            updated[key] = incoming;
                        }
                    }
                }

                // Handle special case for boolean conversion
                if (structuredData.isOffMarket !== undefined) {
                    updated.offMarketStatus = structuredData.isOffMarket ? "yes" : "no";
                }

                return { ...updated };
            });




            setMessage('✅ Information extracted successfully! Please review and edit if needed.');
            onMessage && onMessage('✅ Information extracted successfully!');
            onProcessedSuccess && onProcessedSuccess();
            onDescriptionProcessed && onDescriptionProcessed(description);
        } catch (error) {
            console.error('Error processing description:', error);
            setMessage('⚠️ Failed to extract details. Please enter manually.');
            onMessage && onMessage('⚠️ Failed to extract details.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="mt-6 p-6 bg-white border rounded-lg shadow-lg w-full max-w-6xl mx-auto">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">🏡 Property Description</h3>

            <button
                type="button"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="text-blue-500 text-sm font-semibold mb-2"
            >
                {isCollapsed ? 'View Description' : 'Hide Description'} ⌄
            </button>

            {!isCollapsed && (
                <>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                        placeholder="Paste agent email or listing description to extract details."
                        rows="5"
                    ></textarea>

                    <div className="flex items-center mt-3 gap-2">
                        <input
                            type="checkbox"
                            checked={overwriteExisting}
                            onChange={(e) => setOverwriteExisting(e.target.checked)}
                            id="overwrite-toggle"
                        />
                        <label htmlFor="overwrite-toggle" className="text-sm text-gray-700">
                            Overwrite existing fields
                        </label>
                    </div>

                    <div className="flex justify-center sm:justify-start">
                        <button
                            type="button"
                            onClick={handleProcessDescription}
                            className={`mt-3 px-6 py-3 rounded-md text-white font-semibold transition-all duration-200 
                                ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                            disabled={isProcessing}
                        >
                            {isProcessing ? "Processing..." : "🔍 Extract Information"}
                        </button>
                    </div>
                </>
            )}

            {isProcessing && <Spinner />}

            {message && (
                <p className={`mt-3 text-center sm:text-left text-lg ${message.includes("failed") ? "text-red-600" : "text-green-600"}`}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default DescriptionProcessor;