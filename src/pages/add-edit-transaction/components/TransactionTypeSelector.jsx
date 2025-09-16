import React from 'react';
import Icon from '../../../components/AppIcon';

const TransactionTypeSelector = ({ selectedType, onTypeChange }) => {
  const transactionTypes = [
    {
      type: 'expense',
      label: 'Expense',
      icon: 'Minus',
      color: 'text-error',
      bgColor: 'bg-error/10',
      borderColor: 'border-error'
    },
    {
      type: 'income',
      label: 'Income',
      icon: 'Plus',
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success'
    },
    {
      type: 'transfer',
      label: 'Transfer',
      icon: 'ArrowLeftRight',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary'
    }
  ];

  return (
    <div className="grid grid-cols-3 gap-2 p-1 bg-muted rounded-lg">
      {transactionTypes?.map((type) => (
        <button
          key={type?.type}
          onClick={() => onTypeChange(type?.type)}
          className={`flex flex-col items-center justify-center p-3 rounded-md transition-all duration-200 ${
            selectedType === type?.type
              ? `${type?.bgColor} ${type?.borderColor} border-2 ${type?.color}`
              : 'text-muted-foreground hover:text-foreground hover:bg-background'
          }`}
        >
          <Icon name={type?.icon} size={20} className="mb-1" />
          <span className="text-sm font-medium">{type?.label}</span>
        </button>
      ))}
    </div>
  );
};

export default TransactionTypeSelector;