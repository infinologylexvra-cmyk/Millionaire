import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiArrowRight } from 'react-icons/fi';
import SEO from '../../components/Common/SEO';
import Input from '../../components/Forms/Input';
import Button from '../../components/Buttons/Button';
import numberService from '../../services/numberService';
import { formatINR } from '../../utils/formatPrice';
import { classNames, debounce } from '../../utils/helpers';

const QUICK_PATTERNS = ['VIP', 'Fancy', 'Gold', 'Platinum'];

const patternStyles = {
  VIP: 'text-gold-300 border-gold-400/40',
  Fancy: 'text-pink-300 border-pink-400/30',
  Gold: 'text-gold-400 border-gold-500/40',
  Platinum: 'text-gold-200 border-gold-300/40',
};

const formatPhone = (num = '') => num.replace(/(\d{5})(\d{5})/, '$1 $2');

const Search = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const debouncedSuggest = useMemo(
    () =>
      debounce(async (q) => {
        try {
          setLoading(true);
          const res = await numberService.suggest(q);
          setSuggestions(res.data || []);
        } catch (err) {
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      }, 300),
    []
  );

  useEffect(() => {
    if (query.trim().length > 0) {
      debouncedSuggest(query.trim());
    } else {
      setSuggestions([]);
    }
  }, [query, debouncedSuggest]);

  const goToResults = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/numbers?search=${encodeURIComponent(trimmed)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      goToResults();
    }
  };

  const trimmedQuery = query.trim();

  return (
    <>
      <SEO title="Search Numbers" />
      <div className="max-w-3xl mx-auto px-5 pt-32 pb-20">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="font-display text-4xl sm:text-5xl text-cream mb-8 text-center">
            Find your <span className="gold-gradient-text">number.</span>
          </h1>

          <div className="relative">
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search by digits, e.g. 9999 or pattern..."
              className="pl-12 py-4 text-base"
            />
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/30 pointer-events-none" size={20} />
          </div>

          {trimmedQuery.length > 0 && (
            <div className="mt-4">
              {suggestions.length > 0 ? (
                <div className="card-surface rounded-2xl divide-y divide-white/5 overflow-hidden mb-6">
                  {suggestions.map((s) => (
                    <button
                      key={s._id}
                      onClick={() => navigate(`/numbers/${s._id}`)}
                      className="w-full flex items-center justify-between gap-4 px-5 py-4 hover:bg-white/5 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={classNames(
                            'text-[10px] tracking-widest uppercase px-2 py-1 rounded-full border',
                            patternStyles[s.pattern] || 'text-cream/60 border-white/15'
                          )}
                        >
                          {s.pattern}
                        </span>
                        <span className="font-display text-lg text-cream">{formatPhone(s.phoneNumber)}</span>
                      </div>
                      <span className="text-gold-400 font-medium">{formatINR(s.price)}</span>
                    </button>
                  ))}
                </div>
              ) : (
                !loading && (
                  <p className="text-center text-cream/40 text-sm mb-6">
                    No quick matches. Try viewing all results.
                  </p>
                )
              )}

              <div className="flex justify-center">
                <Button variant="outline" onClick={goToResults}>
                  View all results for "{trimmedQuery}" <FiArrowRight />
                </Button>
              </div>
            </div>
          )}

          {trimmedQuery.length === 0 && (
            <div className="mt-10 text-center">
              <p className="text-xs uppercase tracking-widest text-cream/40 mb-4">Quick picks</p>
              <div className="flex flex-wrap justify-center gap-3">
                {QUICK_PATTERNS.map((p) => (
                  <button
                    key={p}
                    onClick={() => navigate(`/numbers?pattern=${p}`)}
                    className={classNames(
                      'px-5 py-2.5 rounded-full border text-sm transition-colors hover:bg-gold-500/10',
                      patternStyles[p] || 'text-cream/60 border-white/15'
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default Search;
