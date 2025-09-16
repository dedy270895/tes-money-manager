import { supabase } from '../lib/supabase';
import { handleSupabaseRequest } from './apiHelper';

const categorySelectQuery = `
  id,
  user_id,
  name,
  description,
  category_type,
  color,
  icon,
  parent_id,
  is_active,
  created_at,
  updated_at
`;

export const categoryService = {
  async getCategories(userId) {
    const request = supabase
      .from('categories')
      .select(categorySelectQuery)
      .eq('user_id', userId)
      .order('name', { ascending: true });
    return handleSupabaseRequest(request, 'Failed to load categories');
  },

  async createCategory(categoryData) {
    const request = supabase
      .from('categories')
      .insert(categoryData)
      .select(categorySelectQuery)
      .single();
    return handleSupabaseRequest(request, 'Failed to create category');
  },

  async updateCategory(categoryId, updates) {
    const request = supabase
      .from('categories')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', categoryId)
      .select(categorySelectQuery)
      .single();
    return handleSupabaseRequest(request, 'Failed to update category');
  },

  async deleteCategory(categoryId) {
    const request = supabase
      .from('categories')
      .delete()
      .eq('id', categoryId);
    return handleSupabaseRequest(request, 'Failed to delete category');
  }
};