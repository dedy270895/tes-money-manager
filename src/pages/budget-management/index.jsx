import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import QuickAction from '../../components/ui/QuickAction';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import BudgetCard from './components/BudgetCard';
import BudgetOverview from './components/BudgetOverview';
import CreateBudgetModal from './components/CreateBudgetModal';
import BudgetHistory from './components/BudgetHistory';
import { budgetService } from '../../services/budgetService';

const BudgetManagement = () => {
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('current');
  const [searchTerm, setSearchTerm] = useState('');
  const { user, profile } = useAuth();

  const fetchBudgets = async () => {
    if (user?.id) {
      setIsLoading(true);
      setError(null);
      try {
        const { data: fetchedBudgets, error: fetchError } = await budgetService.getBudgets(user.id);
        if (fetchError) throw fetchError;

        const budgetsWithSpending = await Promise.all(
          (fetchedBudgets || []).map(async (budget) => {
            const { data: spentAmount, error: spendingError } = await budgetService.getBudgetSpending(
              user.id,
              budget.categories.id, // Pass category_id from the nested categories object
              budget.start_date,
              budget.end_date || new Date().toISOString().split('T')[0]
            );
            if (spendingError) {
              console.error(`Error fetching spending for budget ${budget.id}:`, spendingError);
              return { ...budget, spent: 0 };
            }
            return { ...budget, spent: spentAmount || 0 };
          })
        );
        setBudgets(budgetsWithSpending);
      } catch (error) {
        console.error('Error fetching budgets:', error);
        setError('Failed to load budgets. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [user]);

  const tabs = [
    { id: 'current', label: 'Current Budgets', icon: 'Target' },
    { id: 'history', label: 'History', icon: 'History' }
  ];

  const handleCreateBudget = async (newBudget) => {
    if (user?.id) {
      const budgetData = { ...newBudget, user_id: user.id };
      const { data, error } = await budgetService.createBudget(budgetData);
      if (error) {
        console.error('Error creating budget:', error);
        setError('Failed to create budget. Please try again.');
      } else {
        setBudgets(prev => [data, ...prev]);
        fetchBudgets();
      }
    }
  };

  const handleEditBudget = async (budgetId, updates) => {
    const { error } = await budgetService.updateBudget(budgetId, updates);
    if (error) {
      console.error('Error updating budget:', error);
      setError('Failed to update budget. Please try again.');
    } else {
      fetchBudgets();
    }
  };

  const handleDeleteBudget = async (budgetId) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      const { error } = await budgetService.deleteBudget(budgetId);
      if (error) {
        console.error('Error deleting budget:', error);
        setError('Failed to delete budget. Please try again.');
      } else {
        setBudgets(prev => prev.filter(budget => budget.id !== budgetId));
      }
    }
  };

  const filteredBudgets = budgets?.filter(budget =>
    budget?.categories?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    budget?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  const sortedBudgets = [...filteredBudgets]?.sort((a, b) => {
    const aPercentage = (a.allocated > 0 ? (a.spent / a.allocated) : 0) * 100;
    const bPercentage = (b.allocated > 0 ? (b.spent / b.allocated) : 0) * 100;
    return bPercentage - aPercentage;
  });

  return (
    <>
      <Helmet>
        <title>Budget Management - MoneyTracker</title>
        <meta name="description" content="Set, monitor, and adjust spending limits across categories with visual progress tracking and alerts." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Budget Management</h1>
              <p className="text-muted-foreground">
                Set spending limits and track your progress across different categories
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <QuickAction className="hidden md:flex" />
              <Button
                variant="default"
                onClick={() => setIsCreateModalOpen(true)}
                iconName="Plus"
                iconPosition="left"
              >
                New Budget
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center space-x-1 mb-6 bg-muted p-1 rounded-lg w-fit">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === tab?.id
                    ? 'bg-background text-foreground shadow-soft'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </div>

          {/* Current Budgets Tab */}
          {activeTab === 'current' && (
            <>
              {/* Budget Overview */}
              <BudgetOverview budgets={budgets} profile={profile} />

              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
                <div className="relative flex-1 max-w-md">
                  <Icon 
                    name="Search" 
                    size={20} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
                  />
                  <input
                    type="text"
                    placeholder="Search budgets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e?.target?.value)}
                    className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Icon name="Filter" size={16} />
                  <span>Sorted by usage</span>
                </div>
              </div>

              {/* Budget Cards Grid */}
              {isLoading ? (
                <div className="text-center py-12">
                  <Icon name="Loader" className="animate-spin mx-auto text-primary" size={40} />
                  <p className="mt-4 text-muted-foreground">Loading budgets...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <Icon name="AlertTriangle" size={40} className="text-destructive mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-destructive mb-2">Error</h3>
                  <p className="text-destructive/80 mb-6">{error}</p>
                  <Button onClick={fetchBudgets} variant="destructive">
                    <Icon name="RefreshCw" size={16} className="mr-2" />
                    Try Again
                  </Button>
                </div>
              ) : sortedBudgets?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {sortedBudgets?.map((budget) => (
                    <BudgetCard
                      key={budget?.id}
                      budget={budget}
                      profile={profile}
                      onEdit={handleEditBudget}
                      onDelete={handleDeleteBudget}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Target" size={32} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {searchTerm ? 'No budgets found' : 'No budgets created yet'}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {searchTerm 
                      ? `No budgets match "${searchTerm}". Try a different search term.`
                      : 'Create your first budget to start tracking your spending limits.'
                    }
                  </p>
                  {!searchTerm && (
                    <Button
                      variant="default"
                      onClick={() => setIsCreateModalOpen(true)}
                      iconName="Plus"
                      iconPosition="left"
                    >
                      Create Budget
                    </Button>
                  )}
                </div>
              )}
            </>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <BudgetHistory budgets={budgets} profile={profile} />
          )}
        </main>

        {/* Quick Action FAB for Mobile */}
        <QuickAction />

        {/* Create Budget Modal */}
        <CreateBudgetModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleCreateBudget}
          profile={profile}
        />
      </div>
    </>
  );
};

export default BudgetManagement;