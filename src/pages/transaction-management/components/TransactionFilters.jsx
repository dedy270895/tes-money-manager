import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const TransactionFilters = ({ 
  filters, 
  onFiltersChange, 
  isOpen, 
  onClose,
  className = '' 
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const transactionTypes = [
    { value: 'all', label: 'All Transactions' },
    { value: 'expense', label: 'Expenses' },
    { value: 'income', label: 'Income' },
    { value: 'transfer', label: 'Transfers' }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'food', label: 'Food & Dining' },
    { value: 'transport', label: 'Transportation' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'bills', label: 'Bills & Utilities' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'salary', label: 'Salary' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'investment', label: 'Investment' },
    { value: 'other', label: 'Other' }
  ];

  const sortOptions = [
    { value: 'date-desc', label: 'Date (Newest First)' },
    { value: 'date-asc', label: 'Date (Oldest First)' },
    { value: 'amount-desc', label: 'Amount (High to Low)' },
    { value: 'amount-asc', label: 'Amount (Low to High)' },
    { value: 'category', label: 'Category' }
  ];

  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      type: 'all',
      category: 'all',
      dateFrom: '',
      dateTo: '',
      amountMin: '',
      amountMax: '',
      search: '',
      sortBy: 'date-desc'
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const filterContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Filters</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-muted-foreground"
          >
            Reset
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="md:hidden"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div>
        <Input
          label="Search Transactions"
          type="search"
          placeholder="Search by description..."
          value={localFilters?.search}
          onChange={(e) => handleFilterChange('search', e?.target?.value)}
        />
      </div>

      {/* Transaction Type */}
      <div>
        <Select
          label="Transaction Type"
          options={transactionTypes}
          value={localFilters?.type}
          onChange={(value) => handleFilterChange('type', value)}
        />
      </div>

      {/* Category */}
      <div>
        <Select
          label="Category"
          options={categories}
          value={localFilters?.category}
          onChange={(value) => handleFilterChange('category', value)}
          searchable
        />
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="From Date"
          type="date"
          value={localFilters?.dateFrom}
          onChange={(e) => handleFilterChange('dateFrom', e?.target?.value)}
        />
        <Input
          label="To Date"
          type="date"
          value={localFilters?.dateTo}
          onChange={(e) => handleFilterChange('dateTo', e?.target?.value)}
        />
      </div>

      {/* Amount Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Min Amount"
          type="number"
          placeholder="0.00"
          value={localFilters?.amountMin}
          onChange={(e) => handleFilterChange('amountMin', e?.target?.value)}
        />
        <Input
          label="Max Amount"
          type="number"
          placeholder="1000.00"
          value={localFilters?.amountMax}
          onChange={(e) => handleFilterChange('amountMax', e?.target?.value)}
        />
      </div>

      {/* Sort By */}
      <div>
        <Select
          label="Sort By"
          options={sortOptions}
          value={localFilters?.sortBy}
          onChange={(value) => handleFilterChange('sortBy', value)}
        />
      </div>
    </div>
  );

  // Mobile: Slide-up panel
  if (window.innerWidth < 768) {
    return (
      <>
        {/* Backdrop */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={onClose}
          />
        )}
        
        {/* Mobile Filter Panel */}
        <div className={`fixed bottom-0 left-0 right-0 bg-card border-t border-border rounded-t-xl shadow-elevated z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}>
          <div className="p-6 max-h-[80vh] overflow-y-auto">
            {filterContent}
          </div>
        </div>
      </>
    );
  }

  // Desktop: Sidebar
  return (
    <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
      {filterContent}
    </div>
  );
};

export default TransactionFilters;