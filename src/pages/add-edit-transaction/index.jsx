import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Header from '../../components/ui/Header';
import TransactionTypeSelector from './components/TransactionTypeSelector';
import AmountInput from './components/AmountInput';
import CategorySelector from './components/CategorySelector';
import AccountSelector from './components/AccountSelector';
import DateTimePicker from './components/DateTimePicker';
import PhotoAttachment from './components/PhotoAttachment';
import RecurringSettings from './components/RecurringSettings';
import TransactionPreview from './components/TransactionPreview';
import { transactionService } from '../../services/transactionService';
import { useAuth } from '../../contexts/AuthContext';
import Notification from '../../components/ui/Notification';

const AddEditTransaction = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const transactionId = searchParams.get('id');
  const initialType = searchParams.get('type') || 'expense';

  // Form state
  const [transactionType, setTransactionType] = useState(initialType);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(null);
  const [fromAccount, setFromAccount] = useState(null);
  const [toAccount, setToAccount] = useState(null);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));
  const [photos, setPhotos] = useState([]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringData, setRecurringData] = useState(null);
  const [tags, setTags] = useState('');
  const [notes, setNotes] = useState('');

  // UI state
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState(null); // { message: '', type: 'success' | 'error' }

  // Load transaction data for edit mode
  useEffect(() => {
    if (transactionId) {
      setIsLoading(true);
      transactionService.getTransactionById(transactionId)
        .then(transaction => {
          setTransactionType(transaction.transaction_type);
          setAmount(transaction.amount.toString());
          setCategory(transaction.category);
          setFromAccount(transaction.from_account);
          setToAccount(transaction.to_account);
          setDescription(transaction.description);
          const transactionDate = new Date(transaction.transaction_date);
          setDate(transactionDate.toISOString().split('T')[0]);
          setTime(transactionDate.toTimeString().slice(0, 5));
          setNotes(transaction.notes || '');
          setPhotos(transaction.receipt_urls ? transaction.receipt_urls.map((url, index) => ({
            id: `loaded-${index}-${Date.now()}`, // Unique ID for loaded photos
            file: null, // No file object for loaded photos
            url: url,
            name: url.substring(url.lastIndexOf('/') + 1), // Extract name from URL
            size: 0, // Size not available for loaded photos
            status: 'completed',
            storagePath: null, // Storage path not directly available for loaded photos
            publicUrl: url,
          })) : []);
        })
        .catch(error => {
          console.error('Failed to load transaction:', error);
          // Handle error (e.g., show a notification)
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [transactionId]);

  // Reset form when transaction type changes
  useEffect(() => {
    if (transactionType === 'transfer') {
      setCategory(null);
    } else {
      setToAccount(null);
    }
  }, [transactionType]);

  const validateForm = () => {
    const newErrors = {};

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (transactionType !== 'transfer' && !category) {
      newErrors.category = 'Please select a category';
    }

    if (!fromAccount && transactionType === 'expense') {
      newErrors.fromAccount = 'Please select an account';
    }

    if (!toAccount && transactionType === 'income') {
      newErrors.toAccount = 'Please select an account';
    }

    if (transactionType === 'transfer') {
      if (!fromAccount) {
        newErrors.fromAccount = 'Please select source account';
      }
      if (!toAccount) {
        newErrors.toAccount = 'Please select destination account';
      }
      if (fromAccount && toAccount && fromAccount?.id === toAccount?.id) {
        newErrors.toAccount = 'Source and destination accounts must be different';
      }
    }

    if (!date) {
      newErrors.date = 'Please select a date';
    }

    if (!time) {
      newErrors.time = 'Please select a time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      const transactionDateTime = new Date(`${date}T${time}:00.000Z`);

      const transactionData = {
        user_id: user.id,
        transaction_type: transactionType,
        amount: parseFloat(amount),
        category_id: category?.id,
        account_id: fromAccount?.id,
        to_account_id: toAccount?.id,
        description,
        transaction_date: transactionDateTime.toISOString(),
        notes,
        receipt_urls: photos.filter(p => p.status === 'completed' && p.publicUrl).map(p => p.publicUrl),
      };

      if (transactionId) {
        await transactionService.updateTransaction(transactionId, transactionData);
      } else {
        await transactionService.createTransaction(transactionData);
      }

      setNotification({ message: `Transaction ${transactionId ? 'updated' : 'created'} successfully!`, type: 'success' });
      setTimeout(() => navigate('/transaction-management'), 2000); // Navigate after 2 seconds
    } catch (error) {
      console.error('Error saving transaction:', error);
      setErrors({ submit: 'Failed to save transaction. Please try again.' });
      setNotification({ message: 'Failed to save transaction. Please try again.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const getSuggestions = () => {
    const suggestions = [
      'Grocery shopping',
      'Gas station',
      'Coffee shop',
      'Restaurant',
      'Online purchase',
      'Utility bill',
      'Rent payment',
      'Salary deposit',
      'Freelance payment',
      'Investment return'
    ];
    
    return suggestions?.filter(suggestion => 
      suggestion?.toLowerCase()?.includes(description?.toLowerCase()) && 
      suggestion?.toLowerCase() !== description?.toLowerCase()
    )?.slice(0, 3);
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground">Loading transaction...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-16 z-40 bg-background border-b border-border">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCancel}
              >
                <Icon name="ArrowLeft" size={20} />
              </Button>
              <h1 className="text-lg font-semibold text-foreground">
                {transactionId ? 'Edit Transaction' : 'Add Transaction'}
              </h1>
            </div>
            <Button
              onClick={handleSave}
              loading={isSaving}
              disabled={!amount || (!category && transactionType !== 'transfer')}
              size="sm"
            >
              Save
            </Button>
          </div>
        </div>

        <div className="flex">
          {/* Main Form */}
          <div className="flex-1 max-w-4xl mx-auto p-4 lg:p-6">
            {/* Desktop Header */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCancel}
                >
                  <Icon name="ArrowLeft" size={20} />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    {transactionId ? 'Edit Transaction' : 'Add Transaction'}
                  </h1>
                  <p className="text-muted-foreground">
                    {transactionId ? 'Update your transaction details' : 'Record a new financial transaction'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  loading={isSaving}
                  disabled={!amount || (!category && transactionType !== 'transfer')}
                >
                  <Icon name="Save" size={16} className="mr-2" />
                  {transactionId ? 'Update' : 'Save'} Transaction
                </Button>
              </div>
            </div>

            <div className="flex gap-6">
              {/* Form Content */}
              <div className="flex-1 space-y-6">
                {/* Transaction Type Selector */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Transaction Type</h2>
                  <TransactionTypeSelector
                    selectedType={transactionType}
                    onTypeChange={setTransactionType}
                  />
                </div>

                {/* Amount & Basic Details */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Amount & Details</h2>
                  <div className="space-y-4">
                    <AmountInput
                      amount={amount}
                      onAmountChange={setAmount}
                      transactionType={transactionType}
                      error={errors?.amount}
                    />

                    {transactionType !== 'transfer' && (
                      <CategorySelector
                        selectedCategory={category}
                        onCategoryChange={setCategory}
                        transactionType={transactionType}
                        error={errors?.category}
                      />
                    )}

                    <Input
                      label="Description"
                      value={description}
                      onChange={(e) => setDescription(e?.target?.value)}
                      placeholder="Enter transaction description"
                      description={getSuggestions()?.length > 0 ? `Suggestions: ${getSuggestions()?.join(', ')}` : ''}
                    />
                  </div>
                </div>

                {/* Account Selection */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    {transactionType === 'transfer' ? 'Account Transfer' : 'Account'}
                  </h2>
                  <div className="space-y-4">
                    {transactionType === 'transfer' ? (
                      <>
                        <AccountSelector
                          selectedAccount={fromAccount}
                          onAccountChange={setFromAccount}
                          label="From Account"
                          error={errors?.fromAccount}
                        />
                        <div className="flex justify-center">
                          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                            <Icon name="ArrowDown" size={16} className="text-muted-foreground" />
                          </div>
                        </div>
                        <AccountSelector
                          selectedAccount={toAccount}
                          onAccountChange={setToAccount}
                          label="To Account"
                          error={errors?.toAccount}
                        />
                      </>
                    ) : (
                      <AccountSelector
                        selectedAccount={transactionType === 'income' ? toAccount : fromAccount}
                        onAccountChange={transactionType === 'income' ? setToAccount : setFromAccount}
                        label="Account"
                        error={errors?.fromAccount || errors?.toAccount}
                      />
                    )}
                  </div>
                </div>

                {/* Date & Time */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Date & Time</h2>
                  <DateTimePicker
                    date={date}
                    time={time}
                    onDateChange={setDate}
                    onTimeChange={setTime}
                    error={errors?.date || errors?.time}
                  />
                </div>

                {/* Additional Details */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Additional Details</h2>
                  <div className="space-y-4">
                    <Input
                      label="Tags"
                      value={tags}
                      onChange={(e) => setTags(e?.target?.value)}
                      placeholder="Enter tags separated by commas"
                      description="Use tags to organize and search your transactions"
                    />

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Notes
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e?.target?.value)}
                        placeholder="Add any additional notes about this transaction"
                        rows={3}
                        className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Photo Attachment */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Attachments</h2>
                  <PhotoAttachment
                    photos={photos}
                    onPhotosChange={setPhotos}
                  />
                </div>

                {/* Recurring Settings */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Recurring Transaction</h2>
                  <RecurringSettings
                    isRecurring={isRecurring}
                    onRecurringChange={setIsRecurring}
                    recurringData={recurringData}
                    onRecurringDataChange={setRecurringData}
                  />
                </div>

                {/* Error Display */}
                {errors?.submit && (
                  <div className="bg-error/10 border border-error rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Icon name="AlertCircle" size={20} className="text-error" />
                      <p className="text-error font-medium">{errors?.submit}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Desktop Preview Sidebar */}
              <TransactionPreview
                transactionType={transactionType}
                amount={amount}
                category={category}
                fromAccount={fromAccount}
                toAccount={toAccount}
                description={description}
                date={date}
                time={time}
              />
            </div>
          </div>
        </div>

        {/* Mobile Save Button */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
          <Button
            onClick={handleSave}
            loading={isSaving}
            disabled={!amount || (!category && transactionType !== 'transfer')}
            fullWidth
            size="lg"
          >
            <Icon name="Save" size={20} className="mr-2" />
            {transactionId ? 'Update' : 'Save'} Transaction
          </Button>
        </div>

        {/* Mobile spacing for fixed button */}
        <div className="lg:hidden h-20" />
      </div>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </>
  );
};

export default AddEditTransaction;