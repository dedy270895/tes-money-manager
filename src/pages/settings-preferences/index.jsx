import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import QuickAction from '../../components/ui/QuickAction';
import Icon from '../../components/AppIcon';
import AppearanceSettings from './components/AppearanceSettings';
import DataManagement from './components/DataManagement';
import NotificationSettings from './components/NotificationSettings';
import CategoryManagement from './components/CategoryManagement';
import AccountSettings from './components/AccountSettings';
import AccountManagement from './components/AccountManagement'; // Import the new component
import { useAuth } from '../../contexts/AuthContext';

const SettingsPreferences = () => {
  const [activeTab, setActiveTab] = useState('appearance');
  const { profile } = useAuth();

  const settingsTabs = [
    {
      id: 'appearance',
      label: 'Appearance',
      icon: 'Palette',
      component: AppearanceSettings
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: 'Bell',
      component: NotificationSettings
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: 'FolderOpen',
      component: CategoryManagement
    },
    {
      id: 'data',
      label: 'Data Management',
      icon: 'Database',
      component: DataManagement
    },
    {
      id: 'account',
      label: 'Account',
      icon: 'User',
      component: AccountSettings
    },
    {
      id: 'accounts',
      label: 'Manage Accounts',
      icon: 'Wallet',
      component: AccountManagement // Render component directly
    }
  ];

  const ActiveComponent = settingsTabs?.find(tab => tab?.id === activeTab)?.component;

  return (
    <>
      <Helmet>
        <title>Settings & Preferences - MoneyTracker</title>
        <meta name="description" content="Customize your MoneyTracker experience with appearance, notification, and data management settings." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Icon name="Settings" size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Settings & Preferences</h1>
                <p className="text-muted-foreground">Customize your MoneyTracker experience</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Settings Navigation - Mobile Dropdown */}
            <div className="lg:hidden">
              <div className="bg-card rounded-lg border border-border p-4 mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">Settings Category</label>
                <select
                  value={activeTab}
                  onChange={(e) => setActiveTab(e?.target?.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {settingsTabs?.map((tab) => (
                    <option key={tab?.id} value={tab?.id}>
                      {tab?.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Settings Navigation - Desktop Sidebar */}
            <div className="hidden lg:block lg:w-64 flex-shrink-0">
              <div className="bg-card rounded-lg border border-border p-2 sticky top-24">
                <nav className="space-y-1">
                  {settingsTabs?.map((tab) => (
                    <button
                      key={tab?.id}
                      onClick={() => setActiveTab(tab?.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        activeTab === tab?.id
                          ? 'bg-primary text-primary-foreground shadow-soft'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon name={tab?.icon} size={20} />
                      <span className="font-medium">{tab?.label}</span>
                    </button>
                  ))}
                </nav>

                {/* Quick Stats */}
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium text-foreground mb-3">Quick Stats</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Categories</span>
                      <span className="font-medium text-foreground">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Storage Used</span>
                      <span className="font-medium text-foreground">2.4 MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Backup</span>
                      <span className="font-medium text-foreground">Jan 5</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings Content */}
            <div className="flex-1 min-w-0">
              {activeTab === 'account' ? (
                <AccountSettings profile={profile} />
              ) : activeTab === 'accounts' ? (
                <AccountManagement />
              ) : (
                ActiveComponent && <ActiveComponent />
              )}
            </div>
          </div>

          {/* Mobile Tab Indicator */}
          <div className="lg:hidden fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded-full px-4 py-2 shadow-elevated">
            <div className="flex items-center space-x-2">
              <Icon 
                name={settingsTabs?.find(tab => tab?.id === activeTab)?.icon || 'Settings'} 
                size={16} 
                className="text-primary" 
              />
              <span className="text-sm font-medium text-foreground">
                {settingsTabs?.find(tab => tab?.id === activeTab)?.label}
              </span>
            </div>
          </div>
        </main>

        <QuickAction />
      </div>
    </>
  );
};

export default SettingsPreferences;