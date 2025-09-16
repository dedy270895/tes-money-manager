import React from 'react';


const AmountInput = ({ amount, onAmountChange, transactionType, error }) => {
  const getAmountColor = () => {
    switch (transactionType) {
      case 'expense':
        return 'text-error';
      case 'income':
        return 'text-success';
      case 'transfer':
        return 'text-primary';
      default:
        return 'text-foreground';
    }
  };

  const formatAmount = (value) => {
    // Remove non-numeric characters except decimal point
    const numericValue = value?.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = numericValue?.split('.');
    if (parts?.length > 2) {
      return parts?.[0] + '.' + parts?.slice(1)?.join('');
    }
    
    // Limit decimal places to 2
    if (parts?.[1] && parts?.[1]?.length > 2) {
      return parts?.[0] + '.' + parts?.[1]?.substring(0, 2);
    }
    
    return numericValue;
  };

  const handleAmountChange = (e) => {
    const formattedValue = formatAmount(e?.target?.value);
    onAmountChange(formattedValue);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        Amount *
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
          $
        </div>
        <input
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={handleAmountChange}
          placeholder="0.00"
          className={`w-full pl-8 pr-4 py-3 text-2xl font-semibold bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${getAmountColor()} ${
            error ? 'border-error focus:ring-error' : ''
          }`}
        />
      </div>
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default AmountInput;