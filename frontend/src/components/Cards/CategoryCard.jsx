import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';
import { formatINR } from '../../utils/formatPrice';

const CategoryCard = ({ category, index = 0, size = 'md' }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.45, delay: (index % 6) * 0.06 }}
    className={size === 'lg' ? 'row-span-2' : ''}
  >
    <Link
      to={`/numbers?category=${category.slug}`}
      className="group relative flex flex-col justify-end overflow-hidden rounded-2xl border border-white/10 hover:border-gold-500/40 transition-all duration-300 h-full min-h-[220px] p-6 bg-gradient-to-br from-surface-light to-black"
    >
      <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity dotted-bg" />
      <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-gold-500/10 blur-3xl group-hover:bg-gold-500/20 transition-colors" />

      <div className="relative z-10">
        <p className="text-[11px] tracking-[0.2em] uppercase text-gold-400/80 mb-2">
          {category.numberCount ?? 0} numbers available
        </p>
        <div className="flex items-center justify-between">
          <h3 className="font-display text-2xl text-cream group-hover:text-gold-300 transition-colors">
            {category.name}
          </h3>
          <FiArrowUpRight className="text-cream/40 group-hover:text-gold-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" size={20} />
        </div>
        <p className="text-sm text-gold-500 mt-1">from {formatINR(category.startingPrice)}</p>
      </div>
    </Link>
  </motion.div>
);

export default CategoryCard;
