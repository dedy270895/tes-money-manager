import React, { useEffect } from 'react';
import Routes from './Routes';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const ThemeManager = () => {
  const { profile } = useAuth();

  useEffect(() => {
    if (profile?.theme) {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');

      if (profile.theme === 'system') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.add(systemPrefersDark ? 'dark' : 'light');
      } else {
        root.classList.add(profile.theme);
      }
    }
  }, [profile]);

  return null;
};

function App() {
  return (
    <AuthProvider>
      <ThemeManager />
      <Routes />
    </AuthProvider>
  );
}

export default App;