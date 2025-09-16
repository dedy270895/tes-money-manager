import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { authService } from '../services/authService';
import { handleSupabaseRequest } from '../services/apiHelper';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getUserProfile = async (user) => {
    if (!user) return null;
    const request = supabase.from('user_profiles').select('*').eq('id', user.id).single();
    return handleSupabaseRequest(request, 'Failed to load user profile');
  };

  const reloadProfile = async () => {
    const currentUser = user || supabase.auth.getUser();
    if (currentUser) {
      const { success, data } = await getUserProfile(currentUser);
      if (success) {
        setProfile(data);
        const theme = data?.theme || 'system';
        // Apply theme to the document
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user;
      setUser(currentUser ?? null);

      if (currentUser) {
        const { success, data } = await getUserProfile(currentUser);
        if (success) {
          setProfile(data);
          const theme = data?.theme || 'system';
          if (theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      }
      setLoading(false);
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user;
      setUser(currentUser ?? null);
      if (event === 'SIGNED_IN' && currentUser) {
        reloadProfile();
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
        document.documentElement.classList.remove('dark');
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signUp = async (email, password, userData = {}) => {
    setLoading(true);
    setError(null);
    const { success, data, error } = await authService.signUp(email, password, userData);
    if (error) setError(error);
    setLoading(false);
    return { success, data, error };
  };

  const signIn = async (email, password) => {
    setLoading(true);
    setError(null);
    const { success, data, error } = await authService.signIn(email, password);
    if (error) setError(error);
    setLoading(false);
    return { success, data, error };
  };

  const signOut = async () => {
    setLoading(true);
    setError(null);
    const { success, error } = await authService.signOut();
    if (error) setError(error);
    setLoading(false);
    return { success, error };
  };

  const value = {
    user,
    profile,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    reloadProfile,
    clearError: () => setError(null),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
