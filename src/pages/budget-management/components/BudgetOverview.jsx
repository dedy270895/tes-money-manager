import React from 'react';
import Icon from '../../../components/AppIcon';

const BudgetOverview = ({ budgets, profile }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: profile?.currency || 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const totalAllocated = budgets?.reduce((sum, budget) => sum + budget?.amount, 0);
  const totalSpent = budgets?.reduce((sum, budget) => sum + budget?.spent, 0);
  const totalRemaining = totalAllocated - totalSpent;
  const overallPercentage = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;

  const getOverallStatus = () => {
    if (overallPercentage >= 100) return { color: 'text-error', bg: 'bg-error/10', border: 'border-error/20', icon: 'AlertTriangle' };
    if (overallPercentage >= 80) return { color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20', icon: 'AlertCircle' };
    return { color: 'text-success', bg: 'bg-success/10', border: 'border-success/20', icon: 'CheckCircle' };
  };

  const status = getOverallStatus();

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 shadow-soft mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Monthly Budget Overview</h2>
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${status.bg} ${status.border} border`}>
          <Icon name={status.icon} size={16} className={status.color} />
          <span className={`text-sm font-medium ${status.color}`}>
            {overallPercentage?.toFixed(1)}% Used
          </span>
        </div>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
        <div className="text-center md:text-left">
          <p className="text-sm text-muted-foreground mb-1">Total Allocated</p>
          <p className="text-2xl md:text-3xl font-bold text-foreground">
            {formatCurrency(totalAllocated)}
          </p>
        </div>
        <div className="text-center md:text-left">
          <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
          <p className="text-2xl md:text-3xl font-bold text-foreground">
            {formatCurrency(totalSpent)}
          </p>
        </div>
        <div className="text-center md:text-left">
          <p className="text-sm text-muted-foreground mb-1">Remaining</p>
          <p className={`text-2xl md:text-3xl font-bold ${totalRemaining >= 0 ? 'text-success' : 'text-error'}`}>
            {formatCurrency(Math.abs(totalRemaining))}
          </p>
        </div>
      </div>
      {/* Overall Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Overall Progress</span>
          <span>{overallPercentage?.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-4">
          <div
            className={`h-4 rounded-full transition-all duration-500 ${
              overallPercentage >= 100 ? 'bg-error' : overallPercentage >= 80 ? 'bg-warning' : 'bg-success'
            }`}
            style={{ width: `${Math.min(overallPercentage, 100)}%` }}
          />
        </div>
      </div>
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Categories</p>
          <p className="text-lg font-semibold text-foreground">{budgets?.length}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">On Track</p>
          <p className="text-lg font-semibold text-success">
            {budgets?.filter(b => (b?.spent / b?.amount) * 100 < 80)?.length}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Warning</p>
          <p className="text-lg font-semibold text-warning">
            {budgets?.filter(b => {
              const pct = (b?.spent / b?.amount) * 100;
              return pct >= 80 && pct < 100;
            })?.length}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Exceeded</p>
          <p className="text-lg font-semibold text-error">
            {budgets?.filter(b => (b?.spent / b?.amount) * 100 >= 100)?.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BudgetOverview;