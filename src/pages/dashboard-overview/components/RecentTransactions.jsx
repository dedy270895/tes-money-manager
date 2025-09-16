import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import { formatCurrency } from '../../../utils/currency';

const RecentTransactions = ({ transactions }) => {
  const navigate = useNavigate();

  const formatDate = (date) => {
    //console.log('Date received by formatDate:', date);
    if (!date) return '-'; // Handle null or undefined dates
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Invalid Date'; // Check if date is truly invalid
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    })?.format(d);
  };

  const getCategoryIcon = (category) => {
    console.log('Category received by getCategoryIcon:', category);
    const iconMap = {
      'Food & Dining': 'UtensilsCrossed',
      'Transportation': 'Car',
      'Shopping': 'ShoppingBag',
      'Entertainment': 'Film',
      'Bills & Utilities': 'Receipt',
      'Healthcare': 'Heart',
      'Salary': 'Briefcase',
      'Freelance': 'Laptop',
      'Investment': 'TrendingUp',
      'Transfer': 'ArrowLeftRight'
    };
    return iconMap?.[category] || 'DollarSign';
  };

  const getAmountColor = (type) => {
    if (type === 'income') return 'text-success';
    if (type === 'expense') return 'text-error';
    return 'text-foreground';
  };

  const getAmountPrefix = (type) => {
    if (type === 'income') return '+';
    if (type === 'expense') return '-';
    return '';
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-soft border border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Recent Transactions</h2>
        <button 
          className="text-primary hover:text-primary/80 text-sm font-medium"
          onClick={() => navigate('/transaction-management')}
        >
          View All
        </button>
      </div>
      <div className="space-y-4">
        {transactions?.map((transaction) => {
          try {
            return (
              <div key={transaction?.id} className="flex items-center space-x-4">
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                  transaction?.transaction_type === 'income' ? 'bg-success/10' :
                  transaction?.transaction_type === 'expense' ? 'bg-error/10' : 'bg-primary/10'
                }`}>
                  <Icon 
                    name={transaction?.category?.icon || 'DollarSign'} 
                    size={18} 
                    className={
                      transaction?.transaction_type === 'income' ? 'text-success' :
                      transaction?.transaction_type === 'expense' ? 'text-error' : 'text-primary'
                    }
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {transaction?.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {transaction?.category?.name} • {formatDate(transaction?.transaction_date)}
                  </p>
                </div>
                
                <div className={`text-sm font-semibold ${getAmountColor(transaction?.transaction_type)}`}>
                  {getAmountPrefix(transaction?.transaction_type)}{formatCurrency(transaction?.amount)}
                </div>
              </div>
            );
          } catch (e) {
            console.error("Error rendering transaction:", transaction, e);
            return null; // Or render a fallback UI for the problematic transaction
          }
        })}
      </div>
    </div>
  );
};

export default RecentTransactions;