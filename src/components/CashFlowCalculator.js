import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';

const CashFlowCalculator = () => {
    const [properties, setProperties] = useState([]);
    const [clients, setClients] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [selectedClient, setSelectedClient] = useState('');
    const [cashFlowResult, setCashFlowResult] = useState(null);
    const [purchasePrice, setPurchasePrice] = useState('');
    const [loanAmount, setLoanAmount] = useState('');
    const [lvrPercentage, setLvrPercentage] = useState(80);
    const [councilRate, setCouncilRate] = useState(2500);
    const [maintenance, setMaintenance] = useState(1500);
    const [insurance, setInsurance] = useState(2000);
    const [propertyManagementFee, setPropertyManagementFee] = useState(8);
    const [rentalIncome, setRentalIncome] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [loanTerm, setLoanTerm] = useState(30); // Default to 30 years


    useEffect(() => {
        const fetchData = async () => {
            try {
                const propertyRes = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/properties`);
                const clientRes = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/client-briefs`);
                setProperties(propertyRes.data);
                setClients(clientRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const selectedClientData = clients.find(client => client._id === selectedClient);
        if (selectedClientData) {
            setInterestRate(selectedClientData.interestRate);
        }
    }, [selectedClient]);


    const handleCalculateCashFlow = async () => {
        if (!selectedProperty || !selectedClient) {
            alert('Please select a property and a client.');
            return;
        }
        try {
            const response = await axiosInstance.post(`${process.env.REACT_APP_API_BASE_URL}/cashflow/calculate`, {
                propertyId: selectedProperty._id,
                clientId: selectedClient,
                purchasePrice,
                loanAmount,
                lvrPercentage,
                councilRate,
                maintenance,
                insurance,
                propertyManagementFee,
                rentalIncome
            });
            setCashFlowResult(response.data);
        } catch (error) {
            console.error('Error calculating cash flow:', error);
            alert('Failed to calculate cash flow. Please try again.');
        }
    };


    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const matchedProperty = properties.find(property => property.address?.toLowerCase().includes(query));
        if (matchedProperty) {
            setSelectedProperty(matchedProperty);
            setPurchasePrice(matchedProperty.askingPrice || purchasePrice);
            setLoanAmount(matchedProperty.askingPrice ? (0.8 * matchedProperty.askingPrice).toFixed(2) : loanAmount);
            setCouncilRate(matchedProperty.councilRate || 2500);
            setMaintenance(matchedProperty.maintenance || 1500);
            setInsurance(matchedProperty.insurance || 2000);
            setPropertyManagementFee(matchedProperty.propertyManagementFee || 8);
            setRentalIncome(matchedProperty.rental || rentalIncome);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Cash Flow Calculator</h2>
            <div className="mb-4">
                <label className="block font-medium">Search Property:</label>
                <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="Search by address..."
                    value={searchQuery}
                    onChange={handleSearch}
                />
            </div>
            {selectedProperty && (
                <div className="mb-4 p-4 bg-gray-100 rounded-md">
                    <h3 className="text-lg font-semibold">Selected Property:</h3>
                    <p><strong>Address:</strong> {selectedProperty.address || 'N/A'}</p>
                    <p><strong>Price:</strong> ${selectedProperty.askingPrice || 'N/A'}</p>
                    <label className="block font-medium">Purchase Price:</label>
                    <input
                        type="number"
                        className={`w-full p-2 border rounded-md ${selectedProperty?.askingPrice ? 'text-green-600' : 'text-gray-600'}`}
                        value={purchasePrice}
                        onChange={(e) => {
                            const newPrice = e.target.value;
                            setPurchasePrice(newPrice);
                            setLoanAmount((newPrice * lvrPercentage / 100).toFixed(2)); // Auto-update loan amount
                        }}
                    />

                    <label className="block font-medium">LVR Percentage:</label>
                    <input
                        type="number"
                        className={`w-full p-2 border rounded-md ${lvrPercentage !== 80 ? 'text-green-600' : 'text-gray-600'}`}
                        value={lvrPercentage}
                        onChange={(e) => {
                            const newLvr = e.target.value;
                            setLvrPercentage(newLvr);
                            setLoanAmount((purchasePrice * newLvr / 100).toFixed(2));
                        }}
                    />

                    <label className="block font-medium">Loan Amount:</label>
                    <input
                        type="number"
                        className={`w-full p-2 border rounded-md ${lvrPercentage !== 80 ? 'text-green-600' : 'text-gray-600'}`}
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(e.target.value)}
                    />


                    <label className="block font-medium">Rental Income:</label>
                    <input
                        type="number"
                        className={`w-full p-2 border rounded-md ${selectedProperty?.rental ? 'text-green-600' : 'text-gray-600'}`}
                        value={rentalIncome}
                        onChange={(e) => setRentalIncome(e.target.value)}
                    />
                    <label className="block font-medium">Council Rate:</label>
                    <input
                        type="number"
                        className={`w-full p-2 border rounded-md ${selectedProperty?.councilRate ? 'text-green-600' : 'text-gray-600'}`}
                        value={councilRate}
                        onChange={(e) => setCouncilRate(e.target.value)}
                    />
                    <label className="block font-medium">Insurance:</label>
                    <input
                        type="number"
                        className={`w-full p-2 border rounded-md ${selectedProperty?.insurance ? 'text-green-600' : 'text-gray-600'}`}
                        value={insurance}
                        onChange={(e) => setInsurance(e.target.value)}
                    />
                    <label className="block font-medium">Maintenance (default $1500):</label>
                    <input
                        type="number"
                        className={`w-full p-2 border rounded-md ${selectedProperty?.maintenance ? 'text-green-600' : 'text-gray-600'}`}
                        value={maintenance}
                        onChange={(e) => setMaintenance(e.target.value)}
                    />
                    <label className="block font-medium">Property Management Fee (default 8%):</label>
                    <input
                        type="number"
                        className={`w-full p-2 border rounded-md ${selectedProperty?.propertyManagementFee ? 'text-green-600' : 'text-gray-600'}`}
                        value={propertyManagementFee}
                        onChange={(e) => setPropertyManagementFee(e.target.value)}
                    />
                </div>
            )}
            <div className="mb-4">
                <label className="block font-medium">Select Client:</label>
                <select
                    className="w-full p-2 border rounded-md"
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                >
                    <option value="">-- Choose Client --</option>
                    {clients.map((client) => (
                        <option key={client._id} value={client._id}>
                            {client.clientName} - {client.interestRate}%
                        </option>
                    ))}
                </select>
            </div>
            <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={handleCalculateCashFlow}
            >
                Calculate Cash Flow
            </button>

            {cashFlowResult && (
                <div className="mt-6 p-6 bg-white shadow-lg rounded-lg border border-gray-300">
                    <h3 className="text-3xl font-semibold mb-6 text-center text-gray-700">Cash Flow Breakdown</h3>

                    <table className="w-full border-collapse border border-gray-300 text-lg table-fixed">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 p-2 text-left w-2/3">Input Details</th>
                                <th className="border border-gray-300 p-2 text-left w-1/3">Values</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-gray-300 p-2">Purchase Price</td>
                                <td className="border border-gray-300 p-2 text-gray-700">${purchasePrice}</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 p-2">Loan Amount</td>
                                <td className="border border-gray-300 p-2 text-gray-700">${loanAmount}</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 p-2">Interest Rate</td>
                                <td className="border border-gray-300 p-2 text-gray-700">{interestRate}%</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 p-2">Loan Term</td>
                                <td className="border border-gray-300 p-2 text-gray-700">{loanTerm} years</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 p-2">Council Rate</td>
                                <td className="border border-gray-300 p-2 text-gray-700">${councilRate}</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 p-2">Maintenance</td>
                                <td className="border border-gray-300 p-2 text-gray-700">${maintenance}</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 p-2">Insurance</td>
                                <td className="border border-gray-300 p-2 text-gray-700">${insurance}</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 p-2">Property Management Fee</td>
                                <td className="border border-gray-300 p-2 text-gray-700">{propertyManagementFee}%</td>
                            </tr>
                        </tbody>
                    </table>

                    <table className="w-full border-collapse border border-gray-300 text-lg table-fixed mt-6">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 p-2 text-left w-2/3">Property Income</th>
                                <th className="border border-gray-300 p-2 text-left w-1/3">Values</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-gray-300 p-2">Weekly Rental Income</td>
                                <td className="border border-gray-300 p-2 text-gray-700">${rentalIncome}</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 p-2">Annual Rental Income</td>
                                <td className="border border-gray-300 p-2 text-gray-700">${rentalIncome * 52}</td>
                            </tr>
                        </tbody>
                    </table>

                    <table className="w-full border-collapse border border-gray-300 text-lg table-fixed mt-6">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 p-2 text-left w-2/3">Property Expenses</th>
                                <th className="border border-gray-300 p-2 text-left w-1/3">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-gray-300 p-2">Mortgage Payment</td>
                                <td className="border border-gray-300 p-2">${cashFlowResult.mortgagePI}</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 p-2">Insurance</td>
                                <td className="border border-gray-300 p-2">${cashFlowResult.insurance}</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 p-2">Council Rates</td>
                                <td className="border border-gray-300 p-2">${cashFlowResult.councilRates}</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 p-2">Maintenance</td>
                                <td className="border border-gray-300 p-2">${cashFlowResult.maintenance}</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 p-2">Property Management Fee</td>
                                <td className="border border-gray-300 p-2">${cashFlowResult.propertyManagementFee}</td>
                            </tr>
                        </tbody>
                    </table>


                    <table className="w-full border-collapse border border-gray-300 text-lg table-fixed mt-6">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 p-2 text-left w-2/3">Cash Flow Before Tax</th>
                                <th className="border border-gray-300 p-2 text-left w-1/3">Interest-Only</th>
                                <th className="border border-gray-300 p-2 text-left w-1/3">Principal + Interest</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-gray-300 p-2">Weekly Cash Flow</td>
                                <td className="border border-gray-300 p-2 text-gray-700">${(cashFlowResult.annualCashFlowInterestOnly / 52).toFixed(2)}</td>
                                <td className="border border-gray-300 p-2 text-gray-700">${(cashFlowResult.annualCashFlowPI / 52).toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 p-2">Monthly Cash Flow</td>
                                <td className="border border-gray-300 p-2 text-gray-700">${cashFlowResult.monthlyCashFlowInterestOnly}</td>
                                <td className="border border-gray-300 p-2 text-gray-700">${cashFlowResult.monthlyCashFlowPI}</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 p-2">Annual Cash Flow</td>
                                <td className="border border-gray-300 p-2 text-gray-700">${cashFlowResult.annualCashFlowInterestOnly}</td>
                                <td className="border border-gray-300 p-2 text-gray-700">${cashFlowResult.annualCashFlowPI}</td>
                            </tr>


                        </tbody>
                    </table>


                    <div className="mt-6 flex justify-between">
                        <p className="text-xl font-semibold text-gray-700"><strong>Gross Yield:</strong> {cashFlowResult.grossYield}%</p>
                        <p className="text-xl font-semibold text-gray-700"><strong>Net Yield:</strong> {cashFlowResult.netYield}%</p>
                    </div>
                </div>
            )



            }



        </div>
    );
};

export default CashFlowCalculator;
