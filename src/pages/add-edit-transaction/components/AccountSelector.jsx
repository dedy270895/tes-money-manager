import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { accountService } from '../../../services/accountService';
import { useAuth } from '../../../contexts/AuthContext';

const AccountSelector = ({ selectedAccount, onAccountChange, label, error }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      if (!user) return;
      setIsLoading(true);
      setFetchError(null);
      try {
        const { data, error } = await accountService.getAccounts(user.id);
        if (error) {
          throw error;
        }
        setAccounts(data);
      } catch (err) {
        console.error('Failed to fetch accounts:', err);
        setFetchError('Failed to load accounts.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccounts();
  }, [user]);

  const handleAccountSelect = (account) => {
    onAccountChange(account);
    setIsOpen(false);
  };

  const formatBalance = (balance) => {
    const absBalance = Math.abs(balance);
    const sign = balance < 0 ? '-' : '';
    return `${sign}$${absBalance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="space-y-2 relative">
      <label className="text-sm font-medium text-foreground">
        {label} *
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-3 bg-input border border-border rounded-lg hover:bg-muted transition-colors ${
          error ? 'border-error' : ''
        }`}
      >
        {selectedAccount ? (
          <div className="flex items-center space-x-3">
            <Icon name={selectedAccount?.icon} size={20} className={selectedAccount?.color} />
            <div className="text-left">
              <div className="text-foreground font-medium">{selectedAccount?.name}</div>
              <div className="text-sm text-muted-foreground">
                {formatBalance(selectedAccount?.balance)}
              </div>
            </div>
          </div>
        ) : (
          <span className="text-muted-foreground">Select an account</span>
        )}
        <Icon 
          name="ChevronDown" 
          size={20} 
          className={`text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-elevated z-50 max-h-60 overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-4">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-muted-foreground text-sm mt-2">Loading accounts...</p>
              </div>
            ) : fetchError ? (
              <div className="text-center py-4 text-error text-sm">
                {fetchError}
              </div>
            ) : accounts?.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground text-sm">
                No accounts found. Please add one.
              </div>
            ) : (
              accounts?.map((account) => (
                <button
                  key={account?.id}
                  onClick={() => handleAccountSelect(account)}
                  className="w-full flex items-center space-x-3 p-3 hover:bg-muted transition-colors text-left border-b border-border last:border-b-0"
                >
                  <Icon name={account?.icon} size={20} className={account?.color} />
                  <div className="flex-1">
                    <div className="text-foreground font-medium">{account?.name}</div>
                    <div className="text-sm text-muted-foreground">{account?.account_type}</div>
                  </div>
                  <div className={`text-sm font-medium ${
                    account?.balance < 0 ? 'text-error' : 'text-success'
                  }`}>
                    {formatBalance(account?.balance)}
                  </div>
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AccountSelector;