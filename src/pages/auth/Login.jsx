import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';

const Login = () => {
  const navigate = useNavigate();
  const { signIn, loading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e?.target || {};
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formError) setFormError('');
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!formData?.email || !formData?.password) {
      setFormError('Please fill in all fields');
      return;
    }

    setFormLoading(true);
    setFormError('');

    try {
      const result = await signIn(formData?.email, formData?.password);
      
      if (result?.success) {
        navigate('/dashboard-overview');
      } else {
        setFormError(result?.error || 'Failed to sign in');
      }
    } catch (error) {
      setFormError('Something went wrong. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-xl shadow-soft p-8 border border-border">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Icon name="DollarSign" size={32} className="text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
            <p className="text-muted-foreground mt-2">Sign in to your money tracker</p>
          </div>

          {(error || formError) && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center gap-3">
                <Icon name="AlertTriangle" size={20} className="text-destructive flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-destructive text-sm font-medium">
                    {formError || error}
                  </p>
                  <button
                    onClick={() => navigator.clipboard?.writeText(formError || error)}
                    className="text-destructive/70 text-xs hover:text-destructive underline mt-1"
                  >
                    Copy error message
                  </button>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData?.email || ''}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                disabled={loading || formLoading}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData?.password || ''}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                disabled={loading || formLoading}
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              disabled={loading || formLoading}
              className="w-full"
            >
              {(loading || formLoading) ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="text-primary hover:text-primary/80 font-medium"
              >
                Sign Up
              </Link>
            </p>
          </div>

          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <h3 className="text-sm font-medium text-foreground mb-2">Demo Credentials</h3>
            <p className="text-xs text-muted-foreground mb-1">
              Email: demo@example.com
            </p>
            <p className="text-xs text-muted-foreground">
              Password: demo123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;