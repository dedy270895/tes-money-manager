import React from 'react';
import Icon from '../../../components/AppIcon';
import { useAuth } from '../../../contexts/AuthContext';
const AccountBalanceCard = ({ balance, trend, trendPercentage }) => {
  const { profile } = useAuth();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: profile?.currency || 'USD',
      minimumFractionDigits: 2
    })?.format(amount);
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-success';
    if (trend === 'down') return 'text-error';
    return 'text-muted-foreground';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return 'TrendingUp';
    if (trend === 'down') return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-soft border border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Total Balance</h2>
        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
          <Icon name="Wallet" size={20} className="text-primary" />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="text-3xl font-bold text-foreground">
          {formatCurrency(balance)}
        </div>
        
        <div className={`flex items-center space-x-1 text-sm ${getTrendColor()}`}>
          <Icon name={getTrendIcon()} size={16} />
          <span>{trendPercentage}% from last month</span>
        </div>
      </div>
    </div>
  );
};

export default AccountBalanceCard;