import React, { useState } from "react";
import propertySchemaFields from "../data/propertySchema";

// ✅ Helper functions to support dot-notation nested field access
const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
};

const setNestedValue = (obj, path, value) => {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((acc, key) => {
        if (!acc[key]) acc[key] = {};
        return acc[key];
    }, obj);
    target[lastKey] = value;
};

const PropertyFields = ({ formData, setFormData, visibleSections, readOnly = false, mode = "shared" ,onChange}) => {
    const [newCheckName, setNewCheckName] = useState("");

    const addNewCheck = () => {
        if (!newCheckName.trim()) return;
        const updatedChecks = [...(formData.dueDiligence?.additionalChecks || []), { name: newCheckName, status: "pending" }];
        setFormData({
            ...formData,
            dueDiligence: { ...formData.dueDiligence, additionalChecks: updatedChecks },
        });
        setNewCheckName("");
    };

    const shouldDisplayField = (formData, key, mode) => {
        if (mode === "edit") return true;

        const value = getNestedValue(formData, key);
        if (value === null || value === undefined) return false;
        if (typeof value === "string" && value.trim() === "") return false;
        if (Array.isArray(value) && value.length === 0) return false;
        if (typeof value === "object" && Object.keys(value).length === 0) return false;

        return true;
    };


    return (
        <div className="space-y-6">
            {Object.entries(propertySchemaFields).map(([section, fields]) => {
                if (!visibleSections.includes(section)) return null;

                return (
                    <div key={section} className="bg-white p-5 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-3 border-b pb-2">{section}</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {fields
                                .filter(({ key }) => shouldDisplayField(formData, key, mode))
                                .map(({ key, label, type, options, editable }) => (

                                    <div key={key} className="flex flex-col">
                                        <label className="font-medium mb-1">{label}:</label>

                                        {/* ✅ Editable Arrays (except additionalChecks) */}
                                        {type === "array" && key !== "dueDiligence.additionalChecks" && (
                                            <>
                                                {Array.isArray(getNestedValue(formData, key)) &&
                                                    getNestedValue(formData, key).length > 0 ? (
                                                    getNestedValue(formData, key).map((item, i) => (
                                                        <div key={i} className="flex items-center gap-2 mb-1">
                                                            {readOnly ? (
                                                                <span className="text-sm text-gray-700">{item}</span>
                                                            ) : (
                                                                <>
                                                                    <input
                                                                        type="text"
                                                                        value={item}
                                                                        onChange={(e) => {
                                                                            const updatedArray = [...getNestedValue(formData, key)];
                                                                            updatedArray[i] = e.target.value;
                                                                            const updatedForm = { ...formData };
                                                                            setNestedValue(updatedForm, key, updatedArray);
                                                                            setFormData(updatedForm);
                                                                        }}
                                                                        className="w-full p-2 rounded-md border border-gray-300"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            const updatedArray = [...getNestedValue(formData, key)];
                                                                            updatedArray.splice(i, 1);
                                                                            const updatedForm = { ...formData };
                                                                            setNestedValue(updatedForm, key, updatedArray);
                                                                            setFormData(updatedForm);
                                                                        }}
                                                                        className="text-red-500 font-semibold"
                                                                    >
                                                                        ✖
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    ))
                                                ) : readOnly ? (
                                                    <span className="text-sm text-gray-500 italic">No data</span>
                                                ) : null}

                                                {!readOnly && (
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <input
                                                            type="text"
                                                            placeholder={`Add new ${label}`}
                                                            value={formData[`new_${key}`] || ""}
                                                            onChange={(e) =>
                                                                setFormData((prev) => ({
                                                                    ...prev,
                                                                    [`new_${key}`]: e.target.value,
                                                                }))
                                                            }
                                                            className="w-full p-2 rounded-md border border-gray-300"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newItem = formData[`new_${key}`]?.trim();
                                                                if (!newItem) return;
                                                                const existing = getNestedValue(formData, key) || [];
                                                                const updatedArray = [...existing, newItem];
                                                                const updatedForm = { ...formData };
                                                                setNestedValue(updatedForm, key, updatedArray);
                                                                delete updatedForm[`new_${key}`];
                                                                setFormData(updatedForm);
                                                            }}
                                                            className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                                                        >
                                                            Add
                                                        </button>
                                                    </div>
                                                )}
                                            </>
                                        )}

                                        {/* ✅ Datetime Display */}
                                        {type === "datetime" && getNestedValue(formData, key) && (
                                            <span className="text-sm text-gray-700">
                                                {new Date(getNestedValue(formData, key)).toLocaleString()}
                                            </span>
                                        )}

                                        {/* ✅ Text & Number Inputs */}
                                        {(type === "text" || type === "number") && (
                                            <input
                                                type={type}
                                                name={key}
                                                value={getNestedValue(formData, key) || ""}
                                                onChange={(e) => {
                                                    if (!readOnly) {
                                                        const updatedForm = { ...formData };
                                                        setNestedValue(updatedForm, key, e.target.value);
                                                        setFormData(updatedForm);
                                                        if (typeof onChange === 'function') onChange(e); // ✅ call external handler
                                                    }
                                                }}
                                                className={`w-full p-2 rounded-md focus:ring focus:ring-blue-300 ${readOnly
                                                        ? "bg-gray-100 border-none cursor-default"
                                                        : "border border-gray-300"
                                                    }`}
                                                readOnly={readOnly}
                                            />
                                        )}

                                        {/* ✅ Dropdown Fields */}
                                        {type === "dropdown" && (
                                            <select
                                                name={key}
                                                value={getNestedValue(formData, key) || ""}
                                                onChange={(e) => {
                                                    if (!readOnly) {
                                                        const updatedForm = { ...formData };
                                                        setNestedValue(updatedForm, key, e.target.value);
                                                        setFormData(updatedForm);
                                                    }
                                                }}
                                                className={`w-full p-2 rounded-md focus:ring focus:ring-blue-300 ${readOnly
                                                        ? "bg-gray-100 border-none cursor-default"
                                                        : "border border-gray-300"
                                                    }`}
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

                                        {/* ✅ Boolean Toggle */}
                                        {type === "boolean" && (
                                            <div className="flex items-center justify-between">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (!readOnly) {
                                                            const updatedForm = { ...formData };
                                                            const current = getNestedValue(formData, key);
                                                            setNestedValue(updatedForm, key, !current);
                                                            setFormData(updatedForm);
                                                        }
                                                    }}
                                                    className={`w-16 px-4 py-2 text-sm font-semibold rounded-md ${getNestedValue(formData, key)
                                                            ? "bg-green-500 text-white"
                                                            : "bg-red-500 text-white"
                                                        } ${readOnly
                                                            ? "opacity-50 cursor-not-allowed"
                                                            : "cursor-pointer hover:opacity-80"
                                                        }`}
                                                    disabled={readOnly}
                                                >
                                                    {getNestedValue(formData, key) ? "Yes" : "No"}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                        </div>

                        {/* ✅ Additional Due Diligence Section (unchanged) */}
                        {section === "Additional Due Diligence" && (
                            <div>
                                {(formData.dueDiligence?.additionalChecks || []).map((check, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col sm:flex-row items-center gap-2 mb-2"
                                    >
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
                                                setFormData({
                                                    ...formData,
                                                    dueDiligence: {
                                                        ...formData.dueDiligence,
                                                        additionalChecks: updatedChecks,
                                                    },
                                                });
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
