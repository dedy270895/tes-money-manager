import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BudgetCard = ({ budget, profile, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editAmount, setEditAmount] = useState(budget?.amount);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: profile?.currency || 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const spentPercentage = (budget?.spent / budget?.amount) * 100;
  const remainingAmount = budget?.amount - budget?.spent;

  const getProgressColor = () => {
    if (spentPercentage >= 100) return 'bg-error';
    if (spentPercentage >= 80) return 'bg-warning';
    return 'bg-success';
  };

  const getStatusColor = () => {
    if (spentPercentage >= 100) return 'text-error';
    if (spentPercentage >= 80) return 'text-warning';
    return 'text-success';
  };

  const handleSaveEdit = () => {
    onEdit(budget?.id, { amount: parseFloat(editAmount) });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditAmount(budget?.amount);
    setIsEditing(false);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg ${budget?.categories?.color} flex items-center justify-center`}>
            <Icon name={budget?.categories?.icon} size={20} color="white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{budget?.categories?.name}</h3>
            <p className="text-sm text-muted-foreground">{budget?.name}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
            className="w-8 h-8"
          >
            <Icon name="Edit2" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(budget?.id)}
            className="w-8 h-8 text-error hover:text-error"
          >
            <Icon name="Trash2" size={16} />
          </Button>
        </div>
      </div>
      {/* Budget Amount */}
      <div className="mb-4">
        {isEditing ? (
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <input
                type="number"
                value={editAmount}
                onChange={(e) => setEditAmount(e?.target?.value)}
                className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                step="0.01"
                min="0"
              />
            </div>
            <Button variant="default" size="sm" onClick={handleSaveEdit}>
              <Icon name="Check" size={16} />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
              <Icon name="X" size={16} />
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-foreground">
              {formatCurrency(budget?.amount)}
            </span>
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {spentPercentage?.toFixed(1)}% used
            </span>
          </div>
        )}
      </div>
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Spent: {formatCurrency(budget?.spent)}</span>
          <span>Remaining: {formatCurrency(remainingAmount)}</span>
        </div>
        <div className="w-full bg-muted rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${Math.min(spentPercentage, 100)}%` }}
          />
        </div>
      </div>
      {/* Status Message */}
      {spentPercentage >= 100 && (
        <div className="flex items-center space-x-2 p-3 bg-error/10 border border-error/20 rounded-lg">
          <Icon name="AlertTriangle" size={16} className="text-error" />
          <span className="text-sm text-error font-medium">
            Budget exceeded by {formatCurrency(budget?.spent - budget?.amount)}
          </span>
        </div>
      )}
      {spentPercentage >= 80 && spentPercentage < 100 && (
        <div className="flex items-center space-x-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
          <Icon name="AlertCircle" size={16} className="text-warning" />
          <span className="text-sm text-warning font-medium">
            Approaching budget limit
          </span>
        </div>
      )}
    </div>
  );
};

export default BudgetCard;