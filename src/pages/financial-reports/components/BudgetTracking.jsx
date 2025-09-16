import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

import { formatCurrency } from '../../../utils/currency';
import { getHexColor } from '../../../utils/colors';

const BudgetTracking = ({ selectedPeriod, data }) => {
  const [selectedBudget, setSelectedBudget] = useState(null);

  const totalBudget = data?.reduce((sum, item) => sum + item?.amount, 0);
  const totalSpent = data?.reduce((sum, item) => sum + item?.spent, 0);
  const totalRemaining = totalBudget - totalSpent;

  const getStatusColor = (percentage) => {
    if (percentage >= 100) return 'text-error';
    if (percentage >= 80) return 'text-warning';
    return 'text-success';
  };

  const getStatusBg = (percentage) => {
    if (percentage >= 100) return 'bg-error';
    if (percentage >= 80) return 'bg-warning';
    return 'bg-success';
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-elevated">
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-sm text-primary">Budget: {formatCurrency(data?.amount)}</p>
          <p className="text-sm text-error">Spent: {formatCurrency(data?.spent)}</p>
          <p className="text-sm text-muted-foreground">
            {data?.remaining >= 0 ? 'Remaining' : 'Over'}: {formatCurrency(Math.abs(data?.remaining))}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card p-4 md:p-6 space-y-6">
      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Target" size={16} className="text-primary" />
            <span className="text-sm text-muted-foreground">Total Budget</span>
          </div>
          <p className="text-2xl font-semibold text-foreground">{formatCurrency(totalBudget)}</p>
          <p className="text-sm text-muted-foreground">This month</p>
        </div>
        
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="CreditCard" size={16} className="text-error" />
            <span className="text-sm text-muted-foreground">Total Spent</span>
          </div>
          <p className="text-2xl font-semibold text-foreground">{formatCurrency(totalSpent)}</p>
          <p className="text-sm text-muted-foreground">
            {((totalSpent / totalBudget) * 100)?.toFixed(1)}% of budget
          </p>
        </div>
        
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Wallet" size={16} className={totalRemaining >= 0 ? "text-success" : "text-error"} />
            <span className="text-sm text-muted-foreground">
              {totalRemaining >= 0 ? 'Remaining' : 'Over Budget'}
            </span>
          </div>
          <p className={`text-2xl font-semibold ${totalRemaining >= 0 ? 'text-success' : 'text-error'}`}>
            {formatCurrency(Math.abs(totalRemaining))}
          </p>
          <p className="text-sm text-muted-foreground">
            {totalRemaining >= 0 ? 'Available to spend' : 'Budget exceeded'}
          </p>
        </div>
      </div>
      {/* Budget vs Spending Chart */}
      <div className="bg-muted/30 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-foreground">Budget vs Spending</h4>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full" />
              <span className="text-muted-foreground">Budget</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-error rounded-full" />
              <span className="text-muted-foreground">Spent</span>
            </div>
          </div>
        </div>
        
        <div className="h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="category.name" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={formatCurrency}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" fill="#3B82F6" radius={[2, 2, 0, 0]} />
              <Bar dataKey="spent" fill="#EF4444" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Detailed Budget Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-foreground">Budget Details</h4>
          <button className="text-sm text-primary hover:text-primary/80 transition-colors">
            Adjust Budgets
          </button>
        </div>

        <div className="space-y-3">
          {data?.map((budget, index) => (
            <div key={index} className="bg-muted/30 rounded-lg p-4">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setSelectedBudget(selectedBudget === index ? null : index)}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${getStatusBg(budget?.status)}`} />
                    <span className={`text-xs mt-1 ${getStatusColor(budget?.status)}`}>
                      {budget?.status === 'on-track' ? 'Good' : 
                       budget?.status === 'warning' ? 'Warning' : 'Over'}
                    </span>
                  </div>
                  <div>
                    <h5 className="font-medium text-foreground">{budget?.category?.name}</h5>
                    <p className="text-sm text-muted-foreground">
                      {budget?.transactions} transactions
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-foreground">
                    {formatCurrency(budget?.spent)} / {formatCurrency(budget?.amount)}
                  </p>
                  <p className="text-sm text-muted-foreground">{budget?.percentage}% used</p>
                </div>
                
                <Icon 
                  name={selectedBudget === index ? "ChevronUp" : "ChevronDown"} 
                  size={16} 
                  className="text-muted-foreground ml-2" 
                />
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="w-full bg-muted rounded-full h-3">
                  <div 
                    className="h-3 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(budget?.percentage, 100)}%`,
                      backgroundColor: getHexColor(budget?.category?.color)
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{formatCurrency(0)}</span>
                  <span>{formatCurrency(budget?.amount)}</span>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedBudget === index && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Daily Average</span>
                      <p className="font-medium text-foreground">{formatCurrency(budget?.dailyAverage)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Projected Spend</span>
                      <p className="font-medium text-foreground">{formatCurrency(budget?.projectedSpend)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        {budget?.remaining >= 0 ? 'Remaining' : 'Over Budget'}
                      </span>
                      <p className={`font-medium ${budget?.remaining >= 0 ? 'text-success' : 'text-error'}`}>
                        {formatCurrency(Math.abs(budget?.remaining))}
                      </p>
                    </div>
                  </div>
                  
                  {budget?.status === 'over-budget' && (
                    <div className="mt-3 p-3 bg-error/10 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Icon name="AlertTriangle" size={16} className="text-error" />
                        <span className="text-sm font-medium text-error">Budget Exceeded</span>
                      </div>
                      <p className="text-sm text-error/80 mt-1">
                        Consider reducing spending in this category or adjusting your budget.
                      </p>
                    </div>
                  )}
                  
                  {budget?.status === 'warning' && (
                    <div className="mt-3 p-3 bg-warning/10 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Icon name="AlertCircle" size={16} className="text-warning" />
                        <span className="text-sm font-medium text-warning">Approaching Limit</span>
                      </div>
                      <p className="text-sm text-warning/80 mt-1">
                        You're close to your budget limit. Monitor spending carefully.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BudgetTracking;