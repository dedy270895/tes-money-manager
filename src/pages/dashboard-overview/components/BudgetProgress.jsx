import React from 'react';
import Icon from '../../../components/AppIcon';
import { formatCurrency } from '../../../utils/currency';

const BudgetProgress = ({ budgets }) => {
  const getProgressPercentage = (spent, budget) => {
    return Math.min((spent / budget) * 100, 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return 'bg-error';
    if (percentage >= 75) return 'bg-warning';
    return 'bg-success';
  };

  const getCategoryIcon = (category) => {
    return category?.icon || 'DollarSign';
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-soft border border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Budget Progress</h2>
        <button className="text-primary hover:text-primary/80 text-sm font-medium">
          Manage
        </button>
      </div>
      <div className="space-y-4">
        {budgets?.map((budget) => {
          const spent = Number(budget?.spent) || 0;
          const budgetAmount = Number(budget?.budget) || 0;
          const percentage = getProgressPercentage(spent, budgetAmount);
          const remaining = budgetAmount - spent;
          
          return (
            <div key={budget?.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-muted rounded-lg">
                    <Icon 
                      name={getCategoryIcon(budget?.category)} 
                      size={16} 
                      className="text-muted-foreground"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {budget?.category?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(budget?.spent)} of {formatCurrency(budget?.budget)}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">
                    {remaining >= 0 ? formatCurrency(remaining) : formatCurrency(Math.abs(remaining))}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {remaining >= 0 ? 'remaining' : 'over budget'}
                  </p>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(percentage)}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetProgress;