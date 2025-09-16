import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const NotificationSettings = () => {
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [budgetThreshold, setBudgetThreshold] = useState('80');
  const [transactionReminders, setTransactionReminders] = useState(false);
  const [reminderFrequency, setReminderFrequency] = useState('daily');
  const [spendingSummary, setSpendingSummary] = useState(true);
  const [summaryFrequency, setSummaryFrequency] = useState('weekly');
  const [goalNotifications, setGoalNotifications] = useState(true);
  const [billReminders, setBillReminders] = useState(false);
  const [billReminderDays, setBillReminderDays] = useState('3');
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);

  const thresholdOptions = [
    { value: '50', label: '50% of budget' },
    { value: '70', label: '70% of budget' },
    { value: '80', label: '80% of budget' },
    { value: '90', label: '90% of budget' },
    { value: '100', label: '100% of budget (exceeded)' }
  ];

  const frequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  const reminderDaysOptions = [
    { value: '1', label: '1 day before' },
    { value: '3', label: '3 days before' },
    { value: '7', label: '1 week before' },
    { value: '14', label: '2 weeks before' }
  ];

  const notificationTypes = [
    {
      id: 'budget',
      title: 'Budget Alerts',
      description: 'Get notified when you approach or exceed your budget limits',
      icon: 'Target',
      enabled: budgetAlerts,
      setEnabled: setBudgetAlerts,
      hasSettings: true,
      settings: (
        <Select
          label="Alert Threshold"
          options={thresholdOptions}
          value={budgetThreshold}
          onChange={setBudgetThreshold}
          className="mt-3"
        />
      )
    },
    {
      id: 'transactions',
      title: 'Transaction Reminders',
      description: 'Remind you to log transactions you might have missed',
      icon: 'Bell',
      enabled: transactionReminders,
      setEnabled: setTransactionReminders,
      hasSettings: true,
      settings: (
        <Select
          label="Reminder Frequency"
          options={frequencyOptions}
          value={reminderFrequency}
          onChange={setReminderFrequency}
          className="mt-3"
        />
      )
    },
    {
      id: 'summary',
      title: 'Spending Summary',
      description: 'Receive periodic summaries of your spending patterns',
      icon: 'BarChart3',
      enabled: spendingSummary,
      setEnabled: setSpendingSummary,
      hasSettings: true,
      settings: (
        <Select
          label="Summary Frequency"
          options={frequencyOptions}
          value={summaryFrequency}
          onChange={setSummaryFrequency}
          className="mt-3"
        />
      )
    },
    {
      id: 'goals',
      title: 'Goal Notifications',
      description: 'Updates on your progress towards financial goals',
      icon: 'Trophy',
      enabled: goalNotifications,
      setEnabled: setGoalNotifications,
      hasSettings: false
    },
    {
      id: 'bills',
      title: 'Bill Reminders',
      description: 'Never miss a bill payment with timely reminders',
      icon: 'Calendar',
      enabled: billReminders,
      setEnabled: setBillReminders,
      hasSettings: true,
      settings: (
        <Select
          label="Remind Me"
          options={reminderDaysOptions}
          value={billReminderDays}
          onChange={setBillReminderDays}
          className="mt-3"
        />
      )
    }
  ];

  useEffect(() => {
    // Load saved preferences
    const savedPreferences = localStorage.getItem('notificationPreferences');
    if (savedPreferences) {
      const preferences = JSON.parse(savedPreferences);
      setBudgetAlerts(preferences?.budgetAlerts ?? true);
      setBudgetThreshold(preferences?.budgetThreshold ?? '80');
      setTransactionReminders(preferences?.transactionReminders ?? false);
      setReminderFrequency(preferences?.reminderFrequency ?? 'daily');
      setSpendingSummary(preferences?.spendingSummary ?? true);
      setSummaryFrequency(preferences?.summaryFrequency ?? 'weekly');
      setGoalNotifications(preferences?.goalNotifications ?? true);
      setBillReminders(preferences?.billReminders ?? false);
      setBillReminderDays(preferences?.billReminderDays ?? '3');
      setEmailNotifications(preferences?.emailNotifications ?? false);
      setPushNotifications(preferences?.pushNotifications ?? true);
    }
  }, []);

  const savePreferences = () => {
    const preferences = {
      budgetAlerts,
      budgetThreshold,
      transactionReminders,
      reminderFrequency,
      spendingSummary,
      summaryFrequency,
      goalNotifications,
      billReminders,
      billReminderDays,
      emailNotifications,
      pushNotifications
    };
    localStorage.setItem('notificationPreferences', JSON.stringify(preferences));
  };

  const testNotification = () => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('MoneyTracker Test', {
          body: 'This is a test notification from MoneyTracker!',
          icon: '/favicon.ico'
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission()?.then(permission => {
          if (permission === 'granted') {
            new Notification('MoneyTracker Test', {
              body: 'This is a test notification from MoneyTracker!',
              icon: '/favicon.ico'
            });
          }
        });
      }
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="Bell" size={20} className="text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
          <p className="text-sm text-muted-foreground">Manage how and when you receive notifications</p>
        </div>
      </div>
      <div className="space-y-6">
        {/* Notification Delivery Methods */}
        <div>
          <h4 className="font-medium text-foreground mb-4">Delivery Methods</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon name="Smartphone" size={20} className="text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive notifications on this device</p>
                </div>
              </div>
              <Checkbox
                checked={pushNotifications}
                onChange={(e) => setPushNotifications(e?.target?.checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon name="Mail" size={20} className="text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
              </div>
              <Checkbox
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e?.target?.checked)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={testNotification}
                iconName="TestTube"
                iconPosition="left"
              >
                Test Notification
              </Button>
              <span className="text-xs text-muted-foreground">
                Send a test notification to verify settings
              </span>
            </div>
          </div>
        </div>

        {/* Notification Types */}
        <div>
          <h4 className="font-medium text-foreground mb-4">Notification Types</h4>
          <div className="space-y-4">
            {notificationTypes?.map((type) => (
              <div key={type?.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mt-1">
                      <Icon name={type?.icon} size={16} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-foreground">{type?.title}</h5>
                        <Checkbox
                          checked={type?.enabled}
                          onChange={(e) => type?.setEnabled(e?.target?.checked)}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{type?.description}</p>
                      
                      {type?.hasSettings && type?.enabled && (
                        <div className="mt-3">
                          {type?.settings}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quiet Hours */}
        <div>
          <h4 className="font-medium text-foreground mb-4">Quiet Hours</h4>
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-medium text-foreground">Do Not Disturb</p>
                <p className="text-sm text-muted-foreground">Pause notifications during specified hours</p>
              </div>
              <Checkbox
               
                onChange={() => {}}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 opacity-50">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">From</label>
                <input
                  type="time"
                  value="22:00"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">To</label>
                <input
                  type="time"
                  value="08:00"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  disabled
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Settings */}
        <div className="pt-4 border-t border-border">
          <Button
            onClick={savePreferences}
            iconName="Save"
            iconPosition="left"
          >
            Save Notification Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;