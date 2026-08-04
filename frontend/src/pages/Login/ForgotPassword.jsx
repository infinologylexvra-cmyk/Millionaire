import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import SEO from '../../components/Common/SEO';
import Button from '../../components/Buttons/Button';
import Input from '../../components/Forms/Input';
import authService from '../../services/authService';
import { getErrorMessage } from '../../services/api';
import { ROUTES } from '../../constants/routes';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('request');
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await authService.forgotPassword(email);
      toast.success(res.message);
      setStep('reset');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const res = await authService.forgotPassword(email);
      toast.success(res.message || 'A new code has been sent.');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setResending(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      await authService.resetPassword({ email, otp, password: newPassword });
      toast.success('Password reset successfully! Please log in.');
      navigate(ROUTES.LOGIN);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-charcoal">
      <SEO title="Reset Password" />

      <div className="card-surface rounded-3xl p-8 sm:p-10 max-w-md w-full">
        {step === 'request' ? (
          <>
            <h1 className="font-display text-3xl text-cream mb-2">Forgot your password?</h1>
            <p className="text-cream/60 text-sm mb-8">
              Enter your email and we&apos;ll send you a one-time code.
            </p>

            <form onSubmit={handleRequestSubmit} className="space-y-5">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button type="submit" className="w-full" loading={submitting}>
                Send OTP
              </Button>
            </form>
          </>
        ) : (
          <>
            <h1 className="font-display text-3xl text-cream mb-2">Enter your code</h1>
            <p className="text-cream/60 text-sm mb-8">
              We sent a 6-digit code to <span className="text-cream/80">{email}</span>.
            </p>

            <form onSubmit={handleResetSubmit} className="space-y-5">
              <Input
                label="OTP"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />

              <Input
                label="New Password"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />

              <Input
                label="Confirm New Password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />

              <Button type="submit" className="w-full" loading={submitting}>
                Reset Password
              </Button>
            </form>

            <p className="mt-5 text-center text-sm text-cream/60">
              Didn&apos;t get a code?{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-gold-400 hover:text-gold-300 disabled:opacity-50"
              >
                Resend
              </button>
            </p>
          </>
        )}

        <p className="mt-8 text-center text-sm text-cream/60">
          Remembered your password?{' '}
          <Link to={ROUTES.LOGIN} className="text-gold-400 hover:text-gold-300">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
