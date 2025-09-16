import React from 'react';
import Icon from '../../../components/AppIcon';

const ReportTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'categories', label: 'Categories', icon: 'PieChart' },
    { id: 'trends', label: 'Trends', icon: 'TrendingUp' },
    { id: 'budgets', label: 'Budgets', icon: 'Target' }
  ];

  return (
    <div className="bg-card border-b border-border">
      <div className="px-4 md:px-6">
        <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => onTabChange(tab?.id)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200 border-b-2 ${
                activeTab === tab?.id
                  ? 'text-primary border-primary bg-primary/5' :'text-muted-foreground border-transparent hover:text-foreground hover:border-muted'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportTabs;