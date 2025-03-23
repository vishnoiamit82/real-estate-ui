// utils/formatCurrency.js
export const formatCurrency = (value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return 'N/A';
    return `$${num.toFixed(2)}`;
  };
  