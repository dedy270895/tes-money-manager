import { supabase } from '../lib/supabase';
import { handleSupabaseRequest } from './apiHelper';

const budgetSelectQuery = `
  id,
  name,
  amount,
  period,
  start_date,
  end_date,
  is_active,
  created_at,
  updated_at,
  categories!inner(id, name, color, icon, category_type)
`;

export const budgetService = {
  async getBudgets(userId) {
    const request = supabase
      .from('budgets')
      .select(budgetSelectQuery)
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    return handleSupabaseRequest(request, 'Failed to load budgets');
  },

  async createBudget(budgetData) {
    const request = supabase
      .from('budgets')
      .insert(budgetData)
      .select(budgetSelectQuery)
      .single();
    return handleSupabaseRequest(request, 'Failed to create budget');
  },

  async updateBudget(budgetId, updates) {
    const request = supabase
      .from('budgets')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', budgetId)
      .select(budgetSelectQuery)
      .single();
    return handleSupabaseRequest(request, 'Failed to update budget');
  },

  async deleteBudget(budgetId) {
    const request = supabase
      .from('budgets')
      .update({ is_active: false })
      .eq('id', budgetId);
    return handleSupabaseRequest(request, 'Failed to delete budget');
  },

  async getBudgetSpending(userId, categoryId, startDate, endDate) {
    const effectiveEndDate = endDate || new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0];
    const request = supabase
      .from('transactions')
      .select('amount')
      .eq('user_id', userId)
      .eq('category_id', categoryId)
      .eq('transaction_type', 'expense')
      .gte('transaction_date', startDate)
      .lte('transaction_date', effectiveEndDate);

    const { success, data, error } = await handleSupabaseRequest(request, 'Failed to calculate budget spending');

    if (!success) return { success, error };

    const totalSpent = data.reduce((sum, t) => sum + Math.abs(parseFloat(t.amount || 0)), 0);
    return { success: true, data: totalSpent };
  },

  async getArchivedBudgets(userId) {
    const request = supabase
      .from('budgets')
      .select(budgetSelectQuery)
      .eq('user_id', userId)
      .eq('is_active', false)
      .order('end_date', { ascending: false });
    return handleSupabaseRequest(request, 'Failed to load budget history');
  }
};