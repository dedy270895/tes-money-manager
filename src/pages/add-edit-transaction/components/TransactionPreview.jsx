import React from 'react';
import Icon from '../../../components/AppIcon';

const TransactionPreview = ({ 
  transactionType, 
  amount, 
  category, 
  fromAccount, 
  toAccount, 
  description,
  date,
  time 
}) => {
  const formatAmount = (amount) => {
    const numAmount = parseFloat(amount) || 0;
    return numAmount?.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  const getAmountColor = () => {
    switch (transactionType) {
      case 'expense':
        return 'text-error';
      case 'income':
        return 'text-success';
      case 'transfer':
        return 'text-primary';
      default:
        return 'text-foreground';
    }
  };

  const getTransactionIcon = () => {
    switch (transactionType) {
      case 'expense':
        return 'Minus';
      case 'income':
        return 'Plus';
      case 'transfer':
        return 'ArrowLeftRight';
      default:
        return 'DollarSign';
    }
  };

  const formatDateTime = () => {
    if (!date) return 'No date selected';
    
    const dateObj = new Date(date);
    const dateStr = dateObj?.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    if (time) {
      const [hours, minutes] = time?.split(':');
      const timeObj = new Date();
      timeObj?.setHours(parseInt(hours), parseInt(minutes));
      const timeStr = timeObj?.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      return `${dateStr} at ${timeStr}`;
    }
    
    return dateStr;
  };

  const calculateAccountBalanceChange = (account, isSource = false) => {
    if (!account || !amount) return account?.balance || 0;
    
    const transactionAmount = parseFloat(amount) || 0;
    let change = 0;
    
    if (transactionType === 'expense') {
      change = -transactionAmount;
    } else if (transactionType === 'income') {
      change = transactionAmount;
    } else if (transactionType === 'transfer') {
      change = isSource ? -transactionAmount : transactionAmount;
    }
    
    return (account?.balance || 0) + change;
  };

  const formatBalance = (balance) => {
    const absBalance = Math.abs(balance);
    const sign = balance < 0 ? '-' : '';
    return `${sign}$${absBalance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (!amount && !category && !fromAccount && !toAccount) {
    return (
      <div className="hidden lg:block lg:w-80 xl:w-96">
        <div className="sticky top-6 bg-card border border-border rounded-lg p-6">
          <div className="text-center text-muted-foreground">
            <Icon name="Receipt" size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-sm">Fill in the transaction details to see a preview</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden lg:block lg:w-80 xl:w-96">
      <div className="sticky top-6 space-y-4">
        {/* Transaction Preview Card */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Icon name="Eye" size={20} className="mr-2" />
            Transaction Preview
          </h3>
          
          <div className="space-y-4">
            {/* Transaction Type & Amount */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transactionType === 'expense' ? 'bg-error/10' :
                  transactionType === 'income' ? 'bg-success/10' : 'bg-primary/10'
                }`}>
                  <Icon 
                    name={getTransactionIcon()} 
                    size={20} 
                    className={getAmountColor()} 
                  />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground capitalize">
                    {transactionType || 'Transaction'}
                  </p>
                  <p className={`text-xl font-bold ${getAmountColor()}`}>
                    ${formatAmount(amount)}
                  </p>
                </div>
              </div>
            </div>

            {/* Category */}
            {category && (
              <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                <Icon name={category?.icon} size={20} className={category?.color} />
                <div>
                  <p className="text-sm font-medium text-foreground">{category?.name}</p>
                  <p className="text-xs text-muted-foreground">Category</p>
                </div>
              </div>
            )}

            {/* Accounts */}
            {transactionType === 'transfer' ? (
              <div className="space-y-3">
                {fromAccount && (
                  <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <Icon name={fromAccount?.icon} size={20} className={fromAccount?.color} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{fromAccount?.name}</p>
                      <p className="text-xs text-muted-foreground">From account</p>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-center">
                  <Icon name="ArrowDown" size={20} className="text-muted-foreground" />
                </div>
                
                {toAccount && (
                  <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <Icon name={toAccount?.icon} size={20} className={toAccount?.color} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{toAccount?.name}</p>
                      <p className="text-xs text-muted-foreground">To account</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              (fromAccount || toAccount) && (
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <Icon 
                    name={(fromAccount || toAccount)?.icon} 
                    size={20} 
                    className={(fromAccount || toAccount)?.color} 
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {(fromAccount || toAccount)?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">Account</p>
                  </div>
                </div>
              )
            )}

            {/* Description */}
            {description && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-foreground">{description}</p>
                <p className="text-xs text-muted-foreground mt-1">Description</p>
              </div>
            )}

            {/* Date & Time */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-foreground">{formatDateTime()}</p>
              <p className="text-xs text-muted-foreground">Date & Time</p>
            </div>
          </div>
        </div>

        {/* Account Balance Impact */}
        {(fromAccount || toAccount) && amount && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Icon name="TrendingUp" size={20} className="mr-2" />
              Balance Impact
            </h3>
            
            <div className="space-y-3">
              {transactionType === 'transfer' ? (
                <>
                  {fromAccount && (
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon name={fromAccount?.icon} size={16} className={fromAccount?.color} />
                        <span className="text-sm font-medium text-foreground">
                          {fromAccount?.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          {formatBalance(fromAccount?.balance)} → 
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {formatBalance(calculateAccountBalanceChange(fromAccount, true))}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {toAccount && (
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon name={toAccount?.icon} size={16} className={toAccount?.color} />
                        <span className="text-sm font-medium text-foreground">
                          {toAccount?.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          {formatBalance(toAccount?.balance)} → 
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {formatBalance(calculateAccountBalanceChange(toAccount, false))}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                (fromAccount || toAccount) && (
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Icon 
                        name={(fromAccount || toAccount)?.icon} 
                        size={16} 
                        className={(fromAccount || toAccount)?.color} 
                      />
                      <span className="text-sm font-medium text-foreground">
                        {(fromAccount || toAccount)?.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {formatBalance((fromAccount || toAccount)?.balance)} → 
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {formatBalance(calculateAccountBalanceChange(fromAccount || toAccount))}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionPreview;