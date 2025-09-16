import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';

const DateTimePicker = ({ date, time, onDateChange, onTimeChange, error }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const formatDisplayDate = (dateString) => {
    if (!dateString) return 'Select date';
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDisplayTime = (timeString) => {
    if (!timeString) return 'Select time';
    const [hours, minutes] = timeString?.split(':');
    const date = new Date();
    date?.setHours(parseInt(hours), parseInt(minutes));
    return date?.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getQuickDateOptions = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday?.setDate(yesterday?.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo?.setDate(weekAgo?.getDate() - 7);

    return [
      {
        label: 'Today',
        value: today?.toISOString()?.split('T')?.[0],
        icon: 'Calendar'
      },
      {
        label: 'Yesterday',
        value: yesterday?.toISOString()?.split('T')?.[0],
        icon: 'CalendarMinus'
      },
      {
        label: 'Week ago',
        value: weekAgo?.toISOString()?.split('T')?.[0],
        icon: 'CalendarClock'
      }
    ];
  };

  const quickTimeOptions = [
    { label: 'Now', value: new Date()?.toTimeString()?.slice(0, 5) },
    { label: '9:00 AM', value: '09:00' },
    { label: '12:00 PM', value: '12:00' },
    { label: '6:00 PM', value: '18:00' },
    { label: '9:00 PM', value: '21:00' }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Date Picker */}
        <div className="space-y-2 relative">
          <label className="text-sm font-medium text-foreground">
            Date *
          </label>
          <button
            type="button"
            onClick={() => setShowDatePicker(!showDatePicker)}
            className={`w-full flex items-center justify-between p-3 bg-input border border-border rounded-lg hover:bg-muted transition-colors ${
              error ? 'border-error' : ''
            }`}
          >
            <div className="flex items-center space-x-2">
              <Icon name="Calendar" size={20} className="text-muted-foreground" />
              <span className={date ? 'text-foreground' : 'text-muted-foreground'}>
                {formatDisplayDate(date)}
              </span>
            </div>
            <Icon 
              name="ChevronDown" 
              size={20} 
              className={`text-muted-foreground transition-transform ${showDatePicker ? 'rotate-180' : ''}`} 
            />
          </button>

          {/* Date Picker Dropdown */}
          {showDatePicker && (
            <>
              <div 
                className="fixed inset-0 z-40"
                onClick={() => setShowDatePicker(false)}
              />
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-elevated z-50">
                <div className="p-4 space-y-3">
                  <div className="space-y-2">
                    {getQuickDateOptions()?.map((option) => (
                      <button
                        key={option?.value}
                        onClick={() => {
                          onDateChange(option?.value);
                          setShowDatePicker(false);
                        }}
                        className="w-full flex items-center space-x-3 p-2 rounded-md hover:bg-muted transition-colors text-left"
                      >
                        <Icon name={option?.icon} size={16} className="text-muted-foreground" />
                        <span className="text-foreground">{option?.label}</span>
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-border pt-3">
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => {
                        onDateChange(e?.target?.value);
                        setShowDatePicker(false);
                      }}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Time Picker */}
        <div className="space-y-2 relative">
          <label className="text-sm font-medium text-foreground">
            Time *
          </label>
          <button
            type="button"
            onClick={() => setShowTimePicker(!showTimePicker)}
            className={`w-full flex items-center justify-between p-3 bg-input border border-border rounded-lg hover:bg-muted transition-colors ${
              error ? 'border-error' : ''
            }`}
          >
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={20} className="text-muted-foreground" />
              <span className={time ? 'text-foreground' : 'text-muted-foreground'}>
                {formatDisplayTime(time)}
              </span>
            </div>
            <Icon 
              name="ChevronDown" 
              size={20} 
              className={`text-muted-foreground transition-transform ${showTimePicker ? 'rotate-180' : ''}`} 
            />
          </button>

          {/* Time Picker Dropdown */}
          {showTimePicker && (
            <>
              <div 
                className="fixed inset-0 z-40"
                onClick={() => setShowTimePicker(false)}
              />
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-elevated z-50">
                <div className="p-4 space-y-3">
                  <div className="space-y-2">
                    {quickTimeOptions?.map((option) => (
                      <button
                        key={option?.value}
                        onClick={() => {
                          onTimeChange(option?.value);
                          setShowTimePicker(false);
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-md hover:bg-muted transition-colors text-left"
                      >
                        <span className="text-foreground">{option?.label}</span>
                        <span className="text-muted-foreground text-sm">{option?.value}</span>
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-border pt-3">
                    <Input
                      type="time"
                      value={time}
                      onChange={(e) => {
                        onTimeChange(e?.target?.value);
                        setShowTimePicker(false);
                      }}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default DateTimePicker;