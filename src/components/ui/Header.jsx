import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    const result = await signOut();
    if (result?.success) {
      navigate('/login');
    }
    setShowUserMenu(false);
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard-overview', icon: 'LayoutDashboard' },
    { name: 'Transactions', path: '/transaction-management', icon: 'Receipt' },
    { name: 'Budget', path: '/budget-management', icon: 'Target' },
    { name: 'Reports', path: '/financial-reports', icon: 'BarChart3' },
    { name: 'Settings', path: '/settings-preferences', icon: 'Settings' }
  ];

  return (
    <header className="bg-card border-b border-border sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="DollarSign" size={20} className="text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground">MoneyTracker</span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems?.map((item) => (
              <Link
                key={item?.name}
                to={item?.path}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <Icon name={item?.icon} size={16} />
                <span>{item?.name}</span>
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon name="User" size={16} className="text-primary" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-foreground">
                    {user?.email?.split('@')?.[0] || 'User'}
                  </span>
                  <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-lg border border-border z-50">
                    <div className="p-2">
                      <div className="px-3 py-2 text-xs text-muted-foreground border-b border-border mb-2">
                        {user?.email}
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                      >
                        <Icon name="LogOut" size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                  Sign In
                </Button>
                <Button size="sm" onClick={() => navigate('/signup')}>
                  Sign Up
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <Icon name="Menu" size={20} className="text-foreground" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden border-t border-border py-4">
          <div className="grid grid-cols-5 gap-1">
            {navItems?.map((item) => (
              <Link
                key={item?.name}
                to={item?.path}
                className="flex flex-col items-center space-y-1 p-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <Icon name={item?.icon} size={16} />
                <span className="truncate">{item?.name}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;