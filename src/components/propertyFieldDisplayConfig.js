// utils/propertyFieldDisplayConfig.js

import {
    Bed, Bath, Car, Ruler, DollarSign, Home, MapPin, Flame, Droplet
  } from 'lucide-react';
  
  export const propertyFieldDisplayConfig = [
    {
      key: 'bedrooms',
      label: 'Beds',
      icon: Bed,
      color: 'text-indigo-600',
      showIn: ['card', 'table'],
      getValue: (p) => p.bedrooms || '–',
    },
    {
      key: 'bathrooms',
      label: 'Baths',
      icon: Bath,
      color: 'text-indigo-600',
      showIn: ['card', 'table'],
      getValue: (p) => p.bathrooms || '–',
    },
    {
      key: 'carSpaces',
      label: 'Car',
      icon: Car,
      color: 'text-gray-600',
      showIn: ['card', 'table'],
      getValue: (p) => p.carSpaces || '–',
    },
    {
      key: 'landSize',
      label: 'Land',
      icon: Ruler,
      showIn: ['card', 'table'],
      getValue: (p) => p.landSize ? `${p.landSize} m²` : '–',
    },
    {
      key: 'askingPrice',
      label: 'Price',
      icon: DollarSign,
      color: 'text-green-600',
      showIn: ['card', 'table'],
      getValue: (p) => p.askingPrice || '–',
    },
    {
      key: 'rentalYield',
      label: 'Yield',
      icon: Home,
      showIn: ['card', 'table'],
      getValue: (p) =>
        p.rental && p.rentalYield
          ? `${p.rental} | ${p.rentalYield}`
          : p.rentalYield || '–',
    }
  ];
  