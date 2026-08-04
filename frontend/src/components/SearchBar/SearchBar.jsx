import { FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ROUTES } from '../../constants/routes';

const SearchBar = ({ placeholder = 'Search numbers, e.g. 9999...', className = '' }) => {
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (q.trim()) navigate(`${ROUTES.NUMBERS}?search=${encodeURIComponent(q.trim())}`);
  };

  return (
    <form onSubmit={handleSearch} className={`relative flex items-center ${className}`}>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-full pl-5 pr-12 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#d4af37]/50 transition"
      />
      <button type="submit" className="absolute right-3 text-[#d4af37] hover:text-white transition">
        <FiSearch size={18} />
      </button>
    </form>
  );
};

export default SearchBar;
