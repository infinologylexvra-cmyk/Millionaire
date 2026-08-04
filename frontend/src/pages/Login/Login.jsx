import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

import SEO from '../../components/Common/SEO';
import Logo from '../../components/Common/Logo';
import Button from '../../components/Buttons/Button';
import Input from '../../components/Forms/Input';
import Checkbox from '../../components/Forms/Checkbox';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import { isValidEmail } from '../../utils/validators';

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const { login, loginWithGoogle, getErrorMessage } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectAfterAuth = () => {
    navigate(location.state?.from?.pathname || ROUTES.HOME, { replace: true });
  };

  const onSubmit = async (data) => {
    try {
      await login({ email: data.email, password: data.password });
      toast.success('Welcome back!');
      redirectAfterAuth();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await loginWithGoogle(credentialResponse.credential);
      toast.success('Welcome back!');
      redirectAfterAuth();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-charcoal">
      <SEO title="Log In" />

      {/* Decorative left panel */}
      <div className="hidden lg:flex flex-col justify-between p-14 relative overflow-hidden bg-black">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-80 h-80 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="absolute inset-0 dotted-bg opacity-10" />

        <div className="relative z-10">
          <Logo size="md" to={ROUTES.HOME} />
        </div>

        <div className="relative z-10 max-w-md">
          <p className="font-display text-5xl leading-tight text-cream mb-6">
            Your next number
            <br />
            is <span className="gold-gradient-text">waiting.</span>
          </p>
          <p className="text-cream/60 text-base">
            Sign in to manage your numbers, track orders and unlock member-only drops.
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
            <Logo size="md" to={ROUTES.HOME} />
          </div>

          <h1 className="font-display text-3xl text-cream mb-2">Welcome back</h1>
          <p className="text-cream/60 text-sm mb-8">
            Log in to manage your numbers and orders.
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
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password', { required: 'Password is required' })}
            />

            <div className="flex items-center justify-between">
              <Checkbox label="Remember me" />
              <Link
                to={ROUTES.FORGOT_PASSWORD}
                className="text-sm text-gold-400 hover:text-gold-300"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" loading={isSubmitting}>
              Log In
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-cream/60">
            New to Millionaire Numbers?{' '}
            <Link to={ROUTES.REGISTER} className="text-gold-400 hover:text-gold-300">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
