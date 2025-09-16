import { supabase } from '../lib/supabase';
import { handleSupabaseRequest } from './apiHelper';

export const userProfileService = {
  async getProfile(userId) {
    const request = supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return handleSupabaseRequest(request, 'Failed to load user profile');
  },

  async updateProfile(userId, updates) {
    const request = supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select('*')
      .single();
    return handleSupabaseRequest(request, 'Failed to update user profile');
  },
};
