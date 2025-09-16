import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { useAuth } from '../../../contexts/AuthContext';
import { userProfileService } from '../../../services/userProfileService';
import { authService } from '../../../services/authService';

const AccountSettings = () => {
  const { user, profile, setProfile } = useAuth();
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    timezone: '',
    currency: '',
    dateFormat: '',
    theme: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (profile) {
      setProfileData({
        fullName: profile?.full_name || '',
        email: profile?.email || '',
        timezone: profile?.timezone || '',
        currency: profile?.currency || '',
        dateFormat: profile?.date_format || '',
        theme: profile?.theme || '',
      });
      setLoading(false);
    } else if (user) {
      // If profile is not yet loaded but user is, try fetching it
      const fetchProfile = async () => {
        setLoading(true);
        const { data, error } = await userProfileService.getUserProfile(user?.id);
        if (error) {
          console.error("Error fetching user profile:", error);
          setError("Failed to load profile.");
        } else if (data) {
          setProfile(data); // Update context with fetched profile
          setProfileData({
            fullName: data?.full_name || '',
            email: data?.email || '',
            timezone: data?.timezone || '',
            currency: data?.currency || '',
            dateFormat: data?.date_format || '',
            theme: data?.theme || '',
          });
        }
        setLoading(false);
      };
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [profile, user, setProfile]);

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    setError(null);
    setSuccessMessage(null);
    if (!user?.id) {
      setError("User not authenticated.");
      return;
    }

    try {
      const updates = {
        full_name: profileData?.fullName,
        timezone: profileData?.timezone,
        currency: profileData?.currency,
        date_format: profileData?.dateFormat,
        theme: profileData?.theme,
      };
      const { data, error } = await userProfileService.updateUserProfile(user?.id, updates);
      if (error) throw error;
      setProfile(data); // Update context
      setIsEditingProfile(false);
      setSuccessMessage("Profile updated successfully!");
    } catch (err) {
      console.error('Error saving profile:', err);
      setError(`Failed to save profile: ${err?.message || err?.description || 'Unknown error'}`);
    }
  };

  const handleChangePassword = async () => {
    setError(null);
    setSuccessMessage(null);
    if (passwordData?.newPassword !== passwordData?.confirmPassword) {
      setError('New passwords do not match!');
      return;
    }
    if (passwordData?.newPassword?.length < 6) { // Supabase default min password length is 6
      setError('Password must be at least 6 characters long!');
      return;
    }

    try {
      const { error } = await authService.updateUserPassword(passwordData?.newPassword);
      if (error) throw error;
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setIsChangingPassword(false);
      setSuccessMessage('Password changed successfully!');
    } catch (err) {
      console.error('Error changing password:', err);
      setError(`Failed to change password: ${err?.message || err?.description || 'Unknown error'}`);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev?.[field]
    }));
  };

  const handleDeleteAccount = async () => {
    setError(null);
    setSuccessMessage(null);
    const confirmation = window.prompt(
      'This action cannot be undone. All your data will be permanently deleted.\n\nType "DELETE" to confirm:'
    );
    
    if (confirmation === 'DELETE') {
      try {
        const { error } = await authService.deleteUserAccount();
        if (error) throw error;
        setSuccessMessage('Account deleted successfully. You will be logged out.');
        // Auth context should handle logout after deletion
      } catch (err) {
        console.error('Error deleting account:', err);
        setError(`Failed to delete account: ${err?.message || err?.description || 'Unknown error'}`);
      }
    } else if (confirmation !== null) {
      setError('Account deletion cancelled or incorrect confirmation.');
    }
  };

  if (loading) {
    return (
      <div className="bg-card rounded-lg border border-border p-6 text-center">
        <Icon name="Loader" className="animate-spin text-primary mx-auto mb-4" size={40} />
        <p className="text-muted-foreground">Loading profile settings...</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="User" size={20} className="text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Account Settings</h3>
          <p className="text-sm text-muted-foreground">Manage your profile and security settings</p>
        </div>
      </div>
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="bg-success/10 border border-success/20 text-success p-3 rounded-lg mb-4 text-sm">
          {successMessage}
        </div>
      )}
      <div className="space-y-8">
        {/* Profile Information */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-foreground">Profile Information</h4>
            <Button
              variant={isEditingProfile ? "outline" : "default"}
              size="sm"
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              iconName={isEditingProfile ? "X" : "Edit2"}
              iconPosition="left"
            >
              {isEditingProfile ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              type="text"
              value={profileData?.fullName}
              onChange={(e) => handleProfileChange('fullName', e?.target?.value)}
              disabled={!isEditingProfile}
            />
            <Input
              label="Email Address"
              type="email"
              value={profileData?.email}
              onChange={(e) => handleProfileChange('email', e?.target?.value)}
              disabled={true} // Email is typically not editable directly here
            />
            <Input
              label="Timezone"
              type="text"
              value={profileData?.timezone}
              onChange={(e) => handleProfileChange('timezone', e?.target?.value)}
              disabled={!isEditingProfile}
            />
            <Input
              label="Currency"
              type="text"
              value={profileData?.currency}
              onChange={(e) => handleProfileChange('currency', e?.target?.value)}
              disabled={!isEditingProfile}
            />
            <Input
              label="Date Format"
              type="text"
              value={profileData?.dateFormat}
              onChange={(e) => handleProfileChange('dateFormat', e?.target?.value)}
              disabled={!isEditingProfile}
            />
            <Input
              label="Theme"
              type="text"
              value={profileData?.theme}
              onChange={(e) => handleProfileChange('theme', e?.target?.value)}
              disabled={!isEditingProfile}
            />
          </div>

          {isEditingProfile && (
            <div className="flex items-center space-x-2 mt-4">
              <Button
                onClick={handleSaveProfile}
                iconName="Save"
                iconPosition="left"
              >
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditingProfile(false);
                  // Reset profile data if cancelled
                  if (profile) {
                    setProfileData({
                      fullName: profile?.full_name || '',
                      email: profile?.email || '',
                      timezone: profile?.timezone || '',
                      currency: profile?.currency || '',
                      dateFormat: profile?.date_format || '',
                      theme: profile?.theme || '',
                    });
                  }
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Security Settings */}
        <div className="pt-6 border-t border-border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-foreground">Security</h4>
            <Button
              variant={isChangingPassword ? "outline" : "default"}
              size="sm"
              onClick={() => setIsChangingPassword(!isChangingPassword)}
              iconName={isChangingPassword ? "X" : "Lock"}
              iconPosition="left"
            >
              {isChangingPassword ? 'Cancel' : 'Change Password'}
            </Button>
          </div>

          {!isChangingPassword ? (
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Icon name="Shield" size={20} className="text-success" />
                <div>
                  <p className="font-medium text-foreground">Password Protected</p>
                  <p className="text-sm text-muted-foreground">
                    Your account is secured with a strong password.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <Input
                  label="New Password"
                  type={showPasswords?.new ? "text" : "password"}
                  value={passwordData?.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e?.target?.value)}
                  placeholder="Enter your new password"
                  description="Password must be at least 6 characters long"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-9 text-muted-foreground hover:text-foreground"
                >
                  <Icon name={showPasswords?.new ? "EyeOff" : "Eye"} size={16} />
                </button>
              </div>

              <div className="relative">
                <Input
                  label="Confirm New Password"
                  type={showPasswords?.confirm ? "text" : "password"}
                  value={passwordData?.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e?.target?.value)}
                  placeholder="Confirm your new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-9 text-muted-foreground hover:text-foreground"
                >
                  <Icon name={showPasswords?.confirm ? "EyeOff" : "Eye"} size={16} />
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleChangePassword}
                  disabled={!passwordData?.newPassword || !passwordData?.confirmPassword}
                  iconName="Save"
                  iconPosition="left"
                >
                  Update Password
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Two-Factor Authentication */}
        <div className="pt-6 border-t border-border">
          <h4 className="font-medium text-foreground mb-4">Two-Factor Authentication</h4>
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon name="Smartphone" size={20} className="text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">2FA Status</p>
                  <p className="text-sm text-muted-foreground">
                    Two-factor authentication is currently disabled
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                iconName="Shield"
                iconPosition="left"
              >
                Enable 2FA
              </Button>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="pt-6 border-t border-border">
          <h4 className="font-medium text-foreground mb-4">Account Actions</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-medium text-foreground">Export Account Data</p>
                <p className="text-sm text-muted-foreground">
                  Download a copy of all your account data and transactions
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                iconName="Download"
                iconPosition="left"
              >
                Export Data
              </Button>
            </div>

            <div className="bg-error/5 border border-error/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-3">
                  <Icon name="AlertTriangle" size={20} className="text-error mt-0.5" />
                  <div>
                    <p className="font-medium text-error">Delete Account</p>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteAccount}
                  iconName="Trash2"
                  iconPosition="left"
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;