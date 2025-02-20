import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';



const ClientBriefForm = ({ buyerAgentId }) => {
    const [formData, setFormData] = useState({
        clientName: '',
        budgetMin: '',
        budgetMax: '',
        propertyType: '',
        preferredLocations: '',
        bedrooms: '',
        bathrooms: '',
        features: '',
        fullName: '',
        email: '',
        phoneNumber: '',
        address: '',
        contractPurchaser: '',
        investmentStrategy: '',
        interestRate: '',
    });


    const { id } = useParams();
    useEffect(() => {
        if (id) {
            const fetchClientBrief = async () => {
                try {
                    const response = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/client-briefs/${id}`);
                    setFormData({
                        clientName: response.data.clientName || '',
                        budgetMin: response.data.budget?.min || '',
                        budgetMax: response.data.budget?.max || '',
                        propertyType: response.data.propertyType || '',
                        preferredLocations: response.data.preferredLocations?.join(', ') || '',
                        features: response.data.features?.join(', ') || '',
                        bedrooms: response.data.bedrooms || '',
                        bathrooms: response.data.bathrooms || '',
                        fullName: response.data.fullName || '',
                        email: response.data.email || '',
                        phoneNumber: response.data.phoneNumber || '',
                        address: response.data.address || '',
                        contractPurchaser: response.data.contractPurchaser || '',
                        investmentStrategy: response.data.investmentStrategy || '',
                        interestRate: response.data.interestRate || '',
                    });
                } catch (error) {
                    console.error('Error fetching client brief:', error);
                }
            };
            fetchClientBrief();
        }
    }, [id]);


    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                buyerAgentId,
                clientName: formData.clientName,
                budget: {
                    min: formData.budgetMin ? parseFloat(formData.budgetMin) : undefined,
                    max: formData.budgetMax ? parseFloat(formData.budgetMax) : undefined,
                },
                propertyType: formData.propertyType,
                preferredLocations: formData.preferredLocations.split(',').map((loc) => loc.trim()),
                features: formData.features.split(',').map((feat) => feat.trim()),
                bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
                bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : undefined,
                fullName: formData.fullName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                address: formData.address,
                contractPurchaser: formData.contractPurchaser,
                investmentStrategy: formData.investmentStrategy,
                interestRate: formData.interestRate ? parseFloat(formData.interestRate) : undefined,
            };

            if (id) {
                // If editing, send a PUT request to update the existing brief
                await axiosInstance.put(`${process.env.REACT_APP_API_BASE_URL}/client-briefs/${id}`, payload);
                setMessage('Client Brief updated successfully!');
            } else {
                // If creating a new client brief, send a POST request
                await axiosInstance.post(`${process.env.REACT_APP_API_BASE_URL}/client-briefs`, payload);
                setMessage('Client Brief saved successfully!');
            }

            setTimeout(() => navigate('/client-briefs'), 1500);
        } catch (error) {
            console.error('Error saving client brief:', error);
            setMessage('Failed to save client brief. Please try again.');
        }
    };


    return (
        <div className="container mx-auto p-6 max-w-2xl bg-white shadow-md rounded-lg">
            <h2 className="text-3xl font-semibold mb-6 text-center">Create Client Brief</h2>

            {message && (
                <div className={`p-4 mb-4 text-sm rounded-md ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <fieldset className="border p-4 rounded-md">
                    <legend className="font-semibold">Client Information</legend>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium">Client Name:</label>
                            <input type="text" value={formData.clientName} onChange={(e) => setFormData({ ...formData, clientName: e.target.value })} className="w-full p-3 border rounded-md" required />
                        </div>
                        <div>
                            <label className="block font-medium">Full Name:</label>
                            <input type="text" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="w-full p-3 border rounded-md" />
                        </div>
                        <div>
                            <label className="block font-medium">Email:</label>
                            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full p-3 border rounded-md" />
                        </div>
                        <div>
                            <label className="block font-medium">Phone Number:</label>
                            <input type="tel" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} className="w-full p-3 border rounded-md" />
                        </div>
                        <div>
                            <label className="block font-medium">Address:</label>
                            <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full p-3 border rounded-md" />
                        </div>
                    </div>
                </fieldset>

                <fieldset className="border p-4 rounded-md">
                    <legend className="font-semibold">Property Preferences</legend>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium">Budget Range ($):</label>
                            <input type="number" placeholder="Min" value={formData.budgetMin} onChange={(e) => setFormData({ ...formData, budgetMin: e.target.value })} className="w-full p-3 border rounded-md" />
                            <input type="number" placeholder="Max" value={formData.budgetMax} onChange={(e) => setFormData({ ...formData, budgetMax: e.target.value })} className="w-full p-3 border rounded-md mt-2" />
                        </div>
                        <div>
                            <label className="block font-medium">Property Type:</label>
                            <input type="text" value={formData.propertyType} onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })} className="w-full p-3 border rounded-md" />
                        </div>
                    </div>
                </fieldset>

                <fieldset className="border p-4 rounded-md">
                    <legend className="font-semibold">Client Information</legend>
                    <div className="grid grid-cols-2 gap-4">

                        <div>
                            <label className="block font-medium">Contract Purchaser:</label>
                            <input type="text" value={formData.contractPurchaser} onChange={(e) => setFormData({ ...formData, contractPurchaser: e.target.value })} className="w-full p-3 border rounded-md" />
                        </div>
                        <div>
                            <label className="block font-medium">Investment Strategy:</label>
                            <input type="text" value={formData.investmentStrategy} onChange={(e) => setFormData({ ...formData, investmentStrategy: e.target.value })} className="w-full p-3 border rounded-md" />
                        </div>
                        <div>
                            <label className="block font-medium">Interest Rate (%):</label>
                            <input type="number" step="0.01" value={formData.interestRate} onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })} className="w-full p-3 border rounded-md" />
                        </div>
                    </div>
                </fieldset>

                <button type="submit" className="w-full px-4 py-2 bg-green-500 text-white font-medium rounded-md hover:bg-green-600">Save Client Brief</button>
            </form>
        </div>
    );
};

export default ClientBriefForm;
