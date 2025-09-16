import { supabase } from '../lib/supabase';
import { handleSupabaseRequest } from './apiHelper';

export const accountService = {
  async getAccounts(userId) {
    const request = supabase
      .from('accounts')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    return handleSupabaseRequest(request, 'Failed to load accounts');
  },

  async getAccountById(accountId) {
    const request = supabase
      .from('accounts')
      .select('*')
      .eq('id', accountId)
      .single();
    return handleSupabaseRequest(request, 'Failed to load account by ID');
  },

  async createAccount(accountData) {
    const request = supabase.from('accounts').insert(accountData).select().single();
    return handleSupabaseRequest(request, 'Failed to create account');
  },

  async updateAccount(accountId, updates) {
    const request = supabase
      .from('accounts')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', accountId)
      .select()
      .single();
    return handleSupabaseRequest(request, 'Failed to update account');
  },

  async deleteAccount(accountId) {
    const request = supabase
      .from('accounts')
      .update({ is_active: false })
      .eq('id', accountId);
    return handleSupabaseRequest(request, 'Failed to delete account');
  },

  async getTotalBalance(userId) {
    const request = supabase.from('accounts').select('balance, account_type').eq('user_id', userId).eq('is_active', true);
    const { success, data, error } = await handleSupabaseRequest(request, 'Failed to calculate total balance');

    if (!success) {
      return { success: false, error };
    }

    let totalBalance = 0;
    data?.forEach(account => {
      // For credit cards, the balance is a liability, so we subtract it.
      if (account?.account_type === 'credit_card') {
        totalBalance -= parseFloat(account?.balance || 0);
      } else { // For other accounts (cash, savings), it's an asset, so we add it.
        totalBalance += parseFloat(account?.balance || 0);
      }
    });

    return { success: true, data: totalBalance };
  }
};