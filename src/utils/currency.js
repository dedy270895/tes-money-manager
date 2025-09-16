export const formatCurrency = (amount, locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
  }).format(amount);
};