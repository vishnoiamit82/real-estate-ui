// components/PropertyFilterBar.js
import React from 'react';
import MobileFilterBar from './MobileFilterBar';
import DesktopFilterBar from './DesktopFilterBar';

const PropertyFilterBar = (props) => {
    return (
      <>
        {/* Mobile version: shown on < md screens */}
        <div className="block md:hidden">
          <MobileFilterBar {...props} />
        </div>
  
        {/* Desktop version: shown on ≥ md screens */}
        <div className="hidden md:block">
          <DesktopFilterBar {...props} />
        </div>
      </>
    );
  };

export default PropertyFilterBar;
