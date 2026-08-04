import { Link } from 'react-router-dom';
import { FaCrown } from 'react-icons/fa';
import { ROUTES } from '../../constants/routes';

const NotFound = () => (
  <div className="min-h-screen bg-[#050505] text-[#f5f0e1] flex items-center justify-center px-6">
    <div className="text-center">
      <FaCrown className="text-[#d4af37] text-5xl mx-auto mb-6" style={{ filter: 'drop-shadow(0 0 20px rgba(212,175,55,0.4))' }} />
      <h1 className="text-[10rem] font-display font-bold leading-none" style={{ background: 'linear-gradient(135deg,#f5d76e,#d4af37,#8f701f)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        404
      </h1>
      <h2 className="text-2xl font-display text-white mb-4">Page Not Found</h2>
      <p className="text-white/40 text-sm mb-10 max-w-md mx-auto">The page you are looking for does not exist or has been moved. Let's get you back to the gold.</p>
      <Link
        to={ROUTES.HOME}
        className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-black rounded transition hover:opacity-90"
        style={{ background: 'linear-gradient(135deg,#f5d76e,#d4af37,#b8912a)' }}
      >
        Back to Home
      </Link>
    </div>
  </div>
);

export default NotFound;
