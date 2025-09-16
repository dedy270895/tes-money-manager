import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import QuickAction from '../../components/ui/QuickAction';
import ReportTabs from './components/ReportTabs';
import TimeFilter from './components/TimeFilter';
import OverviewChart from './components/OverviewChart';
import CategoryAnalysis from './components/CategoryAnalysis';
import TrendsAnalysis from './components/TrendsAnalysis';
import BudgetTracking from './components/BudgetTracking';
import ExportOptions from './components/ExportOptions';
import Icon from '../../components/AppIcon';
import { useAuth } from '../../contexts/AuthContext';
import { transactionService } from '../../services/transactionService';
import { budgetService } from '../../services/budgetService';
import { categoryService } from '../../services/categoryService';

const FinancialReports = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [isLoading, setIsLoading] = useState(true);
  const [overviewData, setOverviewData] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [trendsData, setTrendsData] = useState(null);
  const [budgetData, setBudgetData] = useState(null);
  const [insightsData, setInsightsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setIsLoading(true);

      const { data, error } = await transactionService.getFinancialSummary(user.id, selectedPeriod);

      if (error) {
        console.error("Error fetching financial summary:", error);
      } else {
        setOverviewData(data.overview);
        setCategoryData(data.categoryAnalysis);
        setTrendsData(data.trends);
        setBudgetData(data.budgetTracking);
        setInsightsData(data.insights);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [user, selectedPeriod]);

  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className="bg-card p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Loading financial data...</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return <OverviewChart selectedPeriod={selectedPeriod} data={{ overview: overviewData, categoryAnalysis: categoryData, trends: trendsData }} />;
      case 'categories':
        return <CategoryAnalysis selectedPeriod={selectedPeriod} data={categoryData} />;
      case 'trends':
        return <TrendsAnalysis selectedPeriod={selectedPeriod} data={{ trends: trendsData, categoryTrends: categoryData, insights: insightsData }} />;
      case 'budgets':
        return <BudgetTracking selectedPeriod={selectedPeriod} data={budgetData} />;
      default:
        return <OverviewChart selectedPeriod={selectedPeriod} data={{ overview: overviewData, categoryAnalysis: categoryData, trends: trendsData }} />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Financial Reports - MoneyTracker</title>
        <meta name="description" content="Comprehensive financial analytics and insights for your spending patterns, income trends, and budget tracking." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Page Header */}
        <div className="bg-card border-b border-border">
          <div className="px-4 md:px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold text-foreground">Financial Reports</h1>
                <p className="text-muted-foreground mt-1">
                  Comprehensive analytics and insights into your financial health
                </p>
              </div>
              
              {/* Quick Stats - Desktop Only */}
              <div className="hidden lg:flex items-center space-x-6">
                <div className="text-center">
                  <div className="flex items-center space-x-1 text-success">
                    <Icon name="TrendingUp" size={16} />
                    <span className="text-sm font-medium">+12%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Income Growth</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center space-x-1 text-primary">
                    <Icon name="Target" size={16} />
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Savings Goal</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center space-x-1 text-warning">
                    <Icon name="AlertTriangle" size={16} />
                    <span className="text-sm font-medium">2</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Budget Alerts</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <ReportTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Time Filter */}
        <TimeFilter selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod} />

        {/* Main Content */}
        <div className="pb-20 md:pb-6">
          {renderTabContent()}
        </div>

        {/* Export Options */}
        <ExportOptions />

        {/* Quick Action FAB */}
        <QuickAction />
      </div>
    </>
  );
};

export default FinancialReports;
