import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { FiLock, FiMail, FiUser, FiShield, FiArrowRight } from 'react-icons/fi';
import SEO from '../../components/Common/SEO';
import Logo from '../../components/Common/Logo';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';

const AdminLogin = () => {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const { login, register: registerUser, loginWithGoogle, logout, getErrorMessage } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await loginWithGoogle(credentialResponse.credential);
      const authUser = res?.user || res;
      if (authUser?.role !== 'admin' && !authUser?.isAdmin && authUser?.email !== 'dk897869@gmail.com') {
        await logout();
        toast.error('Access Denied: You do not have admin privileges');
        return;
      }
      toast.success('Admin Authenticated via Google!');
      navigate(ROUTES.ADMIN, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const onSubmit = async (data) => {
    try {
      if (mode === 'login') {
        const res = await login({ email: data.email, password: data.password });
        const authUser = res?.user || res;
        if (authUser?.role !== 'admin' && !authUser?.isAdmin && authUser?.email !== 'dk897869@gmail.com') {
          await logout();
          toast.error('Access Denied: Authorized Admin credentials required');
          return;
        }
        toast.success('Welcome to Admin Control Center');
        navigate(ROUTES.ADMIN, { replace: true });
      } else {
        const res = await registerUser({ name: data.name, email: data.email, password: data.password, role: 'admin' });
        const authUser = res?.user || res;
        toast.success('Admin Account Created Successfully!');
        if (authUser?.role === 'admin' || authUser?.isAdmin || authUser?.email === 'dk897869@gmail.com') {
          navigate(ROUTES.ADMIN, { replace: true });
        } else {
          setMode('login');
        }
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden text-[#f5f0e1]">
      <SEO title={mode === 'login' ? 'Admin Login' : 'Create Admin Account'} />

      {/* Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#d4af37]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] rounded-full bg-[#d4af37]/3 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Header Badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-4">
            <FiShield size={14} /> Admin Security Portal
          </div>
          <div className="flex justify-center mb-3">
            <Logo size="md" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
            ADMINISTRATOR <span style={{ background: 'linear-gradient(135deg, #f5d76e, #d4af37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{mode === 'login' ? 'LOGIN' : 'REGISTER'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-white/50">
            {mode === 'login' ? 'Enter authorized admin credentials or sign in with Google.' : 'Create a new Administrator account for control panel access.'}
          </p>
        </div>

        {/* Mode Switch Tabs */}
        <div className="flex bg-[#111118] p-1 rounded-xl mb-6 border border-white/10">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition ${mode === 'login' ? 'bg-[#d4af37] text-black shadow-md' : 'text-white/50 hover:text-white'}`}
          >
            Admin Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition ${mode === 'register' ? 'bg-[#d4af37] text-black shadow-md' : 'text-white/50 hover:text-white'}`}
          >
            Create Admin
          </button>
        </div>

        {/* Login/Register Card */}
        <div className="bg-[#111116] border border-[#d4af37]/25 rounded-2xl p-6 sm:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
          {/* Google Sign In Button */}
          <div className="mb-6">
            <p className="text-[11px] font-bold text-center uppercase tracking-widest text-[#d4af37] mb-3">Instant Admin Access</p>
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error('Google Sign-In failed')}
                theme="filled_black"
                shape="pill"
                size="large"
                width="100%"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs tracking-widest text-white/40 uppercase">Or {mode === 'login' ? 'Password Sign In' : 'Account Details'}</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#d4af37] font-semibold mb-2">Admin Name</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    placeholder="Admin Full Name"
                    {...register('name', { required: 'Name is required' })}
                    className="w-full bg-[#08080b] border border-white/15 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#d4af37] transition"
                  />
                </div>
                {errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name.message}</p>}
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-widest text-[#d4af37] font-semibold mb-2">Admin Email</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="email"
                  placeholder="admin@millionairenumbers.in"
                  {...register('email', { required: 'Admin email is required' })}
                  className="w-full bg-[#08080b] border border-white/15 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#d4af37] transition"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-[#d4af37] font-semibold mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  {...register('password', { required: 'Password is required' })}
                  className="w-full bg-[#08080b] border border-white/15 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#d4af37] transition"
                />
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1.5">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 mt-2 rounded-xl font-bold text-black uppercase tracking-wider text-sm transition-all hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #f5d76e, #d4af37, #b8912a)', boxShadow: '0 4px 20px rgba(212,175,55,0.3)' }}
            >
              {isSubmitting ? 'Processing...' : mode === 'login' ? 'Sign In To Control Panel' : 'Create Admin Account'} <FiArrowRight size={16} />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <a href="/" className="text-xs text-white/40 hover:text-[#d4af37] transition">
              ← Return to Main Store Website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
