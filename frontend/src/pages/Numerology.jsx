import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiStar, FiCalendar, FiUser } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';

const Numerology = () => {
  const [type, setType] = useState('name'); // 'name' or 'dob'
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  // T9 Keypad mapping
  const t9Map = {
    A: 2, B: 2, C: 2,
    D: 3, E: 3, F: 3,
    G: 4, H: 4, I: 4,
    J: 5, K: 5, L: 5,
    M: 6, N: 6, O: 6,
    P: 7, Q: 7, R: 7, S: 7,
    T: 8, U: 8, V: 8,
    W: 9, X: 9, Y: 9, Z: 9
  };

  const getNumberFromName = (name) => {
    return name.toUpperCase().replace(/[^A-Z]/g, '').split('').map(char => t9Map[char] || '').join('');
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return toast.error('Please enter a value');
    
    setLoading(true);
    try {
      // Get target string to search for
      let searchStr = '';
      if (type === 'name') {
        searchStr = getNumberFromName(inputValue);
      } else {
        // dob format: YYYY-MM-DD -> remove dashes
        searchStr = inputValue.replace(/-/g, '');
      }

      // To ensure we always return 5 numbers, we'll fetch all numbers and do a custom sort/filter
      const res = await api.get('/numbers?limit=100&minPrice=2499');
      const allNumbers = res.data?.data || [];

      // Sort numbers by how well they match the search string (if it's long enough), 
      // or just pick 5 random if no match.
      let matched = allNumbers.filter(n => searchStr.length > 2 && n.phoneNumber.includes(searchStr.substring(0, 4)));
      
      // If not enough matches, fill with random numbers
      if (matched.length < 5) {
        const remaining = allNumbers.filter(n => !matched.includes(n)).sort(() => 0.5 - Math.random());
        matched = [...matched, ...remaining].slice(0, 5);
      } else {
        matched = matched.slice(0, 5);
      }

      setResults(matched);
      if (matched.length > 0) toast.success('Generated 5 lucky numbers for you!');
      else toast.error('No available numbers right now. Please check back later.');

    } catch (err) {
      toast.error('Failed to generate numbers');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f0e1] pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-[#d4af37] mb-4">Numerology Generator</h1>
          <p className="text-white/50">Enter your Name or Date of Birth and we will generate 5 lucky VIP numbers specifically for you.</p>
        </div>

        {/* Generator Box */}
        <div className="bg-[#111] border border-[#d4af37]/30 rounded-2xl p-8 mb-12 shadow-[0_0_30px_rgba(212,175,55,0.1)]">
          <div className="flex gap-4 mb-8 justify-center">
            <button 
              onClick={() => { setType('name'); setInputValue(''); setResults([]); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${type === 'name' ? 'bg-[#d4af37] text-black' : 'bg-white/5 text-white/50 border border-white/10 hover:border-[#d4af37]/50'}`}
            >
              <FiUser /> By Name
            </button>
            <button 
              onClick={() => { setType('dob'); setInputValue(''); setResults([]); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${type === 'dob' ? 'bg-[#d4af37] text-black' : 'bg-white/5 text-white/50 border border-white/10 hover:border-[#d4af37]/50'}`}
            >
              <FiCalendar /> By DOB
            </button>
          </div>

          <form onSubmit={handleGenerate} className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
            {type === 'name' ? (
              <input 
                type="text" 
                placeholder="Enter your full name (e.g. Rahul)" 
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                className="flex-1 bg-black border border-white/20 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-[#d4af37] text-lg"
              />
            ) : (
              <input 
                type="text" 
                placeholder="DD-MM-YYYY" 
                value={inputValue}
                onFocus={(e) => (e.target.type = 'date')}
                onBlur={(e) => { if (!inputValue) e.target.type = 'text'; }}
                onChange={e => setInputValue(e.target.value)}
                className="flex-1 bg-black border border-white/20 rounded-xl px-6 py-4 text-white placeholder-white/50 focus:outline-none focus:border-[#d4af37] text-lg"
              />
            )}
            <button 
              type="submit" 
              disabled={loading}
              className="bg-gradient-to-r from-[#d4af37] to-[#b8912a] text-black font-extrabold px-8 py-4 rounded-xl hover:scale-105 transition-transform flex items-center justify-center gap-2"
            >
              <FiStar /> {loading ? 'Generating...' : 'Generate Numbers'}
            </button>
          </form>
          
          {type === 'name' && inputValue && (
             <p className="text-center text-white/30 text-xs mt-4">Your Name Number Sequence: <strong className="text-[#d4af37]">{getNumberFromName(inputValue)}</strong></p>
          )}
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div>
            <h2 className="text-2xl font-display text-center mb-8 text-white/80">Your 5 Lucky Matches</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {results.map((number, idx) => (
                <div key={number._id} className="bg-gradient-to-br from-[#111] to-black border border-[#d4af37]/20 p-6 rounded-xl flex items-center justify-between hover:border-[#d4af37] transition-colors relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#d4af37]" />
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-bold mb-1 block">Match #{idx + 1}</span>
                    <h3 className="text-3xl font-bold tracking-widest">{number.phoneNumber}</h3>
                    <p className="text-white/40 text-sm mt-1">{number.operator} • ₹{number.price.toLocaleString()}</p>
                  </div>
                  <button 
                    onClick={() => navigate(`/numbers/${number._id}`)}
                    className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-[#d4af37] group-hover:bg-[#d4af37] group-hover:text-black transition-colors"
                  >
                    →
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <p className="text-white/40 mb-4">Didn't find what you were looking for?</p>
              <button 
                onClick={() => navigate('/contact')}
                className="text-[#d4af37] border border-[#d4af37] rounded-full px-6 py-2 text-sm hover:bg-[#d4af37] hover:text-black transition-colors"
              >
                Request Custom Number
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Numerology;
