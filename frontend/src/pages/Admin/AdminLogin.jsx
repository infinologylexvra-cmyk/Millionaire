import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiLock, FiMail, FiShield, FiArrowRight } from 'react-icons/fi';
import SEO from '../../components/Common/SEO';
import Logo from '../../components/Common/Logo';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';

const AdminLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const { login, logout, getErrorMessage } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const user = await login({ email: data.email, password: data.password });
      if (user?.role !== 'admin' && !user?.isAdmin) {
        await logout();
        toast.error('Access Denied: You do not have admin privileges');
        return;
      }
      toast.success('Welcome to Admin Control Center');
      navigate(ROUTES.ADMIN, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden text-[#f5f0e1]">
      <SEO title="Admin Login" />

      {/* Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#d4af37]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] rounded-full bg-[#d4af37]/3 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Header Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-6">
            <FiShield size={14} /> Admin Security Portal
          </div>
          <div className="flex justify-center mb-4">
            <Logo size="md" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
            ADMINISTRATOR <span style={{ background: 'linear-gradient(135deg, #f5d76e, #d4af37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>LOGIN</span>
          </h1>
          <p className="text-xs sm:text-sm text-white/50">Enter authorized admin credentials to access the control center.</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#111116] border border-[#d4af37]/25 rounded-2xl p-6 sm:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
              {isSubmitting ? 'Authenticating...' : 'Sign In To Control Panel'} <FiArrowRight size={16} />
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
