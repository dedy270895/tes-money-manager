import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { transactionService } from '../../services/transactionService';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import QuickAction from '../../components/ui/QuickAction';
import TransactionFilters from './components/TransactionFilters';
import FilterChips from './components/FilterChips';
import TransactionList from './components/TransactionList';
import TransactionModal from './components/TransactionModal';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';

const TransactionManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: '',
    search: '',
    sortBy: 'date-desc'
  });

  // Mock transaction data for preview mode
  const mockTransactions = [
    {
      id: 1,
      transaction_type: 'expense',
      description: 'Grocery Shopping at Whole Foods',
      amount: -127.45,
      categories: { name: 'Food & Dining', color: '#FF6B6B' },
      accounts: { name: 'Checking Account', account_type: 'checking' },
      transaction_date: '2025-01-05',
      notes: 'Weekly grocery shopping'
    },
    {
      id: 2,
      transaction_type: 'income',
      description: 'Salary Payment - January',
      amount: 5500.00,
      categories: { name: 'Salary', color: '#98D8C8' },
      accounts: { name: 'Checking Account', account_type: 'checking' },
      transaction_date: '2025-01-01',
      notes: 'Monthly salary deposit'
    }
  ];

  // Load transactions from Supabase or show mock data
  const loadTransactions = async () => {
    if (!user?.id) {
      // Show mock data for preview mode
      setTransactions(mockTransactions);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      let result = await transactionService?.getTransactions(user?.id, filters);
      
      if (result?.success) {
        setTransactions(result?.data || []);
      } else {
        setError(result?.error || 'Failed to load transactions');
      }
    } catch (err) {
      setError('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [user, filters]);

  // Filter and sort transactions
  useEffect(() => {
    let filtered = [...transactions];

    // Type filter
    if (filters?.type !== 'all') {
      filtered = filtered?.filter(t => t?.transaction_type === filters?.type);
    }

    // Category filter
    if (filters?.category !== 'all') {
      filtered = filtered?.filter(t => t?.categories?.name === filters?.category);
    }

    // Date range filter
    if (filters?.dateFrom) {
      filtered = filtered?.filter(t => new Date(t?.transaction_date) >= new Date(filters.dateFrom));
    }
    if (filters?.dateTo) {
      filtered = filtered?.filter(t => new Date(t?.transaction_date) <= new Date(filters.dateTo));
    }

    // Amount range filter
    if (filters?.amountMin) {
      filtered = filtered?.filter(t => Math.abs(t?.amount) >= parseFloat(filters?.amountMin));
    }
    if (filters?.amountMax) {
      filtered = filtered?.filter(t => Math.abs(t?.amount) <= parseFloat(filters?.amountMax));
    }

    // Search filter
    if (filters?.search) {
      const searchTerm = filters?.search?.toLowerCase();
      filtered = filtered?.filter(t => 
        t?.description?.toLowerCase()?.includes(searchTerm) ||
        t?.categories?.name?.toLowerCase()?.includes(searchTerm) ||
        t?.accounts?.name?.toLowerCase()?.includes(searchTerm)
      );
    }

    // Sort
    filtered?.sort((a, b) => {
      switch (filters?.sortBy) {
        case 'date-desc':
          return new Date(b?.transaction_date) - new Date(a?.transaction_date);
        case 'date-asc':
          return new Date(a?.transaction_date) - new Date(b?.transaction_date);
        case 'amount-desc':
          return Math.abs(b?.amount) - Math.abs(a?.amount);
        case 'amount-asc':
          return Math.abs(a?.amount) - Math.abs(b?.amount);
        case 'category':
          return a?.categories?.name?.localeCompare(b?.categories?.name);
        default:
          return 0;
      }
    });

    setFilteredTransactions(filtered);
  }, [transactions, filters]);

  // Calculate transaction counts for filter chips
  const transactionCounts = {
    all: transactions?.length,
    expense: transactions?.filter(t => t?.transaction_type === 'expense')?.length,
    income: transactions?.filter(t => t?.transaction_type === 'income')?.length,
    transfer: transactions?.filter(t => t?.transaction_type === 'transfer')?.length
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleQuickFilterChange = (type) => {
    setFilters(prev => ({ ...prev, type }));
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setShowEditModal(true);
  };

  const handleDeleteTransaction = (transactionId) => {
    setTransactionToDelete(transactionId);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    setShowConfirmDialog(false);
    if (!transactionToDelete) return;

    if (!user?.id) {
      // Preview mode - just remove from local state
      setTransactions(prev => prev?.filter(t => t?.id !== transactionToDelete));
      setSelectedTransactions(prev => prev?.filter(id => id !== transactionToDelete));
      setTransactionToDelete(null);
      setShowEditModal(false); // Close the modal after successful deletion
      setEditingTransaction(null); // Clear editing transaction
      return;
    }

    try {
      let result = await transactionService?.deleteTransaction(transactionToDelete);
      if (result?.success) {
        setTransactions(prev => prev?.filter(t => t?.id !== transactionToDelete));
        setSelectedTransactions(prev => prev?.filter(id => id !== transactionToDelete));
        setShowEditModal(false); // Close the modal after successful deletion
        setEditingTransaction(null); // Clear editing transaction
      } else {
        setError(result?.error || 'Failed to delete transaction');
      }
    } catch (err) {
      setError('Failed to delete transaction');
    } finally {
      setTransactionToDelete(null);
    }
  };

  const handleSaveTransaction = async (transactionData) => {
    if (!user?.id) {
      // Preview mode - just update local state
      if (editingTransaction) {
        setTransactions(prev => 
          prev?.map(t => t?.id === editingTransaction?.id ? { ...transactionData, id: editingTransaction?.id } : t)
        );
      } else {
        const newTransaction = { ...transactionData, id: Date.now() };
        setTransactions(prev => [newTransaction, ...prev]);
      }
      setEditingTransaction(null);
      return;
    }

    try {
      let result;
      if (editingTransaction) {
        result = await transactionService?.updateTransaction(editingTransaction?.id, transactionData);
        if (result?.success) {
          setTransactions(prev => 
            prev?.map(t => t?.id === editingTransaction?.id ? result?.data : t)
          );
        }
      } else {
        result = await transactionService?.createTransaction({
          ...transactionData,
          user_id: user?.id
        });
        if (result?.success) {
          setTransactions(prev => [result?.data, ...prev]);
        }
      }

      if (!result?.success) {
        setError(result?.error || 'Failed to save transaction');
      }
    } catch (err) {
      setError('Failed to save transaction');
    }
    
    setEditingTransaction(null);
  };

  const handleLoadMore = () => {
    setLoading(true);
    // Simulate loading more data
    setTimeout(() => {
      setCurrentPage(prev => prev + 1);
      setLoading(false);
      // For demo, stop loading more after page 3
      if (currentPage >= 2) {
        setHasMore(false);
      }
    }, 1000);
  };

  const handleBulkModeToggle = () => {
    setBulkMode(!bulkMode);
    setSelectedTransactions([]);
  };

  if (loading && transactions?.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">Loading transactions...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-6">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        {/* Preview Mode Banner */}
        {!user && (
          <div className="mb-6 bg-primary/10 border border-primary/20 rounded-lg p-4 text-center">
            <p className="text-primary font-medium">Preview Mode - Sign in to manage your real transactions</p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <TransactionFilters
              filters={filters}
              onFiltersChange={handleFilterChange}
              isOpen={true}
              onClose={() => {}}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Transaction Management</h1>
                <p className="text-muted-foreground mt-1">
                  Track and manage all your financial transactions
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <QuickAction className="hidden md:flex" />
                
                {/* Mobile Filter Toggle */}
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden"
                >
                  <Icon name="Filter" size={16} className="mr-2" />
                  Filters
                </Button>

                {/* Bulk Mode Toggle */}
                <Button
                  variant={bulkMode ? "default" : "outline"}
                  onClick={handleBulkModeToggle}
                >
                  <Icon name="CheckSquare" size={16} className="mr-2" />
                  {bulkMode ? 'Exit Bulk' : 'Bulk Select'}
                </Button>

                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={filters?.sortBy}
                    onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e?.target?.value }))}
                    className="appearance-none bg-card border border-border rounded-lg px-3 py-2 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="date-desc">Newest First</option>
                    <option value="date-asc">Oldest First</option>
                    <option value="amount-desc">Highest Amount</option>
                    <option value="amount-asc">Lowest Amount</option>
                    <option value="category">Category</option>
                  </select>
                  <Icon 
                    name="ChevronDown" 
                    size={16} 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {/* Filter Chips */}
            <div className="mb-6">
              <FilterChips
                activeFilter={filters?.type}
                onFilterChange={handleQuickFilterChange}
                transactionCounts={transactionCounts}
              />
            </div>

            {/* Transaction List */}
            <TransactionList
              transactions={filteredTransactions}
              loading={loading}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              bulkMode={bulkMode}
              onBulkModeChange={setBulkMode}
              selectedTransactions={selectedTransactions}
              onSelectionChange={setSelectedTransactions}
            />
          </div>
        </div>
      </div>
      {/* Mobile Filters */}
      {showFilters && (
        <TransactionFilters
          filters={filters}
          onFiltersChange={handleFilterChange}
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
        />
      )}
      {/* Transaction Edit Modal */}
      <TransactionModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingTransaction(null);
        }}
        transaction={editingTransaction}
        onSave={handleSaveTransaction}
      />
      {/* Quick Action FAB */}
      <QuickAction />

      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this transaction? This action cannot be undone."
      />
    </div>
  );
};

export default TransactionManagement;