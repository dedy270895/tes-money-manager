import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { budgetService } from '../../../services/budgetService';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BudgetHistory = ({ profile }) => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('3months');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: profile?.currency || 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const periods = [
    { value: '1month', label: '1 Month' },
    { value: '3months', label: '3 Months' },
    { value: '6months', label: '6 Months' },
    { value: '1year', label: '1 Year' }
  ];

  useEffect(() => {
    const fetchHistory = async () => {
      if (user?.id) {
        setIsLoading(true);
        setError(null);
        try {
          const { data, error } = await budgetService.getArchivedBudgets(user.id);
          if (error) throw error;
          setHistory(data || []);
        } catch (err) {
          console.error("Error fetching budget history:", err);
          setError("Failed to load budget history.");
        }
        finally {
          setIsLoading(false);
        }
      }
    };
    fetchHistory();
  }, [user]);

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return 'TrendingUp';
      case 'down': return 'TrendingDown';
      default: return 'Minus';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up': return 'text-error';
      case 'down': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getPerformanceStatus = (allocated, spent) => {
    const percentage = (spent / allocated) * 100;
    if (percentage <= 80) return { status: 'Good', color: 'text-success', bg: 'bg-success/10' };
    if (percentage <= 100) return { status: 'Warning', color: 'text-warning', bg: 'bg-warning/10' };
    return { status: 'Over', color: 'text-error', bg: 'bg-error/10' };
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 shadow-soft">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
        <h2 className="text-xl font-semibold text-foreground">Budget Performance History</h2>
        <div className="flex items-center space-x-2">
          {periods?.map((period) => (
            <Button
              key={period?.value}
              variant={selectedPeriod === period?.value ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedPeriod(period?.value)}
            >
              {period?.label}
            </Button>
          ))}
        </div>
      </div>
      {/* Historical Data */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-12">
            <Icon name="Loader" className="animate-spin mx-auto text-primary" size={40} />
            <p className="mt-4 text-muted-foreground">Loading history...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-destructive/10 border border-destructive/20 rounded-lg">
            <Icon name="AlertTriangle" size={40} className="text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-destructive mb-2">Error</h3>
            <p className="text-destructive/80">{error}</p>
          </div>
        ) : history.length > 0 ? (
          history.map((budget, index) => {
            const overallPerformance = getPerformanceStatus(budget.amount, budget.spent);
            const savingsAmount = budget.amount - budget.spent;
            
            return (
              <div key={index} className="border border-border rounded-lg p-4">
                {/* Month Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">{budget.name}</h3>
                  <div className={`px-3 py-1 rounded-full ${overallPerformance?.bg}`}>
                    <span className={`text-sm font-medium ${overallPerformance?.color}`}>
                      {overallPerformance?.status}
                    </span>
                  </div>
                </div>
                {/* Month Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-muted/50 rounded-lg">
                  <div className="text-center md:text-left">
                    <p className="text-sm text-muted-foreground">Allocated</p>
                    <p className="text-lg font-semibold text-foreground">
                      {formatCurrency(budget.amount)}
                    </p>
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-sm text-muted-foreground">Spent</p>
                    <p className="text-lg font-semibold text-foreground">
                      {formatCurrency(budget.spent)}
                    </p>
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-sm text-muted-foreground">
                      {savingsAmount >= 0 ? 'Saved' : 'Over Budget'}
                    </p>
                    <p className={`text-lg font-semibold ${savingsAmount >= 0 ? 'text-success' : 'text-error'}`}>
                      {formatCurrency(Math.abs(savingsAmount))}
                    </p>
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-sm text-muted-foreground">Usage</p>
                    <p className="text-lg font-semibold text-foreground">
                      {((budget.spent / budget.amount) * 100)?.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <Icon name="History" size={40} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground">No Budget History</h3>
            <p className="text-muted-foreground">Archived or inactive budgets will appear here.</p>
          </div>
        )}
      </div>
      {/* Summary Insights */}
      <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Lightbulb" size={20} className="text-primary mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground mb-2">Insights & Recommendations</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Your shopping budget has been consistently exceeded. Consider increasing allocation or reducing spending.</li>
              <li>• Great job staying under budget for Food & Dining in the last two months!</li>
              <li>• Healthcare budget is underutilized. Consider reallocating funds to other categories.</li>
              <li>• Overall budget performance has improved by 15% compared to last quarter.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetHistory;