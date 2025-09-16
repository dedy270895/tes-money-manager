import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const AccountForm = ({ initialData, onSave, onCancel, userId }) => {
  const [formData, setFormData] = useState(initialData || { name: '', balance: 0, account_type: 'checking' });

  const accountTypes = [
    { value: 'checking', label: 'Checking' },
    { value: 'savings', label: 'Savings' },
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'cash', label: 'Cash' },
    { value: 'investment', label: 'Investment' },
    { value: 'loan', label: 'Loan' },
    { value: 'other', label: 'Other' },
  ];

  useEffect(() => {
    setFormData(initialData || { name: '', balance: 0, account_type: 'checking' });
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (value) => {
    setFormData({ ...formData, account_type: value });
  };

  const handleSubmit = () => {
    onSave({ ...formData, user_id: userId, balance: parseFloat(formData.balance) });
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-soft border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        {initialData ? 'Edit Account' : 'Add New Account'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Account Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="e.g., Main Checking, Savings"
        />
        <Input
          label="Initial/Current Balance"
          name="balance"
          type="number"
          value={formData.balance}
          onChange={handleInputChange}
          placeholder="0.00"
        />
        <Select
          label="Account Type"
          name="account_type"
          value={formData.account_type}
          options={accountTypes}
          onChange={handleSelectChange}
        />
      </div>
      <div className="mt-6 flex justify-end space-x-2">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button onClick={handleSubmit}>
          {initialData ? 'Update Account' : 'Add Account'}
        </Button>
      </div>
    </div>
  );
};

export default AccountForm;