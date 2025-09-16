import { supabase } from '../lib/supabase';
import { handleSupabaseRequest } from './apiHelper';

export const authService = {
  async signIn(email, password) {
    const request = supabase.auth.signInWithPassword({ email, password });
    return handleSupabaseRequest(request, 'Something went wrong during sign in. Please try again.');
  },

  async signUp(email, password, userData = {}) {
    const request = supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    return handleSupabaseRequest(request, 'Something went wrong during sign up. Please try again.');
  },

  async signOut() {
    const request = supabase.auth.signOut();
    return handleSupabaseRequest(request, 'Something went wrong during sign out. Please try again.');
  },

  async getCurrentUser() {
    const request = supabase.auth.getUser();
    const result = await handleSupabaseRequest(request, 'Failed to get current user');
    return { ...result, data: result.data?.user };
  },

  async getSession() {
    const request = supabase.auth.getSession();
    // getSession doesn't typically fail with network errors in the same way,
    // but wrapping it ensures consistency.
    const result = await handleSupabaseRequest(request, 'Failed to get session');
    return { ...result, data: result.data?.session };
  }
};