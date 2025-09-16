import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import SettingsPreferences from './pages/settings-preferences';
import DashboardOverview from './pages/dashboard-overview';
import BudgetManagement from './pages/budget-management';
import FinancialReports from './pages/financial-reports';
import TransactionManagement from './pages/transaction-management';
import AddEditTransaction from './pages/add-edit-transaction';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* App Routes - Accessible in preview mode */}
        <Route path="/" element={<DashboardOverview />} />
        <Route path="/dashboard-overview" element={<DashboardOverview />} />
        <Route path="/transaction-management" element={<TransactionManagement />} />
        <Route path="/add-edit-transaction" element={<AddEditTransaction />} />
        <Route path="/budget-management" element={<BudgetManagement />} />
        <Route path="/financial-reports" element={<FinancialReports />} />
        <Route path="/settings-preferences" element={<SettingsPreferences />} />
        
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;