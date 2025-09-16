import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const RecurringSettings = ({ isRecurring, onRecurringChange, recurringData, onRecurringDataChange }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const frequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' },
    { value: 'custom', label: 'Custom' }
  ];

  const weekdayOptions = [
    { value: '1', label: 'Monday' },
    { value: '2', label: 'Tuesday' },
    { value: '3', label: 'Wednesday' },
    { value: '4', label: 'Thursday' },
    { value: '5', label: 'Friday' },
    { value: '6', label: 'Saturday' },
    { value: '0', label: 'Sunday' }
  ];

  const monthlyOptions = [
    { value: 'date', label: 'Same date each month' },
    { value: 'last', label: 'Last day of month' },
    { value: 'first-weekday', label: 'First weekday' },
    { value: 'last-weekday', label: 'Last weekday' }
  ];

  const handleRecurringToggle = (checked) => {
    onRecurringChange(checked);
    if (checked && !recurringData) {
      onRecurringDataChange({
        frequency: 'monthly',
        interval: 1,
        endType: 'never',
        endDate: '',
        occurrences: 12,
        weekdays: [],
        monthlyType: 'date'
      });
    }
  };

  const updateRecurringData = (field, value) => {
    onRecurringDataChange({
      ...recurringData,
      [field]: value
    });
  };

  const getFrequencyDescription = () => {
    if (!recurringData) return '';
    
    const { frequency, interval } = recurringData;
    const intervalText = interval > 1 ? `${interval} ` : '';
    
    switch (frequency) {
      case 'daily':
        return `Every ${intervalText}day${interval > 1 ? 's' : ''}`;
      case 'weekly':
        return `Every ${intervalText}week${interval > 1 ? 's' : ''}`;
      case 'monthly':
        return `Every ${intervalText}month${interval > 1 ? 's' : ''}`;
      case 'quarterly':
        return `Every ${intervalText}quarter${interval > 1 ? 's' : ''}`;
      case 'yearly':
        return `Every ${intervalText}year${interval > 1 ? 's' : ''}`;
      default:
        return 'Custom frequency';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">
            Recurring Transaction
          </label>
          <p className="text-xs text-muted-foreground">
            Automatically create this transaction on schedule
          </p>
        </div>
        <Checkbox
          checked={isRecurring}
          onChange={(e) => handleRecurringToggle(e?.target?.checked)}
        />
      </div>
      {isRecurring && recurringData && (
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg border border-border">
          {/* Frequency Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Frequency"
              options={frequencyOptions}
              value={recurringData?.frequency}
              onChange={(value) => updateRecurringData('frequency', value)}
            />
            
            <Input
              label="Every"
              type="number"
              min="1"
              max="99"
              value={recurringData?.interval}
              onChange={(e) => updateRecurringData('interval', parseInt(e?.target?.value) || 1)}
              description={getFrequencyDescription()}
            />
          </div>

          {/* Weekly Options */}
          {recurringData?.frequency === 'weekly' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Days of the week
              </label>
              <div className="grid grid-cols-7 gap-2">
                {weekdayOptions?.map((day) => (
                  <button
                    key={day?.value}
                    type="button"
                    onClick={() => {
                      const weekdays = recurringData?.weekdays || [];
                      const newWeekdays = weekdays?.includes(day?.value)
                        ? weekdays?.filter(d => d !== day?.value)
                        : [...weekdays, day?.value];
                      updateRecurringData('weekdays', newWeekdays);
                    }}
                    className={`p-2 text-xs rounded-md border transition-colors ${
                      (recurringData?.weekdays || [])?.includes(day?.value)
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    {day?.label?.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Monthly Options */}
          {recurringData?.frequency === 'monthly' && (
            <Select
              label="Monthly pattern"
              options={monthlyOptions}
              value={recurringData?.monthlyType}
              onChange={(value) => updateRecurringData('monthlyType', value)}
            />
          )}

          {/* End Conditions */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center space-x-2 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              <Icon 
                name={showAdvanced ? 'ChevronUp' : 'ChevronDown'} 
                size={16} 
              />
              <span>Advanced settings</span>
            </button>

            {showAdvanced && (
              <div className="space-y-4 p-3 bg-background rounded-md border border-border">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">
                    End condition
                  </label>
                  
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="endType"
                        value="never"
                        checked={recurringData?.endType === 'never'}
                        onChange={(e) => updateRecurringData('endType', e?.target?.value)}
                        className="text-primary"
                      />
                      <span className="text-sm text-foreground">Never end</span>
                    </label>
                    
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="endType"
                        value="date"
                        checked={recurringData?.endType === 'date'}
                        onChange={(e) => updateRecurringData('endType', e?.target?.value)}
                        className="text-primary"
                      />
                      <span className="text-sm text-foreground">End on date</span>
                    </label>
                    
                    {recurringData?.endType === 'date' && (
                      <div className="ml-6">
                        <Input
                          type="date"
                          value={recurringData?.endDate}
                          onChange={(e) => updateRecurringData('endDate', e?.target?.value)}
                        />
                      </div>
                    )}
                    
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="endType"
                        value="occurrences"
                        checked={recurringData?.endType === 'occurrences'}
                        onChange={(e) => updateRecurringData('endType', e?.target?.value)}
                        className="text-primary"
                      />
                      <span className="text-sm text-foreground">End after</span>
                    </label>
                    
                    {recurringData?.endType === 'occurrences' && (
                      <div className="ml-6 flex items-center space-x-2">
                        <Input
                          type="number"
                          min="1"
                          max="999"
                          value={recurringData?.occurrences}
                          onChange={(e) => updateRecurringData('occurrences', parseInt(e?.target?.value) || 1)}
                          className="w-20"
                        />
                        <span className="text-sm text-muted-foreground">occurrences</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecurringSettings;