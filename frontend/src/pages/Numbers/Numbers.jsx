import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiX, FiAlertCircle } from 'react-icons/fi';
import SEO from '../../components/Common/SEO';
import Select from '../../components/Forms/Select';
import Input from '../../components/Forms/Input';
import Button from '../../components/Buttons/Button';
import NumberCard from '../../components/Cards/NumberCard';
import { NumberCardSkeleton } from '../../components/Loader/Skeleton';
import EmptyState from '../../components/Common/EmptyState';
import numberService from '../../services/numberService';
import categoryService from '../../services/categoryService';
import { getErrorMessage } from '../../services/api';
import { debounce } from '../../utils/helpers';
import { OPERATORS, PATTERNS, SORT_OPTIONS } from '../../utils/constants';

const DEFAULT_PAGINATION = { total: 0, page: 1, limit: 12, totalPages: 1, hasNextPage: false, hasPrevPage: false };

const Numbers = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamsRef = useRef(searchParams);

  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  const filters = useMemo(
    () => ({
      category: searchParams.get('category') || '',
      pattern: searchParams.get('pattern') || '',
      operator: searchParams.get('operator') || '',
      minPrice: searchParams.get('minPrice') || '2499',
      maxPrice: searchParams.get('maxPrice') || '',
      search: searchParams.get('search') || '',
      sort: searchParams.get('sort') || 'newest',
      page: Number(searchParams.get('page')) || 1,
    }),
    [searchParams]
  );

  const [categories, setCategories] = useState([]);
  const [numbers, setNumbers] = useState([]);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchInput, setSearchInput] = useState(filters.search);
  const [minPriceInput, setMinPriceInput] = useState(filters.minPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(filters.maxPrice);

  useEffect(() => {
    setSearchInput(filters.search);
    setMinPriceInput(filters.minPrice);
    setMaxPriceInput(filters.maxPrice);
  }, [filters.search, filters.minPrice, filters.maxPrice]);

  useEffect(() => {
    categoryService
      .getCategories()
      .then((res) => setCategories(res.data || []))
      .catch(() => {});
  }, []);

  const applyParamUpdate = useCallback(
    (updates, { resetPage = true } = {}) => {
      const next = new URLSearchParams(searchParamsRef.current);
      Object.entries(updates).forEach(([key, value]) => {
        if (value === '' || value === null || value === undefined) {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      });
      if (resetPage) next.delete('page');
      setSearchParams(next);
    },
    [setSearchParams]
  );

  const debouncedSearch = useMemo(
    () => debounce((value) => applyParamUpdate({ search: value }), 400),
    [applyParamUpdate]
  );
  const debouncedMinPrice = useMemo(
    () => debounce((value) => applyParamUpdate({ minPrice: value }), 400),
    [applyParamUpdate]
  );
  const debouncedMaxPrice = useMemo(
    () => debounce((value) => applyParamUpdate({ maxPrice: value }), 400),
    [applyParamUpdate]
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSearch(value);
  };

  const handleMinPriceChange = (e) => {
    const value = e.target.value;
    setMinPriceInput(value);
    debouncedMinPrice(value);
  };

  const handleMaxPriceChange = (e) => {
    const value = e.target.value;
    setMaxPriceInput(value);
    debouncedMaxPrice(value);
  };

  const handleClearFilters = () => {
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    const next = new URLSearchParams(searchParamsRef.current);
    next.set('page', String(newPage));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    let ignore = false;

    const fetchNumbers = async () => {
      setLoading(true);
      setError('');
      try {
        const params = {
          category: filters.category || undefined,
          pattern: filters.pattern || undefined,
          operator: filters.operator || undefined,
          minPrice: filters.minPrice || undefined,
          maxPrice: filters.maxPrice || undefined,
          search: filters.search || undefined,
          sort: filters.sort || undefined,
          page: filters.page,
          limit: 12,
        };
        const res = await numberService.getNumbers(params);
        if (!ignore) {
          setNumbers(res.data || []);
          setPagination(res.pagination || DEFAULT_PAGINATION);
        }
      } catch (err) {
        if (!ignore) setError(getErrorMessage(err));
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchNumbers();
    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  const hasActiveFilters =
    filters.category || filters.pattern || filters.operator || filters.minPrice || filters.maxPrice || filters.search;

  return (
    <>
      <SEO title="Browse Premium Numbers" />
      <div className="max-w-7xl mx-auto px-5 lg:px-8 pt-28 pb-20">
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl text-cream mb-2">
            Browse <span className="gold-gradient-text">Premium Numbers</span>
          </h1>
          <p className="text-cream/50 text-sm">Handpicked VIP, fancy and lucky mobile numbers across India.</p>
        </div>

        <div className="card-surface rounded-2xl p-5 lg:p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <Input
              label="Search"
              placeholder="Search by digits, e.g. 9999 or pattern..."
              value={searchInput}
              onChange={handleSearchChange}
            />
            <Select
              label="Category"
              value={filters.category}
              onChange={(e) => applyParamUpdate({ category: e.target.value })}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </Select>
            <Select
              label="Pattern"
              value={filters.pattern}
              onChange={(e) => applyParamUpdate({ pattern: e.target.value })}
            >
              <option value="">All Patterns</option>
              {PATTERNS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </Select>
            <Select
              label="Operator"
              value={filters.operator}
              onChange={(e) => applyParamUpdate({ operator: e.target.value })}
            >
              <option value="">All Operators</option>
              {OPERATORS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-end">
            <Input
              label="Min Price"
              type="number"
              min="0"
              placeholder="2499"
              value={minPriceInput}
              onChange={handleMinPriceChange}
            />
            <Input
              label="Max Price"
              type="number"
              min="0"
              placeholder="Any"
              value={maxPriceInput}
              onChange={handleMaxPriceChange}
            />
            <Select label="Sort By" value={filters.sort} onChange={(e) => applyParamUpdate({ sort: e.target.value })}>
              {SORT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </Select>
            <Button
              variant="ghost"
              size="md"
              onClick={handleClearFilters}
              disabled={!hasActiveFilters}
              className="justify-self-start sm:justify-self-end"
            >
              <FiX /> Clear Filters
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-cream/60">
            {loading ? 'Searching…' : `${pagination.total} number${pagination.total === 1 ? '' : 's'} found`}
          </p>
        </div>

        {error && !loading && (
          <EmptyState
            icon={<FiAlertCircle />}
            title="Something went wrong"
            description={error}
          />
        )}

        {!error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <NumberCardSkeleton key={i} />)
              : numbers.map((number, i) => <NumberCard key={number._id} number={number} index={i} />)}
          </div>
        )}

        {!loading && !error && numbers.length === 0 && (
          <EmptyState
            title="No numbers found"
            description="Try adjusting or clearing your filters to see more results."
            action={
              <Button variant="outline" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            }
          />
        )}

        {!loading && !error && numbers.length > 0 && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-12">
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasPrevPage}
              onClick={() => handlePageChange(filters.page - 1)}
            >
              Prev
            </Button>
            <span className="text-sm text-cream/60">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasNextPage}
              onClick={() => handlePageChange(filters.page + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default Numbers;
