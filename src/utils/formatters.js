// src/utils/formatters.js
// Format tiền tệ: 10000 -> $10,000
export const formatCurrency = (value) => {
  if (value === undefined || value === null) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0, 
  }).format(value);
};

// Format số lượng: 1234.56 -> 1,235
export const formatNumber = (value) => {
  if (value === undefined || value === null) return '0';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(value);
};

// Format số thập phân nhỏ (cho KPI): 1.5
export const formatDecimal = (value) => {
  if (value === undefined || value === null) return '0';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(value);
};

// Format phần trăm: 19.85 -> 20% 
export const formatPercent = (value) => {
  if (value === undefined || value === null || isNaN(value)) return '0';
  return `${Math.ceil(parseFloat(value))}`;
};

// Làm tròn số thành số nguyên (cho số ticket, số khách)
export const roundNumber = (value) => {
  if (value === undefined || value === null || isNaN(value)) return 0;
  return Math.round(value);
};

// Làm tròn số với số chữ số thập phân (cho hiển thị)
export const fixedNumber = (value, digits = 2) => {
  if (value === undefined || value === null || isNaN(value)) return 0;
  return parseFloat(value.toFixed(digits));
};
