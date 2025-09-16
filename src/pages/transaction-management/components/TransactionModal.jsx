import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import PhotoAttachment from '../../add-edit-transaction/components/PhotoAttachment';
import { categoryService } from '../../../services/categoryService';
import { accountService } from '../../../services/accountService';
import { useAuth } from '../../../contexts/AuthContext';

const TransactionModal = ({ 
  isOpen, 
  onClose, 
  transaction = null, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    type: 'expense',
    description: '',
    amount: '',
    category: '',
    fromAccount: '',
    toAccount: '',
    date: new Date()?.toISOString()?.split('T')?.[0],
    notes: ''
  });
  const [photos, setPhotos] = useState([]);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const [allAccounts, setAllAccounts] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const { data: categoriesData, error: categoriesError } = await categoryService.getCategories(user.id);
        if (categoriesError) throw categoriesError;
        setAllCategories(categoriesData);

        const { data: accountsData, error: accountsError } = await accountService.getAccounts(user.id);
        if (accountsError) throw accountsError;
        setAllAccounts(accountsData);
      } catch (err) {
        console.error('Failed to fetch categories or accounts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [user]);

  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction?.transaction_type,
        description: transaction?.description,
        amount: Math.abs(transaction?.amount)?.toString(),
        category: transaction?.category?.id || '',
        fromAccount: transaction?.from_account?.id || '',
        toAccount: transaction?.to_account?.id || '',
        date: new Date(transaction.transaction_date)?.toISOString()?.split('T')?.[0],
        notes: transaction?.notes || ''
      });
      setPhotos(transaction.receipt_urls ? transaction.receipt_urls.map((url, index) => ({
        id: `loaded-${index}-${Date.now()}`,
        file: null,
        url: url,
        name: url.substring(url.lastIndexOf('/') + 1),
        size: 0,
        status: 'completed',
        storagePath: null,
        publicUrl: url,
      })) : []);
    } else {
      setFormData({
        type: 'expense',
        description: '',
        amount: '',
        category: '',
        fromAccount: '',
        toAccount: '',
        date: new Date()?.toISOString()?.split('T')?.[0],
        notes: ''
      });
      setPhotos([]);
    }
    setErrors({});
  }, [transaction, isOpen]);

  const transactionTypes = [
    { value: 'expense', label: 'Expense' },
    { value: 'income', label: 'Income' },
    { value: 'transfer', label: 'Transfer' }
  ];

  const getCategoriesByType = (type) => {
    const filtered = allCategories.filter(cat => cat.category_type === type);
    return filtered.map(cat => ({ value: cat.id, label: cat.name }));
  };

  const getAccountsAsOptions = () => {
    return allAccounts.map(acc => ({ value: acc.id, label: acc.name }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.description?.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData?.amount || parseFloat(formData?.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (formData.type !== 'transfer' && !formData?.category) {
      newErrors.category = 'Category is required';
    }

    if (formData.type === 'expense' && !formData.fromAccount) {
      newErrors.fromAccount = 'Account is required';
    }

    if (formData.type === 'income' && !formData.toAccount) {
      newErrors.toAccount = 'Account is required';
    }

    if (formData.type === 'transfer') {
      if (!formData.fromAccount) newErrors.fromAccount = 'Source account is required';
      if (!formData.toAccount) newErrors.toAccount = 'Destination account is required';
      if (formData.fromAccount && formData.toAccount && formData.fromAccount === formData.toAccount) {
        newErrors.toAccount = 'Accounts must be different';
      }
    }

    if (!formData?.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const transactionData = {
        transaction_type: formData.type,
        description: formData.description,
        amount: parseFloat(formData.amount),
        category_id: formData.type !== 'transfer' ? formData.category : null,
        account_id: formData.type === 'income' ? formData.toAccount : formData.fromAccount,
        to_account_id: formData.type === 'transfer' ? formData.toAccount : null,
        transaction_date: formData.date,
        notes: formData.notes,
        receipt_urls: photos.filter(p => p.status === 'completed' && p.publicUrl).map(p => p.publicUrl),
      };

      await onSave(transactionData);
      onClose();
    } catch (error) {
      console.error('Error saving transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="bg-card border border-border rounded-lg shadow-elevated max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <h2 className="text-xl font-semibold text-foreground">
          {transaction ? 'Edit Transaction' : 'Add Transaction'}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
        >
          <Icon name="X" size={20} />
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Transaction Type */}
        <Select
          label="Transaction Type"
          options={transactionTypes}
          value={formData.type}
          onChange={(value) => {
            handleInputChange('type', value);
            handleInputChange('category', '');
          }}
          required
        />

        {/* Description */}
        <Input
          label="Description"
          type="text"
          placeholder="Enter transaction description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          error={errors.description}
          required
        />

        {/* Amount */}
        <Input
          label="Amount"
          type="number"
          placeholder="0.00"
          value={formData.amount}
          onChange={(e) => handleInputChange('amount', e.target.value)}
          error={errors.amount}
          required
          min="0"
          step="0.01"
        />

        {/* Category */}
        {formData.type !== 'transfer' && (
          <Select
            label="Category"
            options={getCategoriesByType(formData.type)}
            value={formData.category}
            onChange={(value) => handleInputChange('category', value)}
            error={errors.category}
            required
            searchable
          />
        )}

        {/* Account Selection */}
        {formData.type === 'transfer' ? (
          <>
            <Select
              label="From Account"
              options={getAccountsAsOptions()}
              value={formData.fromAccount}
              onChange={(value) => handleInputChange('fromAccount', value)}
              error={errors.fromAccount}
              required
            />
            <Select
              label="To Account"
              options={getAccountsAsOptions()}
              value={formData.toAccount}
              onChange={(value) => handleInputChange('toAccount', value)}
              error={errors.toAccount}
              required
            />
          </>
        ) : (
          <Select
            label="Account"
            options={getAccountsAsOptions()}
            value={formData.type === 'income' ? formData.toAccount : formData.fromAccount}
            onChange={(value) => {
              const field = formData.type === 'income' ? 'toAccount' : 'fromAccount';
              handleInputChange(field, value);
            }}
            error={errors.fromAccount || errors.toAccount}
            required
          />
        )}

        {/* Date */}
        <Input
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => handleInputChange('date', e.target.value)}
          error={errors.date}
          required
        />

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Notes (Optional)
          </label>
          <textarea
            placeholder="Add any additional notes..."
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
        </div>

        {/* Photo Attachment */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Attachments</h2>
          <PhotoAttachment
            photos={photos}
            onPhotosChange={setPhotos}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            className="bg-primary text-primary-foreground"
          >
            {transaction ? 'Update Transaction' : 'Add Transaction'}
          </Button>
        </div>
      </form>
    </div>
  );

  // Mobile: Full screen modal
  if (window.innerWidth < 768) {
    return (
      <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
        <div className="min-h-full">
          {modalContent}
        </div>
      </div>
    );
  }

  // Desktop: Centered modal
  return (
    <>
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {modalContent}
      </div>
    </>
  );
};

export default TransactionModal;