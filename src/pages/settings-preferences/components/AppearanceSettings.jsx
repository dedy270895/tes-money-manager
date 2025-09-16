import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { useAuth } from '../../../contexts/AuthContext';
import { userProfileService } from '../../../services/userProfileService';

const AppearanceSettings = () => {
  const { user, profile, reloadProfile } = useAuth();
  const [theme, setTheme] = useState('system');
  const [currency, setCurrency] = useState('USD');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');

  useEffect(() => {
    if (profile) {
      setTheme(profile.theme || 'system');
      setCurrency(profile.currency || 'USD');
      setDateFormat(profile.date_format || 'MM/DD/YYYY');
    }
  }, [profile]);

  const handleThemeChange = async (newTheme) => {
    setTheme(newTheme);
    if (user) {
      await userProfileService.updateProfile(user.id, { theme: newTheme });
      reloadProfile();
    }
  };

  const handleCurrencyChange = async (newCurrency) => {
    setCurrency(newCurrency);
    if (user) {
      await userProfileService.updateProfile(user.id, { currency: newCurrency });
      reloadProfile();
    }
  };

  const handleDateFormatChange = async (newFormat) => {
    setDateFormat(newFormat);
    if (user) {
      await userProfileService.updateProfile(user.id, { date_format: newFormat });
      reloadProfile();
    }
  };

  const themeOptions = [
    { value: 'light', label: 'Light Mode' },
    { value: 'dark', label: 'Dark Mode' },
    { value: 'system', label: 'System Preference' }
  ];

  const currencyOptions = [
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'GBP', label: 'British Pound (£)' },
    { value: 'IDR', label: 'Indonesian Rupiah (Rp)' },
  ];

  const dateFormatOptions = [
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (12/31/2024)' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (31/12/2024)' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2024-12-31)' },
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="Palette" size={20} className="text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Appearance</h3>
          <p className="text-sm text-muted-foreground">Customize how the app looks and feels</p>
        </div>
      </div>
      <div className="space-y-6">
        {/* Theme Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">Theme</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {themeOptions?.map((option) => (
              <button
                key={option?.value}
                onClick={() => handleThemeChange(option?.value)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  theme === option?.value
                    ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full border-2 ${
                    theme === option?.value ? 'border-primary bg-primary' : 'border-muted-foreground'
                  }`}>
                    {theme === option?.value && (
                      <Icon name="Check" size={14} className="text-primary-foreground m-0.5" />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-foreground">{option?.label}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Currency Settings */}
        <div>
          <Select
            label="Currency"
            description="Choose your preferred currency for all transactions"
            options={currencyOptions}
            value={currency}
            onChange={handleCurrencyChange}
          />
        </div>

        {/* Date Format */}
        <div>
          <Select
            label="Date Format"
            description="How dates will be displayed throughout the app"
            options={dateFormatOptions}
            value={dateFormat}
            onChange={handleDateFormatChange}
          />
        </div>

        {/* Reset to Defaults */}
        <div className="pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={() => {
              handleThemeChange('system');
              handleCurrencyChange('USD');
              handleDateFormatChange('MM/DD/YYYY');
            }}
          >
            Reset to Defaults
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSettings;