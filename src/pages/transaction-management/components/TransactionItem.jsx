import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { formatCurrency } from '../../../utils/currency';
import { useAuth } from '../../../contexts/AuthContext';

const TransactionItem = ({ 
  transaction, 
  onEdit, 
  onDelete, 
  onSelect, 
  isSelected = false,
  showCheckbox = false 
}) => {
  const { profile } = useAuth();
  const [showActions, setShowActions] = useState(false);

  const getCategoryIcon = (category) => {
    //console.log('Category received by getCategoryIcon:', category);
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
    return iconMap?.[category] || 'MoreHorizontal';
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'income':
        return 'text-success';
      case 'expense':
        return 'text-error';
      case 'transfer':
        return 'text-primary';
      default:
        return 'text-foreground';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'income':
        return 'Plus';
      case 'expense':
        return 'Minus';
      case 'transfer':
        return 'ArrowLeftRight';
      default:
        return 'MoreHorizontal';
    }
  };

  const formatAmount = (amount, type) => {
    const formattedAmount = formatCurrency(Math.abs(amount), profile?.currency);
    
    if (type === 'expense') {
      return `-${formattedAmount}`;
    }
    if (type === 'income') {
      return `+${formattedAmount}`;
    }
    return formattedAmount;
  };

  const formatDate = (date) => {
    if (!date) return '-'; // Handle null or undefined dates
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Invalid Date'; // Check if date is truly invalid
    return d?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleSwipeStart = (e) => {
    if (window.innerWidth >= 768) return; // Only on mobile
    
    const startX = e?.touches?.[0]?.clientX;
    const element = e?.currentTarget;
    
    const handleSwipeMove = (moveEvent) => {
      const currentX = moveEvent?.touches?.[0]?.clientX;
      const diffX = startX - currentX;
      
      if (diffX > 50) {
        setShowActions(true);
      } else if (diffX < -50) {
        setShowActions(false);
      }
    };
    
    const handleSwipeEnd = () => {
      element?.removeEventListener('touchmove', handleSwipeMove);
      element?.removeEventListener('touchend', handleSwipeEnd);
    };
    
    element?.addEventListener('touchmove', handleSwipeMove);
    element?.addEventListener('touchend', handleSwipeEnd);
  };

  return (
    <div className="relative">
      {/* Main Transaction Item */}
      <div
        className={`group bg-card border border-border rounded-lg p-4 transition-all duration-200 hover:shadow-soft ${
          isSelected ? 'ring-2 ring-primary' : ''
        } ${showActions ? 'transform -translate-x-20' : ''} ${showCheckbox ? '' : 'cursor-pointer'}`}
        onTouchStart={handleSwipeStart}
        onClick={() => {
          if (!showCheckbox) {
            onEdit(transaction);
          }
        }}
      >
        <div className="flex items-center space-x-4">
          {/* Checkbox for bulk selection */}
          {showCheckbox && (
            <div className="flex-shrink-0">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => onSelect(transaction?.id, e?.target?.checked)}
                className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
              />
            </div>
          )}

          {/* Category Icon */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
              <Icon 
                name={transaction?.category?.icon || 'MoreHorizontal'} 
                size={20} 
                className="text-muted-foreground"
              />
            </div>
          </div>

          {/* Transaction Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground truncate">
                  {transaction?.description}
                </h4>
                <div className="flex items-center space-x-2 mt-1">
                  <Icon 
                    name={getTypeIcon(transaction?.transaction_type)} 
                    size={14} 
                    className={getTypeColor(transaction?.transaction_type)}
                  />
                  <span className="text-xs text-muted-foreground capitalize">
                    {transaction?.transaction_type === 'transfer' 
                      ? `${transaction?.from_account?.name} → ${transaction?.to_account?.name}`
                      : transaction?.category?.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    •
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(transaction?.transaction_date)}
                  </span>
                </div>
                {transaction?.transaction_type !== 'transfer' && transaction?.from_account?.name && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {transaction?.from_account?.name}
                  </p>
                )}
              </div>

              {/* Amount */}
              <div className="flex-shrink-0 text-right">
                <p className={`text-sm font-semibold ${getTypeColor(transaction?.transaction_type)}`}>
                  {formatAmount(transaction?.amount, transaction?.transaction_type)}
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(transaction)}
              className="w-8 h-8"
            >
              <Icon name="Edit2" size={14} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(transaction?.id)}
              className="w-8 h-8 text-error hover:text-error"
            >
              <Icon name="Trash2" size={14} />
            </Button>
          </div>
        </div>
      </div>
      {/* Mobile Swipe Actions */}
      <div className={`absolute top-0 right-0 h-full flex items-center space-x-2 pr-4 transition-opacity duration-200 md:hidden ${
        showActions ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            onEdit(transaction);
            setShowActions(false);
          }}
          className="w-10 h-10"
        >
          <Icon name="Edit2" size={16} />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => {
            onDelete(transaction?.id);
            setShowActions(false);
          }}
          className="w-10 h-10"
        >
          <Icon name="Trash2" size={16} />
        </Button>
      </div>
    </div>
  );
};

export default TransactionItem;