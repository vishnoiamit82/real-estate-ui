// components/UnreadEmailBadge.js
import React, { useEffect, useState } from 'react';


// components/UnreadEmailBadge.js
const UnreadEmailBadge = ({ count }) => {
    if (!count) return null;
  
    return (
      <span className="ml-2 inline-block bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
        {count}
      </span>
    );
  };
  
  

export default UnreadEmailBadge;
