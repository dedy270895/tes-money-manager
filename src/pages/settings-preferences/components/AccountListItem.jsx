import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { formatCurrency } from '../../../utils/currency';

const AccountListItem = ({ account, onEdit, onDelete }) => {

  return (
    <div
      key={account.id}
      className="flex items-center justify-between p-4 bg-background-light rounded-lg border border-border"
    >
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-10 h-10 bg-muted rounded-lg">
          <Icon name="Wallet" size={20} className="text-muted-foreground" /> {/* Placeholder icon */}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{account.name}</p>
          <p className="text-xs text-muted-foreground capitalize">{account.account_type}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-foreground">
          {formatCurrency(account.balance)}
        </p>
        <div className="flex space-x-2 mt-1">
          <Button variant="ghost" size="sm" onClick={() => onEdit(account)}>
            Edit
          </Button>
          <Button variant="ghost" size="sm" className="text-error" onClick={() => onDelete(account.id)}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountListItem;
