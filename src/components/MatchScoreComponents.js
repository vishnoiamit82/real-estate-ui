// ✅ MatchScoreComponents.js - Reusable Components for Match Score Display

import React from 'react';
import { formatCurrency } from '../utils/formatCurrency';
import { CheckCircle } from 'lucide-react';

// Match Score Progress Bar
const MatchScoreBar = ({ score }) => {
  return (
    <div className="text-sm font-bold w-full sm:w-40">
      <div className="bg-gray-200 w-full h-5 rounded-full overflow-hidden">
        <div
          className={`h-full text-center text-xs text-white whitespace-nowrap px-1 rounded-full ${score >= 90 ? 'bg-green-600' : score >= 75 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
          style={{ width: `${score}%` }}
        >
          {score}%
        </div>
      </div>
    </div>
  );
};

// Matched Tags with earned points and color indicators
const MatchedTags = ({ matchedTags, scoreDetails }) => {
    const tagEmojiMap = {
      '✅ Budget Match': '✅',
      '📍 Location Match': '📍',
      '🛏 Bedrooms Match': '🛏',
      '🛁 Bathrooms Match': '🛁',
      '💸 Yield Match': '💸',
      '🏗 Build Year Match': '🏗',
      '🏘 Subdivision Match': '🏘',
      '💵 Holding Cost Match': '💵',
    };
  
    const tagPointsMap = {};
  
    matchedTags.forEach((tag) => {
      const emoji = tagEmojiMap[tag];
      const match = scoreDetails.find((item) => item.reason.startsWith(emoji));
      tagPointsMap[tag] = match ? match.points : 0;
    });
  
    return (
      <div className="flex flex-wrap gap-2 text-sm text-gray-700 mb-3">
        {matchedTags.map((tag, idx) => {
          const tagPoints = tagPointsMap[tag] || 0;
          const tagColor =
            tagPoints >= 9
              ? 'bg-green-100 text-green-800'
              : tagPoints >= 5
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-700';
  
          return (
            <span
              key={idx}
              className={`${tagColor} px-2 py-1 rounded-full text-xs flex items-center gap-1`}
            >
              <CheckCircle size={12} /> {tag} ({tagPoints} pts)
            </span>
          );
        })}
      </div>
    );
  };
  
// Monthly Holding Cost Breakdown
const HoldingCostSummary = ({ holdingCostBreakdown, estimatedHoldingCost, netMonthlyHoldingCost }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
    <h4 className="font-semibold text-base text-gray-800 mb-3">💰 Monthly Holding Cost Summary</h4>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
      <div className="flex justify-between border-b pb-1">
        <span>Loan Amount</span>
        <span>{formatCurrency(holdingCostBreakdown?.loanAmount)}</span>
      </div>
      <div className="flex justify-between border-b pb-1">
        <span>Interest Cost</span>
        <span>{formatCurrency(holdingCostBreakdown?.monthlyInterest)}</span>
      </div>
      <div className="flex justify-between border-b pb-1">
        <span>Council Rates</span>
        <span>{formatCurrency(holdingCostBreakdown?.monthlyCouncil)}</span>
      </div>
      <div className="flex justify-between border-b pb-1">
        <span>Insurance</span>
        <span>{formatCurrency(holdingCostBreakdown?.monthlyInsurance)}</span>
      </div>
      <div className="flex justify-between border-b pb-1">
        <span>Property Mgmt (7%)</span>
        <span>{formatCurrency(holdingCostBreakdown?.propertyMgmtCost)}</span>
      </div>
      <div className="flex justify-between border-b pb-1">
        <span>Land Tax</span>
        <span>{formatCurrency(holdingCostBreakdown?.monthlyLandTax)}</span>
      </div>
      <div className="flex justify-between text-sm font-semibold text-gray-900 border-t pt-2 col-span-1 sm:col-span-2">
        <span>Total Monthly Expenses</span>
        <span>{formatCurrency(estimatedHoldingCost)}</span>
      </div>
      <div className="flex justify-between text-sm font-semibold text-green-700 border-t pt-2 col-span-1 sm:col-span-2">
        <span>Rental Income</span>
        <span>{formatCurrency(holdingCostBreakdown?.monthlyRentalIncome)}</span>
      </div>
      <div
        className={`flex justify-between text-sm font-bold pt-2 border-t col-span-1 sm:col-span-2 ${
          parseFloat(holdingCostBreakdown?.netMonthlyHoldingCost || 0) >= 0
            ? 'text-red-600'
            : 'text-green-700'
        }`}
      >
        <span>Net Monthly Holding Cost</span>
        <span>{formatCurrency(netMonthlyHoldingCost)}</span>
      </div>
    </div>
  </div>
);

// ✅ Export all as named components
export { MatchScoreBar, MatchedTags, HoldingCostSummary };
