// ✅ Refactored ClientBriefMatches.js using reusable Match Score Components
import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import { useParams } from 'react-router-dom';
import { formatCurrency } from '../utils/formatCurrency';
import { Info, AlertTriangle } from 'lucide-react';
import { MatchScoreBar, MatchedTags, HoldingCostSummary } from './MatchScoreComponents';

const ClientBriefMatches = () => {
  const { briefId } = useParams();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedMatchIds, setExpandedMatchIds] = useState([]);
  const [showCostIds, setShowCostIds] = useState([]);

  useEffect(() => {
    if (!briefId) return setLoading(false);
    const fetchMatches = async () => {
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/client-briefs/${briefId}/matches`);
        setMatches(response.data);
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [briefId]);

  const toggleExpand = (id) => {
    setExpandedMatchIds((prev) =>
      prev.includes(id) ? prev.filter(matchId => matchId !== id) : [...prev, id]
    );
  };

  const toggleCostDetails = (id) => {
    setShowCostIds((prev) =>
      prev.includes(id) ? prev.filter(matchId => matchId !== id) : [...prev, id]
    );
  };

  if (!briefId) return <p className="text-center text-red-500">No Client Brief ID provided.</p>;
  if (loading) return <p>Loading matches...</p>;

  matches.sort((a, b) => b.score - a.score);
  
  const groupedMatches = {
    '✅ Perfect Match': [],
    '👍 Good Match': [],
    '⚠ Moderate Match': [],
    '❌ Low Match': []
  };
  matches.forEach(match => {
    if (groupedMatches[match.matchTier]) {
      groupedMatches[match.matchTier].push(match);
    }
  });

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Matched Properties</h2>
      {matches.length === 0 ? (
        <p>No matches found for this client brief.</p>
      ) : (
        <div className="space-y-10">
          {Object.entries(groupedMatches).map(([tier, tierMatches]) => (
            tierMatches.length > 0 && (
              <div key={tier}>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{tier} ({tierMatches.length})</h3>
                <div className="space-y-6">
                  {tierMatches.map(({ property, score, scoreDetails, maxScore, rawScore, matchTier, matchedTags, unmatchedCriteria, estimatedHoldingCost, netMonthlyHoldingCost, holdingCostBreakdown, warnings, calculationInputs }) => (
                    <div key={property._id} className="border rounded-xl shadow-md p-5 bg-white">
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-blue-700">
                            <a href={`/properties/${property._id}`} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">
                              {property.address || 'N/A'}
                            </a>
                          </h3>
                          <p className="text-sm text-gray-500">Match Tier: <span className="font-semibold">{matchTier}</span></p>
                        </div>
                        <MatchScoreBar score={score} />
                      </div>

                      <div className="text-sm text-gray-700 mb-2">Match Score: <strong>{score}%</strong> {rawScore && maxScore && <span className="text-xs text-gray-500 ml-2">(Raw: {rawScore} / {maxScore})</span>}</div>
                      <div className="flex justify-between text-sm mb-2">
                        <div><strong>Net Monthly Holding Cost:</strong> {formatCurrency(netMonthlyHoldingCost)}</div>
                      </div>

                      <MatchedTags matchedTags={matchedTags} scoreDetails={scoreDetails} />

                      <button onClick={() => toggleExpand(property._id)} className="text-sm text-blue-600 hover:underline mb-2">
                        {expandedMatchIds.includes(property._id) ? 'Hide Match Score Details' : 'Show Match Score Details'}
                      </button>

                      <button onClick={() => toggleCostDetails(property._id)} className="text-sm text-blue-600 hover:underline ml-4">
                        {showCostIds.includes(property._id) ? 'Hide Holding Cost Details' : 'Show Holding Cost Details'}
                      </button>

                      {expandedMatchIds.includes(property._id) && (
                        <div className="mt-3">
                          <div className="bg-gray-50 border rounded-md p-3 mb-3">
                            <h4 className="font-semibold text-sm mb-1 flex items-center gap-1"><Info size={14} /> Score Breakdown</h4>
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="text-gray-500 border-b">
                                  <th className="text-left p-2">Criteria</th>
                                  <th className="text-right p-2">Points</th>
                                </tr>
                              </thead>
                              <tbody>
                                {scoreDetails.map((item, i) => (
                                  <tr key={i} className="border-b">
                                    <td className="p-2">{item.reason.replace(/ \(\+.*\)/, '')}</td>
                                    <td className="p-2 text-right">{item.points}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {showCostIds.includes(property._id) && (
                        <div className="mt-3">
                          <div className="mb-4 bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-700">
                            <h5 className="font-semibold text-gray-800 mb-2">📌 Holding Cost Calculation Inputs</h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div className="flex justify-between"><span>Purchase Price</span><span>{formatCurrency(calculationInputs?.purchasePriceUsed)}</span></div>
                              <div className="flex justify-between"><span>Interest Rate Used</span><span>{calculationInputs?.interestRateUsed}%</span></div>
                              <div className="flex justify-between"><span>LVR Used</span><span>{calculationInputs?.lvrUsed}%</span></div>
                            </div>
                          </div>
                          <HoldingCostSummary
                            holdingCostBreakdown={holdingCostBreakdown}
                            estimatedHoldingCost={estimatedHoldingCost}
                            netMonthlyHoldingCost={netMonthlyHoldingCost}
                          />
                        </div>
                      )}

                      {warnings?.length > 0 && (
                        <div className="mt-3 bg-yellow-100 border border-yellow-300 p-3 rounded text-sm text-yellow-900">
                          <strong className="flex items-center gap-1"><AlertTriangle size={14} /> Important Notes:</strong>
                          <ul className="list-disc ml-5 mt-1 space-y-1">
                            {warnings.map((warning, idx) => (
                              <li key={idx}>{warning}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientBriefMatches;
