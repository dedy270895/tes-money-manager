import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const DataManagement = () => {
  const [exportFormat, setExportFormat] = useState('CSV');
  const [exportDateRange, setExportDateRange] = useState('all');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState('weekly');
  const [includeCategories, setIncludeCategories] = useState(true);
  const [includeAccounts, setIncludeAccounts] = useState(true);
  const [includeBudgets, setIncludeBudgets] = useState(false);

  const exportFormatOptions = [
    { value: 'CSV', label: 'CSV (Comma Separated Values)' },
    { value: 'PDF', label: 'PDF (Portable Document Format)' },
    { value: 'JSON', label: 'JSON (JavaScript Object Notation)' },
    { value: 'XLSX', label: 'Excel Spreadsheet (.xlsx)' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'current_year', label: 'Current Year (2024)' },
    { value: 'last_year', label: 'Last Year (2023)' },
    { value: 'last_6_months', label: 'Last 6 Months' },
    { value: 'last_3_months', label: 'Last 3 Months' },
    { value: 'current_month', label: 'Current Month' },
    { value: 'custom', label: 'Custom Date Range' }
  ];

  const backupFrequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'never', label: 'Never' }
  ];

  const storageData = {
    totalUsed: 2.4,
    totalAvailable: 100,
    breakdown: [
      { category: 'Transactions', size: 1.2, color: 'bg-primary' },
      { category: 'Categories', size: 0.3, color: 'bg-success' },
      { category: 'Budgets', size: 0.5, color: 'bg-warning' },
      { category: 'Reports Cache', size: 0.4, color: 'bg-error' }
    ]
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    // Simulate export progress
    const progressInterval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsExporting(false);
          // Simulate file download
          const link = document.createElement('a');
          link.href = '#';
          link.download = `moneytracker_export_${new Date()?.toISOString()?.split('T')?.[0]}.${exportFormat?.toLowerCase()}`;
          link?.click();
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleClearData = (dataType) => {
    if (window.confirm(`Are you sure you want to clear all ${dataType}? This action cannot be undone.`)) {
      // Simulate data clearing
      console.log(`Clearing ${dataType}...`);
    }
  };

  const handleBackupNow = () => {
    // Simulate backup creation
    console.log('Creating backup...');
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="Database" size={20} className="text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Data Management</h3>
          <p className="text-sm text-muted-foreground">Export, backup, and manage your financial data</p>
        </div>
      </div>
      <div className="space-y-8">
        {/* Storage Usage */}
        <div>
          <h4 className="font-medium text-foreground mb-4">Storage Usage</h4>
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">
                {storageData?.totalUsed} MB of {storageData?.totalAvailable} MB used
              </span>
              <span className="text-sm font-medium text-foreground">
                {Math.round((storageData?.totalUsed / storageData?.totalAvailable) * 100)}%
              </span>
            </div>
            
            <div className="w-full bg-background rounded-full h-2 mb-4">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(storageData?.totalUsed / storageData?.totalAvailable) * 100}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {storageData?.breakdown?.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${item?.color}`} />
                  <span className="text-xs text-muted-foreground">{item?.category}</span>
                  <span className="text-xs font-medium text-foreground ml-auto">{item?.size} MB</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Data Export */}
        <div>
          <h4 className="font-medium text-foreground mb-4">Export Data</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Export Format"
                options={exportFormatOptions}
                value={exportFormat}
                onChange={setExportFormat}
              />
              <Select
                label="Date Range"
                options={dateRangeOptions}
                value={exportDateRange}
                onChange={setExportDateRange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Include in Export</label>
              <div className="space-y-2">
                <Checkbox
                  label="Transaction Categories"
                  checked={includeCategories}
                  onChange={(e) => setIncludeCategories(e?.target?.checked)}
                />
                <Checkbox
                  label="Account Information"
                  checked={includeAccounts}
                  onChange={(e) => setIncludeAccounts(e?.target?.checked)}
                />
                <Checkbox
                  label="Budget Data"
                  checked={includeBudgets}
                  onChange={(e) => setIncludeBudgets(e?.target?.checked)}
                />
              </div>
            </div>

            {isExporting && (
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Exporting...</span>
                  <span className="text-sm text-muted-foreground">{exportProgress}%</span>
                </div>
                <div className="w-full bg-background rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${exportProgress}%` }}
                  />
                </div>
              </div>
            )}

            <Button
              onClick={handleExport}
              disabled={isExporting}
              loading={isExporting}
              iconName="Download"
              iconPosition="left"
              className="w-full sm:w-auto"
            >
              {isExporting ? 'Exporting...' : 'Export Data'}
            </Button>
          </div>
        </div>

        {/* Backup Settings */}
        <div>
          <h4 className="font-medium text-foreground mb-4">Automatic Backup</h4>
          <div className="space-y-4">
            <Checkbox
              label="Enable automatic backups"
              description="Automatically create backups of your data"
              checked={autoBackup}
              onChange={(e) => setAutoBackup(e?.target?.checked)}
            />

            {autoBackup && (
              <Select
                label="Backup Frequency"
                options={backupFrequencyOptions}
                value={backupFrequency}
                onChange={setBackupFrequency}
              />
            )}

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleBackupNow}
                iconName="Shield"
                iconPosition="left"
              >
                Create Backup Now
              </Button>
              <div className="text-sm text-muted-foreground">
                Last backup: January 5, 2024 at 2:30 PM
              </div>
            </div>
          </div>
        </div>

        {/* Data Clearing */}
        <div className="pt-6 border-t border-border">
          <h4 className="font-medium text-foreground mb-4">Clear Data</h4>
          <div className="bg-error/5 border border-error/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="AlertTriangle" size={20} className="text-error mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-error mb-2">Danger Zone</p>
                <p className="text-sm text-muted-foreground mb-4">
                  These actions permanently delete data and cannot be undone. Please proceed with caution.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleClearData('transactions')}
                  >
                    Clear Transactions
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleClearData('categories')}
                  >
                    Clear Categories
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleClearData('all data')}
                  >
                    Clear All Data
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataManagement;