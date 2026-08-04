export const formatINR = (amount = 0) => {
  const value = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatNumber = (value = 0) => new Intl.NumberFormat('en-IN').format(Number(value) || 0);
