import React, { useState, useEffect } from 'react';
import { accountService } from '../../../services/accountService';
import { useAuth } from '../../../contexts/AuthContext';
import Notification from '../../../components/ui/Notification';
import ConfirmationDialog from '../../../components/ui/ConfirmationDialog';
import AccountForm from './AccountForm';
import AccountListItem from './AccountListItem';

const AccountManagement = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [editingAccount, setEditingAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchAccounts();
    }
  }, [user]);

  const fetchAccounts = async () => {
    setLoading(true);
    setError(null);
    const { data, success, error } = await accountService.getAccounts(user.id);
    if (success) {
      setAccounts(data);
    } else {
      setError(error);
      setNotification({ type: 'error', message: `Failed to load accounts: ${error}` });
    }
    setLoading(false);
  };

  const handleAddOrUpdateAccount = async (accountData) => {
    setLoading(true);
    let success, error;
    if (editingAccount) {
      ({ success, error } = await accountService.updateAccount(editingAccount.id, accountData));
    } else {
      ({ success, error } = await accountService.createAccount(accountData));
    }

    if (success) {
      setNotification({ type: 'success', message: `Account ${editingAccount ? 'updated' : 'added'} successfully!` });
      setEditingAccount(null);
      fetchAccounts();
    } else {
      setNotification({ type: 'error', message: `Failed to ${editingAccount ? 'update' : 'add'} account: ${error}` });
    }
    setLoading(false);
  };

  const handleEditAccount = (account) => {
    setEditingAccount({ ...account, balance: parseFloat(account.balance) });
  };

  const handleDeleteAccount = (accountId) => {
    setAccountToDelete(accountId);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    setShowConfirmDialog(false);
    if (accountToDelete) {
      setLoading(true);
      const { success, error } = await accountService.deleteAccount(accountToDelete);
      if (success) {
        setNotification({ type: 'success', message: 'Account deleted successfully!' });
        fetchAccounts();
      } else {
        setNotification({ type: 'error', message: `Failed to delete account: ${error}` });
      }
      setAccountToDelete(null);
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setAccountToDelete(null);
  };

  if (loading) {
    return <div className="text-center py-4">Loading accounts...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-error">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-foreground">Manage Accounts</h2>

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <AccountForm
        initialData={editingAccount}
        onSave={handleAddOrUpdateAccount}
        onCancel={() => setEditingAccount(null)}
        userId={user?.id}
      />

      {/* Account List */}
      <div className="bg-card rounded-xl p-6 shadow-soft border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Your Accounts</h3>
        {accounts.length === 0 ? (
          <p className="text-muted-foreground">No accounts found. Add your first account above!</p>
        ) : (
          <div className="space-y-4">
            {accounts.map((account) => (
              <AccountListItem
                key={account.id}
                account={account}
                onEdit={handleEditAccount}
                onDelete={handleDeleteAccount}
              />
            ))}
          </div>
        )}
      </div>

      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        title="Delete Account"
        message="Are you sure you want to delete this account? This action cannot be undone."
      />
    </div>
  );
};

export default AccountManagement;