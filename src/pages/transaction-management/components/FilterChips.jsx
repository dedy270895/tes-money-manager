import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FilterChips = ({ activeFilter, onFilterChange, transactionCounts }) => {
  const filterOptions = [
    {
      key: 'all',
      label: 'All',
      icon: 'List',
      count: transactionCounts?.all || 0
    },
    {
      key: 'expense',
      label: 'Expenses',
      icon: 'Minus',
      count: transactionCounts?.expense || 0,
      color: 'text-error'
    },
    {
      key: 'income',
      label: 'Income',
      icon: 'Plus',
      count: transactionCounts?.income || 0,
      color: 'text-success'
    },
    {
      key: 'transfer',
      label: 'Transfers',
      icon: 'ArrowLeftRight',
      count: transactionCounts?.transfer || 0,
      color: 'text-primary'
    }
  ];

  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-2">
      {filterOptions?.map((option) => {
        const isActive = activeFilter === option?.key;
        
        return (
          <Button
            key={option?.key}
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilterChange(option?.key)}
            className={`flex-shrink-0 ${
              isActive 
                ? 'bg-primary text-primary-foreground' 
                : `hover:bg-muted ${option?.color || 'text-muted-foreground'}`
            }`}
          >
            <Icon 
              name={option?.icon} 
              size={14} 
              className="mr-2"
            />
            <span className="whitespace-nowrap">
              {option?.label}
            </span>
            {option?.count > 0 && (
              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                isActive 
                  ? 'bg-primary-foreground/20 text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {option?.count}
              </span>
            )}
          </Button>
        );
      })}
    </div>
  );
};

export default FilterChips;