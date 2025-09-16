import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ExportOptions = () => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [selectedSections, setSelectedSections] = useState(['overview', 'categories']);
  const [dateRange, setDateRange] = useState('current-month');
  const [isExporting, setIsExporting] = useState(false);

  const exportFormats = [
    { id: 'pdf', label: 'PDF Report', icon: 'FileText', description: 'Formatted report with charts' },
    { id: 'csv', label: 'CSV Data', icon: 'Download', description: 'Raw data for spreadsheets' },
    { id: 'excel', label: 'Excel Workbook', icon: 'FileSpreadsheet', description: 'Multiple sheets with data' }
  ];

  const reportSections = [
    { id: 'overview', label: 'Overview Summary', description: 'Income, expenses, and savings overview' },
    { id: 'categories', label: 'Category Analysis', description: 'Spending breakdown by category' },
    { id: 'trends', label: 'Trend Analysis', description: 'Historical trends and insights' },
    { id: 'budgets', label: 'Budget Tracking', description: 'Budget vs actual spending' },
    { id: 'transactions', label: 'Transaction Details', description: 'Detailed transaction list' }
  ];

  const dateRanges = [
    { id: 'current-month', label: 'Current Month' },
    { id: 'last-month', label: 'Last Month' },
    { id: 'current-quarter', label: 'Current Quarter' },
    { id: 'last-quarter', label: 'Last Quarter' },
    { id: 'current-year', label: 'Current Year' },
    { id: 'custom', label: 'Custom Range' }
  ];

  const handleSectionToggle = (sectionId) => {
    setSelectedSections(prev => 
      prev?.includes(sectionId) 
        ? prev?.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsExporting(false);
    setIsExportModalOpen(false);
    
    // Show success message (in real app, this would trigger actual export)
    alert(`Report exported successfully as ${selectedFormat?.toUpperCase()}!`);
  };

  return (
    <>
      {/* Export Button */}
      <div className="bg-card p-4 md:p-6 border-t border-border">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-foreground">Export Reports</h4>
            <p className="text-sm text-muted-foreground">Download your financial data and insights</p>
          </div>
          <Button
            onClick={() => setIsExportModalOpen(true)}
            iconName="Download"
            iconPosition="left"
            className="shadow-soft"
          >
            Export Data
          </Button>
        </div>
      </div>
      {/* Export Modal */}
      {isExportModalOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={() => setIsExportModalOpen(false)}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-lg shadow-elevated w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Export Financial Report</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Customize your report and choose export format
                  </p>
                </div>
                <button
                  onClick={() => setIsExportModalOpen(false)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <Icon name="X" size={20} className="text-muted-foreground" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Export Format Selection */}
                <div>
                  <h4 className="text-lg font-medium text-foreground mb-3">Export Format</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {exportFormats?.map((format) => (
                      <button
                        key={format?.id}
                        onClick={() => setSelectedFormat(format?.id)}
                        className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                          selectedFormat === format?.id
                            ? 'border-primary bg-primary/5' :'border-border hover:border-muted-foreground/30'
                        }`}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <Icon 
                            name={format?.icon} 
                            size={20} 
                            className={selectedFormat === format?.id ? 'text-primary' : 'text-muted-foreground'}
                          />
                          <span className="font-medium text-foreground">{format?.label}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{format?.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date Range Selection */}
                <div>
                  <h4 className="text-lg font-medium text-foreground mb-3">Date Range</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {dateRanges?.map((range) => (
                      <button
                        key={range?.id}
                        onClick={() => setDateRange(range?.id)}
                        className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                          dateRange === range?.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        {range?.label}
                      </button>
                    ))}
                  </div>
                  
                  {dateRange === 'custom' && (
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">From Date</label>
                        <input
                          type="date"
                          className="w-full p-2 border border-border rounded-lg bg-input text-foreground"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">To Date</label>
                        <input
                          type="date"
                          className="w-full p-2 border border-border rounded-lg bg-input text-foreground"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Report Sections */}
                <div>
                  <h4 className="text-lg font-medium text-foreground mb-3">Include Sections</h4>
                  <div className="space-y-2">
                    {reportSections?.map((section) => (
                      <label
                        key={section?.id}
                        className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSections?.includes(section?.id)}
                          onChange={() => handleSectionToggle(section?.id)}
                          className="mt-1 w-4 h-4 text-primary border-border rounded focus:ring-primary"
                        />
                        <div>
                          <span className="font-medium text-foreground">{section?.label}</span>
                          <p className="text-sm text-muted-foreground">{section?.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Export Preview */}
                <div className="bg-muted/30 rounded-lg p-4">
                  <h5 className="font-medium text-foreground mb-2">Export Preview</h5>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Format: {exportFormats?.find(f => f?.id === selectedFormat)?.label}</p>
                    <p>Date Range: {dateRanges?.find(r => r?.id === dateRange)?.label}</p>
                    <p>Sections: {selectedSections?.length} selected</p>
                    <p>Estimated Size: ~{selectedSections?.length * 0.5}MB</p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => setIsExportModalOpen(false)}
                  disabled={isExporting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleExport}
                  loading={isExporting}
                  iconName="Download"
                  iconPosition="left"
                  disabled={selectedSections?.length === 0}
                >
                  {isExporting ? 'Exporting...' : 'Export Report'}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ExportOptions;