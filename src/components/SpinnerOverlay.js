import React from 'react';

const SpinnerOverlay = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="p-6 bg-white rounded-2xl shadow-lg text-xl font-bold animate-pulse">
        ⏳ Loading...
      </div>
    </div>
  );
};

export default SpinnerOverlay;