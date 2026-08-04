import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

import SEO from '../../components/Common/SEO';
import Logo from '../../components/Common/Logo';
import Button from '../../components/Buttons/Button';
import Input from '../../components/Forms/Input';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import { isValidEmail, isValidIndianPhone } from '../../utils/validators';

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();
  const { register: registerUser, loginWithGoogle, getErrorMessage } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
      });
      toast.success('Account created! Welcome to Millionaire Numbers.');
      navigate(ROUTES.HOME);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await loginWithGoogle(credentialResponse.credential);
      toast.success('Welcome to Millionaire Numbers.');
      navigate(ROUTES.HOME);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-charcoal">
      <SEO title="Create Account" />

      {/* Decorative left panel */}
      <div className="hidden lg:flex flex-col justify-between p-14 relative overflow-hidden bg-black">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="absolute inset-0 dotted-bg opacity-10" />

        <div className="relative z-10 max-w-md mt-16">
          <p className="font-display text-5xl leading-tight text-cream mb-6">
            Join India&apos;s most
            <br />
            <span className="gold-gradient-text">exclusive number club.</span>
          </p>
          <p className="text-cream/60 text-base">
            Create your account to start browsing verified VIP and fancy mobile numbers.
          </p>
        </div>

        <div className="relative z-10 select-none pointer-events-none">
          <span className="font-display text-6xl gold-gradient-text opacity-10 blur-[1px]">
            98765 00001
          </span>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="pt-24 lg:pt-0 max-w-md w-full">
          <div className="lg:hidden mb-8 flex justify-center">
          </div>

          <h1 className="font-display text-3xl text-cream mb-2">Create your account</h1>
          <p className="text-cream/60 text-sm mb-8">
            Join to browse and own India&apos;s most exclusive mobile numbers.
          </p>

          <div className="mb-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error('Google sign-in failed')}
              theme="filled_black"
              shape="pill"
              size="large"
              width="100%"
            />
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs tracking-widest text-cream/40 uppercase">Or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Full Name"
              type="text"
              placeholder="Your name"
              error={errors.name?.message}
              {...register('name', { required: 'Full name is required' })}
            />

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                validate: (v) => isValidEmail(v) || 'Enter a valid email',
              })}
            />

            <Input
              label="Phone (optional)"
              type="tel"
              placeholder="98765 43210"
              error={errors.phone?.message}
              {...register('phone', {
                validate: (v) => !v || isValidIndianPhone(v) || 'Enter a valid 10-digit Indian mobile number',
              })}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (v) => v === watch('password') || 'Passwords do not match',
              })}
            />

            <Button type="submit" className="w-full" loading={isSubmitting}>
              Create Account
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-cream/60">
            Already have an account?{' '}
            <Link to={ROUTES.LOGIN} className="text-gold-400 hover:text-gold-300">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
