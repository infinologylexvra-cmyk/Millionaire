import { FiHeart } from 'react-icons/fi';
import SEO from '../../components/Common/SEO';
import EmptyState from '../../components/Common/EmptyState';
import Loader from '../../components/Loader/Loader';
import Button from '../../components/Buttons/Button';
import NumberCard from '../../components/Cards/NumberCard';
import useWishlist from '../../hooks/useWishlist';
import { ROUTES } from '../../constants/routes';

const Wishlist = () => {
  const { wishlist, loading } = useWishlist();

  return (
    <div className="space-y-6">
      <SEO title="My Wishlist" />

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader />
        </div>
      ) : wishlist.length === 0 ? (
        <EmptyState
          icon={<FiHeart size={40} />}
          title="Your wishlist is empty"
          description="Save your favourite numbers to revisit them anytime."
          action={<Button to={ROUTES.NUMBERS}>Browse Numbers</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {wishlist.map((item, index) => (
            <NumberCard key={item._id} number={item} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
