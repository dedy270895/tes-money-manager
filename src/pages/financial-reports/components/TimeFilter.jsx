import React from 'react';
import Icon from '../../../components/AppIcon';

const TimeFilter = ({ selectedPeriod, onPeriodChange }) => {
  const periods = [
    { id: 'week', label: 'This Week', icon: 'Calendar' },
    { id: 'month', label: 'This Month', icon: 'Calendar' },
    { id: 'quarter', label: 'This Quarter', icon: 'Calendar' },
    { id: 'year', label: 'This Year', icon: 'Calendar' }
  ];

  return (
    <div className="bg-card p-4 md:p-6 border-b border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Time Period</h3>
        <button className="flex items-center space-x-2 text-sm text-primary hover:text-primary/80 transition-colors">
          <Icon name="Calendar" size={16} />
          <span>Custom Range</span>
        </button>
      </div>
      {/* Mobile: Horizontal scrolling chips */}
      <div className="md:hidden">
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2">
          {periods?.map((period) => (
            <button
              key={period?.id}
              onClick={() => onPeriodChange(period?.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                selectedPeriod === period?.id
                  ? 'bg-primary text-primary-foreground shadow-soft'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <Icon name={period?.icon} size={14} />
              <span>{period?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Desktop: Grid layout */}
      <div className="hidden md:grid grid-cols-4 gap-3">
        {periods?.map((period) => (
          <button
            key={period?.id}
            onClick={() => onPeriodChange(period?.id)}
            className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedPeriod === period?.id
                ? 'bg-primary text-primary-foreground shadow-soft'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <Icon name={period?.icon} size={16} />
            <span>{period?.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeFilter;