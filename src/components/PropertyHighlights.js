import React from 'react';
import {
    Bed,
    Bath,
    Car,
    Ruler,
    DollarSign,
    Home,
    MapPin
} from 'lucide-react';

import { propertyFieldDisplayConfig } from './propertyFieldDisplayConfig';


const PropertyHighlights = ({ property }) => {
    const DisplayValue = ({ value }) => <>{value || '–'}</>;

    const Highlight = ({ icon: Icon, value, color = 'text-gray-600' }) => (
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
            <Icon size={16} className={color} />
            <DisplayValue value={value} />
        </div>
    );

    return (
        <>
            {/* Google Maps Link */}
            {property.mapsLink && (
                <div className="flex items-center gap-2 text-sm mb-2">
                    <MapPin size={16} className="text-blue-600" />
                    <a
                        href={property.mapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline hover:text-blue-800"
                    >
                        View on Google Maps
                    </a>
                </div>
            )}

            {/* Highlights */}
            <div className="min-h-[100px] flex flex-wrap items-center gap-3 text-sm text-gray-800 dark:text-gray-100">
                {propertyFieldDisplayConfig
                    .filter(field => field.showIn.includes('card'))
                    .map((field, idx) => {
                        const Icon = field.icon;
                        return (
                            <Highlight
                                key={idx}
                                icon={Icon}
                                value={field.getValue(property)}
                                color={field.color || 'text-gray-600'}
                            />
                        );
                    })}
            </div>

            {/* Optional Tag for Subdivision
            {property.subdivisionPotential && (
                <div className="mt-2 inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs">
                    🏠 Subdividable
                </div>
            )} */}
        </>
    );
};

export default PropertyHighlights;
