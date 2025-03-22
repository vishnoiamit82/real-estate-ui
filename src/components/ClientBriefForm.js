// Updated ClientBriefForm with Invite Prefill and Banner Display
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import { useAuth } from './AuthContext';

const stepTitles = ['Client Info 🧍', 'Preferences 🏠', 'Advanced Criteria ⚙️', 'Criteria Importance 🎯', 'Summary 📋'];

const ProgressBar = ({ step, totalSteps }) => {
    const percent = Math.round((step / totalSteps) * 100);
    return (
        <div className="w-full mb-6">
            <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-700 font-semibold">Step {step} of {totalSteps}</span>
                <span className="text-sm text-gray-600 italic">{stepTitles[step - 1]}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 shadow-sm">
                <div className={`h-3 rounded-full transition-all duration-300 ${percent < 100 ? 'bg-blue-500' : 'bg-green-500'}`} style={{ width: `${percent}%` }}></div>
            </div>
        </div>
    );
};

const ClientBriefForm = ({  }) => {
    const [step, setStep] = useState(1);
    const { currentUser } = useAuth();
    
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    const searchParams = new URLSearchParams(window.location.search);
    const urlBuyerAgentId = searchParams.get('buyerAgentId');
    const invitedBy = searchParams.get('invitedBy');
    const effectiveBuyerAgentId =  urlBuyerAgentId ||  currentUser?.id || '';

    // console.log ("effectiveBuyerAgentId ", effectiveBuyerAgentId)
    const [formData, setFormData] = useState({
        clientName: '', budgetMax: '', preferredLocations: '', bedrooms: '', bathrooms: '', fullName: '', email: '', phoneNumber: '', address: '', contractPurchaser: '', entityType: '', investmentStrategy: '', interestRate: '', minYield: '', maxMonthlyHoldingCost: '', minBuildYear: '', invitedBy: invitedBy || '', buyerAgentId: effectiveBuyerAgentId,
        weightage: { location: 3, budget: 3, bedrooms: 3, bathrooms: 3, subdivisionPotential: 3, minYield: 3, maxMonthlyHoldingCost: 3, ageOfProperty: 3 }
    });

    useEffect(() => {
        if (id) {
          const fetchClientBrief = async () => {
            try {
              const response = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/client-briefs/${id}`);
              const data = response.data;
              setFormData(prev => ({
                ...prev,
                ...data,
                budgetMax: data.budget?.max || '', // ✅ Add this line
                preferredLocations: Array.isArray(data.preferredLocations)
                  ? data.preferredLocations.join(', ')
                  : data.preferredLocations || '',
              }));
            } catch (error) {
              console.error('Error fetching client brief:', error);
            }
          };
          fetchClientBrief();
        }
      }, [id]);
      
      

    useEffect(() => {
        if (currentUser && (!formData.buyerAgentId || !formData.invitedBy)) {
          setFormData(prev => ({
            ...prev,
            buyerAgentId: prev.buyerAgentId || effectiveBuyerAgentId,
            invitedBy: prev.invitedBy || invitedBy || effectiveBuyerAgentId
          }));
        }
      }, [currentUser]);

    const handleSubmit = async () => {
        try {
            const payload = {
                buyerAgentId: formData.buyerAgentId,
                invitedBy: formData.invitedBy,
                clientName: formData.clientName,
                budget: { max: formData.budgetMax ? parseFloat(formData.budgetMax) : undefined },
                preferredLocations: formData.preferredLocations.split(',').map(loc => loc.trim()),
                bedrooms: parseInt(formData.bedrooms) || undefined,
                bathrooms: parseInt(formData.bathrooms) || undefined,
                fullName: formData.fullName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                address: formData.address,
                contractPurchaser: formData.contractPurchaser,
                entityType: formData.entityType,
                investmentStrategy: formData.investmentStrategy,
                interestRate: parseFloat(formData.interestRate) || undefined,
                minYield: formData.minYield,
                maxMonthlyHoldingCost: formData.maxMonthlyHoldingCost,
                minBuildYear: formData.minBuildYear,
                weightage: formData.weightage
            };
            if (id) await axiosInstance.put(`${process.env.REACT_APP_API_BASE_URL}/client-briefs/${id}`, payload);
            else await axiosInstance.post(`${process.env.REACT_APP_API_BASE_URL}/client-briefs`, payload);
            setMessage('Client Brief saved successfully!');
            setTimeout(() => navigate('/client-briefs'), 1500);
        } catch (error) {
            console.error('Error saving client brief:', error);
            setMessage('Failed to save client brief.');
        }
    };

    const getWeightLabel = val => (val <= 2 ? 'Low' : val === 3 ? 'Medium' : 'High');

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (<fieldset className="border p-4 rounded-md mb-4"><legend className="font-semibold mb-2">Client Info</legend><div className="grid grid-cols-1 gap-4"><input placeholder="Client Name" value={formData.clientName} onChange={e => setFormData({ ...formData, clientName: e.target.value })} className="p-3 border rounded-md" /><input placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="p-3 border rounded-md" /><input placeholder="Phone Number" value={formData.phoneNumber} onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })} className="p-3 border rounded-md" /><input placeholder="Address" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="p-3 border rounded-md" /></div></fieldset>);
            case 2:
                return (<fieldset className="border p-4 rounded-md mb-4"><legend className="font-semibold mb-2">Preferences</legend><div className="bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm p-3 rounded-md mb-4">
                    <strong>Note:</strong> Your brief will be used to match properties. Too tight criteria may lead to zero results, and vague inputs may bring irrelevant matches. Be as realistic and specific as possible.
                </div>
                    <div className="grid grid-cols-1 gap-4"><input placeholder="Budget Max ($)" type="number" value={formData.budgetMax} onChange={e => setFormData({ ...formData, budgetMax: e.target.value })} className="p-3 border rounded-md" /><input placeholder="Preferred Locations" value={formData.preferredLocations} onChange={e => setFormData({ ...formData, preferredLocations: e.target.value })} className="p-3 border rounded-md" /><p className="text-xs text-gray-500 -mt-2">e.g., Suburb (Parramatta), Region (Western Sydney), or State (NSW)</p><input placeholder="Minimum Bedrooms" type="number" value={formData.bedrooms} onChange={e => setFormData({ ...formData, bedrooms: e.target.value })} className="p-3 border rounded-md" /><input placeholder="Minimum Bathrooms" type="number" value={formData.bathrooms} onChange={e => setFormData({ ...formData, bathrooms: e.target.value })} className="p-3 border rounded-md" /></div></fieldset>);
            case 3:
                return (<fieldset className="border p-4 rounded-md mb-4"><legend className="font-semibold mb-2">Advanced Criteria</legend><div className="grid grid-cols-1 gap-4"><input placeholder="Minimum Gross Yield (%)" type="number" value={formData.minYield} onChange={e => setFormData({ ...formData, minYield: e.target.value })} className="p-3 border rounded-md" /><input placeholder="Maximum holding cost/month if negatively geared ($)" type="number" value={formData.maxMonthlyHoldingCost} onChange={e => setFormData({ ...formData, maxMonthlyHoldingCost: e.target.value })} className="p-3 border rounded-md" /><input placeholder="Minimum Build Year" type="number" value={formData.minBuildYear} onChange={e => setFormData({ ...formData, minBuildYear: e.target.value })} className="p-3 border rounded-md" /><label className="block font-medium">Entity you are purchasing in:</label><select value={formData.entityType} onChange={e => setFormData({ ...formData, entityType: e.target.value })} className="p-3 border rounded-md"><option value="">Select Entity</option><option value="Trust">Trust</option><option value="SMSF">SMSF</option><option value="Individual">Individual</option><option value="Not decided">Not decided yet</option></select></div></fieldset>);
            case 4:
                return (<fieldset className="border p-4 rounded-md mb-4"><legend className="font-semibold mb-2">Criteria Importance</legend><div className="grid grid-cols-1 gap-4">{Object.entries(formData.weightage).map(([key, val]) => (<div key={key}><label className="capitalize font-medium">{key.replace(/([A-Z])/g, ' $1')}</label><input type="range" min="1" max="5" value={val} onChange={e => setFormData({ ...formData, weightage: { ...formData.weightage, [key]: parseInt(e.target.value) } })} className="w-full accent-blue-500" /><div className="text-right text-sm text-gray-600">{getWeightLabel(val)} Priority</div></div>))}</div></fieldset>);
            case 5:
                return (<div className="border p-4 rounded-md bg-gray-50"><h3 className="text-xl font-semibold mb-2">Summary Preview</h3><ul className="text-sm space-y-1"><li><strong>Client Name:</strong> {formData.clientName}</li><li><strong>Email:</strong> {formData.email}</li><li><strong>Phone:</strong> {formData.phoneNumber}</li><li><strong>Locations:</strong> {formData.preferredLocations}</li><li><strong>Budget Max:</strong> ${formData.budgetMax}</li><li><strong>Yield:</strong> {formData.minYield}%</li><li><strong>Maximum holding cost if negatively geared:</strong> ${formData.maxMonthlyHoldingCost}</li><li><strong>Build Year:</strong> {formData.minBuildYear}</li><li><strong>Entity:</strong> {formData.entityType}</li></ul><h4 className="mt-4 font-semibold">Weightage Summary</h4><ul className="text-sm space-y-1">{Object.entries(formData.weightage).map(([key, val]) => (<li key={key} className="flex justify-between"><span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span><span className="text-gray-700 font-medium">{getWeightLabel(val)}</span></li>))}</ul></div>);
            default: return null;
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-2xl bg-white shadow-md rounded-lg">
            {formData.invitedBy && (
                <div className="bg-yellow-100 text-yellow-800 p-3 rounded mb-4 text-sm">
                    You are filling this brief on behalf of <strong>{formData.invitedBy === currentUser.id ? 'yourself' : `Agent ${formData.invitedBy}`}</strong>.
                </div>
            )}
            <ProgressBar step={step} totalSteps={5} />
            {message && <div className="mb-4 p-2 text-sm text-white bg-green-500 rounded-md">{message}</div>}
            {renderStepContent()}
            <div className="flex justify-between mt-4">
                {step > 1 && <button onClick={() => setStep(step - 1)} className="px-4 py-2 bg-gray-400 text-white rounded-md">Back</button>}
                {step < 5 && <button onClick={() => setStep(step + 1)} className="ml-auto px-4 py-2 bg-blue-500 text-white rounded-md">Next</button>}
                {step === 5 && <button onClick={handleSubmit} className="ml-auto px-4 py-2 bg-green-600 text-white rounded-md">Submit</button>}
            </div>
        </div>
    );
};

export default ClientBriefForm;
