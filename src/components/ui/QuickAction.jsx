import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const QuickAction = ({ className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const quickActions = [
    {
      label: 'Add Expense',
      icon: 'Minus',
      color: 'bg-error hover:bg-error/90',
      action: () => navigate('/add-edit-transaction?type=expense')
    },
    {
      label: 'Add Income',
      icon: 'Plus',
      color: 'bg-success hover:bg-success/90',
      action: () => navigate('/add-edit-transaction?type=income')
    },
    {
      label: 'Transfer',
      icon: 'ArrowLeftRight',
      color: 'bg-primary hover:bg-primary/90',
      action: () => navigate('/add-edit-transaction?type=transfer')
    }
  ];

  const handleActionClick = (action) => {
    action();
    setIsExpanded(false);
  };

  return (
    <>
      {/* Desktop Version - Horizontal Button Group */}
      <div className={`hidden md:flex items-center space-x-2 ${className}`}>
        {quickActions?.map((action, index) => (
          <Button
            key={index}
            onClick={action?.action}
            className={`${action?.color} text-white shadow-soft`}
            size="sm"
          >
            <Icon name={action?.icon} size={16} className="mr-2" />
            {action?.label}
          </Button>
        ))}
      </div>
      {/* Mobile Version - Floating Action Button */}
      <div className="md:hidden">
        {/* Backdrop */}
        {isExpanded && (
          <div 
            className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40"
            onClick={() => setIsExpanded(false)}
          />
        )}

        {/* Expanded Action Buttons */}
        {isExpanded && (
          <div className="fixed bottom-20 right-6 z-50 space-y-3 animate-slide-up">
            {quickActions?.map((action, index) => (
              <div
                key={index}
                className="flex items-center space-x-3"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="bg-card text-foreground px-3 py-2 rounded-lg shadow-elevated text-sm font-medium whitespace-nowrap">
                  {action?.label}
                </span>
                <button
                  onClick={() => handleActionClick(action?.action)}
                  className={`w-12 h-12 rounded-full ${action?.color} text-white shadow-elevated flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95`}
                >
                  <Icon name={action?.icon} size={20} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Main FAB */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`fab w-14 h-14 bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center transition-all duration-300 ${
            isExpanded ? 'rotate-45' : 'rotate-0'
          }`}
        >
          <Icon name="Plus" size={24} />
        </button>
      </div>
    </>
  );
};

export default QuickAction;