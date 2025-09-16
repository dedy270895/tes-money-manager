import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

import { categoryService } from '../../../services/categoryService';

const CreateBudgetModal = ({ isOpen, onClose, onSave, profile }) => {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    period: 'monthly',
    start_date: new Date().toISOString().split('T')[0],
    end_date: null,
    category_id: '',
  });

  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const { user } = useAuth();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: profile?.currency || 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      if (user?.id) {
        const { data, error } = await categoryService.getCategories(user.id);
        if (error) {
          console.error('Error fetching categories:', error);
        } else {
          setCategories(data || []);
        }
      }
    };

    if (isOpen && user) {
      fetchCategories();
    }
  }, [isOpen, user]);

  const suggestedAmounts = [100, 200, 300, 500, 750, 1000, 1500, 2000];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCategorySelect = (category) => {
    setFormData(prev => ({
      ...prev,
      category_id: category?.id,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.category_id) {
      newErrors.category_id = 'Category is required';
    }

    if (!formData?.amount || parseFloat(formData?.amount) <= 0) {
      newErrors.amount = 'Budget amount must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      const newBudget = {
        category_id: formData?.category_id,
        name: formData?.name,
        amount: parseFloat(formData?.amount),
        period: formData?.period,
        start_date: formData?.start_date,
        end_date: formData?.end_date,
        is_active: true,
      };
      onSave(newBudget);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      amount: '',
      period: 'monthly',
      start_date: new Date().toISOString().split('T')[0],
      end_date: null,
      category_id: '',
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-elevated w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Create New Budget</h2>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Select Category
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories?.map((category) => (
                <button
                  key={category?.id}
                  type="button"
                  onClick={() => handleCategorySelect(category)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                    formData?.category_id === category?.id
                      ? 'border-primary bg-primary/10' :'border-border hover:border-muted-foreground'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`w-8 h-8 rounded-lg ${category?.color} flex items-center justify-center`}>
                      <Icon name={category?.icon} size={16} color="white" />
                    </div>
                    <span className="font-medium text-foreground text-sm">{category?.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{category?.description}</p>
                </button>
              ))}
            </div>
            {errors?.category_id && (
              <p className="text-sm text-error mt-1">{errors?.category_id}</p>
            )}
          </div>

          {/* Budget Amount */}
          <div>
            <Input
              label="Budget Amount"
              type="number"
              value={formData?.amount}
              onChange={(e) => handleInputChange('amount', e?.target?.value)}
              placeholder="0.00"
              error={errors?.amount}
              step="0.01"
              min="0"
            />
            <div className="mt-2">
              <p className="text-sm text-muted-foreground mb-2">Suggested amounts:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedAmounts?.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handleInputChange('amount', amount?.toString())}
                    className="px-3 py-1 text-sm bg-muted hover:bg-muted-foreground/10 text-foreground rounded-full transition-colors duration-200"
                  >
                    {formatCurrency(amount)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Name (formerly Description) */}
          <Input
            label="Budget Name (Optional)"
            type="text"
            value={formData?.name}
            onChange={(e) => handleInputChange('name', e?.target?.value)}
            placeholder="Brief name for this budget"
          />

          {/* Period Selection (New) */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Budget Period
            </label>
            <select
              value={formData?.period}
              onChange={(e) => handleInputChange('period', e.target.value)}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="yearly">Yearly</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {/* Start Date (New) */}
          <Input
            label="Start Date"
            type="date"
            value={formData?.start_date}
            onChange={(e) => handleInputChange('start_date', e?.target?.value)}
            error={errors?.start_date}
          />

          {/* End Date (New, Optional) */}
          <Input
            label="End Date (Optional)"
            type="date"
            value={formData?.end_date || ''}
            onChange={(e) => handleInputChange('end_date', e?.target?.value || null)}
            error={errors?.end_date}
          />

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="default">
              Create Budget
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBudgetModal;