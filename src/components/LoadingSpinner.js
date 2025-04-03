import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading...', className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center text-gray-600 py-10 ${className}`}>
      <Loader2 className="animate-spin w-6 h-6 mb-2 text-blue-500" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
