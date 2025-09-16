import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import TransactionItem from './TransactionItem';

const TransactionList = ({ 
  transactions, 
  loading, 
  onEdit, 
  onDelete, 
  onLoadMore, 
  hasMore,
  bulkMode = false,
  onBulkModeChange,
  selectedTransactions = [],
  onSelectionChange
}) => {
  const [localSelectedTransactions, setLocalSelectedTransactions] = useState(selectedTransactions);

  useEffect(() => {
    setLocalSelectedTransactions(selectedTransactions);
  }, [selectedTransactions]);

  const handleSelectTransaction = (transactionId, isSelected) => {
    const updatedSelection = isSelected
      ? [...localSelectedTransactions, transactionId]
      : localSelectedTransactions?.filter(id => id !== transactionId);
    
    setLocalSelectedTransactions(updatedSelection);
    onSelectionChange(updatedSelection);
  };

  const handleSelectAll = () => {
    const allIds = transactions?.map(t => t?.id);
    const newSelection = localSelectedTransactions?.length === transactions?.length ? [] : allIds;
    setLocalSelectedTransactions(newSelection);
    onSelectionChange(newSelection);
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(5)]?.map((_, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-muted rounded-full animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
              <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
            </div>
            <div className="w-20 h-4 bg-muted rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon name="Receipt" size={24} className="text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium text-foreground mb-2">No transactions found</h3>
      <p className="text-muted-foreground mb-6">
        Start tracking your finances by adding your first transaction.
      </p>
      <Button
        onClick={() => window.location.href = '/add-edit-transaction'}
        className="bg-primary text-primary-foreground"
      >
        <Icon name="Plus" size={16} className="mr-2" />
        Add Transaction
      </Button>
    </div>
  );

  if (loading && transactions?.length === 0) {
    return <LoadingSkeleton />;
  }

  if (!loading && transactions?.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      {/* Bulk Actions Header */}
      {bulkMode && (
        <div className="bg-muted/50 border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
              >
                <Icon 
                  name={localSelectedTransactions?.length === transactions?.length ? "CheckSquare" : "Square"} 
                  size={16} 
                  className="mr-2" 
                />
                {localSelectedTransactions?.length === transactions?.length ? 'Deselect All' : 'Select All'}
              </Button>
              <span className="text-sm text-muted-foreground">
                {localSelectedTransactions?.length} of {transactions?.length} selected
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={localSelectedTransactions?.length === 0}
              >
                <Icon name="Tag" size={16} className="mr-2" />
                Categorize
              </Button>
              <Button
                variant="destructive"
                size="sm"
                disabled={localSelectedTransactions?.length === 0}
                onClick={() => {
                  if (window.confirm(`Delete ${localSelectedTransactions?.length} selected transactions?`)) {
                    localSelectedTransactions?.forEach(id => onDelete(id));
                    setLocalSelectedTransactions([]);
                    onSelectionChange([]);
                  }
                }}
              >
                <Icon name="Trash2" size={16} className="mr-2" />
                Delete
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onBulkModeChange(false);
                  setLocalSelectedTransactions([]);
                  onSelectionChange([]);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Transaction Items */}
      <div className="space-y-3">
        {transactions?.map((transaction) => (
          <TransactionItem
            key={transaction?.id}
            transaction={transaction}
            onEdit={onEdit}
            onDelete={onDelete}
            onSelect={handleSelectTransaction}
            isSelected={localSelectedTransactions?.includes(transaction?.id)}
            showCheckbox={bulkMode}
          />
        ))}
      </div>
      {/* Load More */}
      {hasMore && (
        <div className="text-center py-6">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={loading}
            className="min-w-32"
          >
            {loading ? (
              <>
                <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Icon name="ChevronDown" size={16} className="mr-2" />
                Load More
              </>
            )}
          </Button>
        </div>
      )}
      {/* Loading More Skeleton */}
      {loading && transactions?.length > 0 && (
        <div className="space-y-3">
          {[...Array(3)]?.map((_, index) => (
            <div key={`loading-${index}`} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-muted rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                </div>
                <div className="w-20 h-4 bg-muted rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionList;