import React, { useState } from "react";
import propertySchemaFields from "../data/propertySchema";

const PropertyFields = ({ formData, setFormData, visibleSections, readOnly = false }) => {
    const [newCheckName, setNewCheckName] = useState("");

    const addNewCheck = () => {
        if (!newCheckName.trim()) return;
        const updatedChecks = [...(formData.dueDiligence?.additionalChecks || []), { name: newCheckName, status: "pending" }];
        setFormData({ ...formData, dueDiligence: { ...formData.dueDiligence, additionalChecks: updatedChecks } });
        setNewCheckName(""); // Clear input after adding
    };

    return (
        <div className="space-y-6">
            {Object.entries(propertySchemaFields).map(([section, fields]) => {
                if (!visibleSections.includes(section)) return null;

                return (
                    <div key={section} className="bg-white p-5 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-3 border-b pb-2">{section}</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {fields.map(({ key, label, type, options, editable }) => (
                                <div key={key} className="flex flex-col">
                                    <label className="font-medium mb-1">{label}:</label>

                                    {type === "text" || type === "number" ? (
                                        <input
                                            type={type}
                                            name={key}
                                            value={formData[key] || ""}
                                            onChange={(e) => !readOnly && setFormData({ ...formData, [key]: e.target.value })}
                                            className={`w-full p-2 rounded-md focus:ring focus:ring-blue-300 
                                                ${readOnly ? "bg-gray-100 border-none cursor-default" : "border border-gray-300"}`}
                                            readOnly={readOnly}
                                        />
                                    ) : null}

                                    {type === "dropdown" && (
                                        <select
                                            name={key}
                                            value={key.startsWith("dueDiligence.") ? formData.dueDiligence?.[key.split(".")[1]] || "" : formData[key] || ""}
                                            onChange={(e) => {
                                                if (!readOnly) {
                                                    setFormData((prevFormData) => {
                                                        const updatedKey = key.split(".")[1]; // Extract "insurance", "floodZone", etc.

                                                        return key.startsWith("dueDiligence.")
                                                            ? {
                                                                ...prevFormData,
                                                                dueDiligence: {
                                                                    ...prevFormData.dueDiligence,
                                                                    [updatedKey]: e.target.value, // ✅ Correctly updates nested fields
                                                                },
                                                            }
                                                            : { ...prevFormData, [key]: e.target.value }; // ✅ For normal fields
                                                    });
                                                }
                                            }}
                                            className={`w-full p-2 rounded-md focus:ring focus:ring-blue-300 
                                            ${readOnly ? "bg-gray-100 border-none cursor-default" : "border border-gray-300"}`}
                                            disabled={readOnly}
                                        >
                                            <option value="">Select</option>
                                            {options.map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            ))}
                        </div>

 {/* ✅ Render Additional Due Diligence Checks */}
{section === "Additional Due Diligence" && (
    <div>
        {(formData.dueDiligence?.additionalChecks || []).map((check, index) => (
            <div key={index} className="flex flex-col sm:flex-row items-center gap-2 mb-2">
                <input
                    type="text"
                    value={check.name}
                    className="border p-2 rounded-md w-full sm:flex-grow bg-gray-100"
                    readOnly
                />
                <select
                    value={check.status}
                    onChange={(e) => {
                        const updatedChecks = [...formData.dueDiligence.additionalChecks];
                        updatedChecks[index].status = e.target.value;
                        setFormData({ ...formData, dueDiligence: { ...formData.dueDiligence, additionalChecks: updatedChecks } });
                    }}
                    className="border p-2 rounded-md w-full sm:w-40"
                    disabled={readOnly}
                >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                </select>
            </div>
        ))}

        {/* ✅ Add New Additional Check (Aligned Properly) */}
        {!readOnly && (
            <div className="mt-3 flex flex-col sm:flex-row items-center gap-2 w-full">
                <input
                    type="text"
                    placeholder="Enter new check"
                    value={newCheckName}
                    onChange={(e) => setNewCheckName(e.target.value)}
                    className="border p-2 rounded-md w-full sm:flex-grow text-sm"
                />
                <button
                    onClick={addNewCheck}
                    type="button"
                    className="w-full sm:w-40 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
                >
                    Add Check
                </button>
            </div>
        )}
    </div>
)}


                    </div>
                );
            })}
        </div>
    );
};

export default PropertyFields;
