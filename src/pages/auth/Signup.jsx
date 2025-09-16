import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';

const Signup = () => {
  const navigate = useNavigate();
  const { signUp, loading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
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

  const validateForm = () => {
    if (!formData?.fullName?.trim()) {
      return 'Full name is required';
    }
    if (!formData?.email?.trim()) {
      return 'Email is required';
    }
    if (!formData?.password) {
      return 'Password is required';
    }
    if (formData?.password?.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    if (formData?.password !== formData?.confirmPassword) {
      return 'Passwords do not match';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setFormLoading(true);
    setFormError('');

    try {
      const result = await signUp(
        formData?.email,
        formData?.password,
        {
          full_name: formData?.fullName,
          role: 'user'
        }
      );
      
      if (result?.success) {
        navigate('/dashboard-overview');
      } else {
        setFormError(result?.error || 'Failed to sign up');
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
            <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
            <p className="text-muted-foreground mt-2">Start tracking your finances today</p>
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
              <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-2">
                Full Name
              </label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                value={formData?.fullName || ''}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                disabled={loading || formLoading}
                className="w-full"
              />
            </div>

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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData?.confirmPassword || ''}
                onChange={handleChange}
                placeholder="Confirm your password"
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
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-primary hover:text-primary/80 font-medium"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;