import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaGoogle } from 'react-icons/fa';
import SEO from '../../components/Common/SEO';
import Input from '../../components/Forms/Input';
import Button from '../../components/Buttons/Button';
import useAuth from '../../hooks/useAuth';
import userService from '../../services/userService';

const Profile = () => {
  const { user, refreshUser, getErrorMessage } = useAuth();

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
  } = useForm({
    defaultValues: { name: user?.name || '', phone: user?.phone || '' },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    watch,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
  } = useForm({
    defaultValues: { currentPassword: '', newPassword: '', confirmNewPassword: '' },
  });

  const newPassword = watch('newPassword');

  const onProfileSubmit = async (values) => {
    try {
      await userService.updateProfile({ name: values.name, phone: values.phone });
      await refreshUser();
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const onPasswordSubmit = async (values) => {
    try {
      await userService.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success('Password updated successfully');
      resetPassword();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <SEO title="My Profile" />

      <section className="card-surface rounded-2xl p-6 sm:p-8">
        <h2 className="font-display text-xl text-cream mb-6">Edit Profile</h2>
        <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-5">
          <Input
            label="Name"
            error={profileErrors.name?.message}
            {...registerProfile('name', { required: 'Name is required' })}
          />
          <Input
            label="Phone"
            error={profileErrors.phone?.message}
            {...registerProfile('phone', { required: 'Phone is required' })}
          />
          <div>
            <label className="block mb-2 text-xs tracking-wide text-cream/60 uppercase">Email</label>
            <div className="w-full rounded-xl bg-surface/50 border border-white/10 px-4 py-3 text-sm text-cream/50 cursor-not-allowed">
              {user?.email}
            </div>
          </div>
          <Button type="submit" loading={isProfileSubmitting}>
            Save Changes
          </Button>
        </form>
      </section>

      <section className="card-surface rounded-2xl p-6 sm:p-8">
        <h2 className="font-display text-xl text-cream mb-6">Change Password</h2>
        {user?.authProvider === 'google' ? (
          <div className="flex items-center gap-3 text-sm text-cream/60">
            <FaGoogle className="text-gold-400" size={18} />
            <p>Your account uses Google Sign-In, so there's no password to change here.</p>
          </div>
        ) : (
          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-5">
            <Input
              label="Current Password"
              type="password"
              error={passwordErrors.currentPassword?.message}
              {...registerPassword('currentPassword', { required: 'Current password is required' })}
            />
            <Input
              label="New Password"
              type="password"
              error={passwordErrors.newPassword?.message}
              {...registerPassword('newPassword', {
                required: 'New password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
            />
            <Input
              label="Confirm New Password"
              type="password"
              error={passwordErrors.confirmNewPassword?.message}
              {...registerPassword('confirmNewPassword', {
                required: 'Please confirm your new password',
                validate: (value) => value === newPassword || 'Passwords do not match',
              })}
            />
            <Button type="submit" loading={isPasswordSubmitting}>
              Update Password
            </Button>
          </form>
        )}
      </section>
    </div>
  );
};

export default Profile;
