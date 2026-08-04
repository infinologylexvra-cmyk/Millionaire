import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import SEO from '../../components/Common/SEO';
import Loader from '../../components/Loader/Loader';
import Input from '../../components/Forms/Input';
import Select from '../../components/Forms/Select';
import Textarea from '../../components/Forms/Textarea';
import Button from '../../components/Buttons/Button';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import orderService from '../../services/orderService';
import paymentService from '../../services/paymentService';
import couponService from '../../services/couponService';
import { getErrorMessage } from '../../services/api';
import { formatINR } from '../../utils/formatPrice';
import { isValidIndianPhone, isValidPincode } from '../../utils/validators';
import { INDIAN_STATES, ID_PROOF_TYPES } from '../../utils/constants';
import { ROUTES } from '../../constants/routes';

const formatPhone = (num = '') => String(num).replace(/(\d{5})(\d{5})/, '$1 $2');


const Checkout = () => {
  const { user } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [placing, setPlacing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: user?.name || '',
      email: user?.email || '',
      phone: '',
      altPhone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      idProofType: 'Aadhar',
    },
  });

  useEffect(() => {
    if (items.length === 0) {
      navigate(ROUTES.CART, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-20 max-w-6xl mx-auto px-5 lg:px-8">
        <Loader fullScreen />
      </div>
    );
  }

  const total = subtotal - (appliedCoupon?.discount || 0);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    try {
      const res = await couponService.validateCoupon(couponCode.trim(), subtotal);
      setAppliedCoupon({ code: res.data.code, discount: res.data.discount });
      toast.success('Coupon applied successfully');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const onPlaceOrder = async (values) => {
    setPlacing(true);
    try {
      const orderRes = await orderService.createOrder({
        items: items.map((i) => i._id),
        customerDetails: values,
        couponCode: appliedCoupon?.code,
      });
      const order = orderRes.data;

      // Using manual UPI / QR Payment Flow
      clearCart();
      navigate(`/pay/${order._id}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="pt-32 pb-20 max-w-6xl mx-auto px-5 lg:px-8">
      <SEO title="Checkout" />

      <form onSubmit={handleSubmit(onPlaceOrder)} className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 card-surface rounded-2xl p-6 sm:p-8 space-y-5">
          <h2 className="font-display text-xl text-cream mb-2">Customer Details</h2>

          <div className="grid sm:grid-cols-2 gap-5">
            <Input
              label="Full Name"
              error={errors.fullName?.message}
              {...register('fullName', { required: 'Full name is required' })}
            />
            <Input
              label="Email"
              type="email"
              error={errors.email?.message}
              {...register('email', { required: 'Email is required' })}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <Input
              label="Phone"
              error={errors.phone?.message}
              {...register('phone', {
                required: 'Phone number is required',
                validate: (v) => isValidIndianPhone(v) || 'Enter a valid 10-digit Indian phone number',
              })}
            />
            <Input label="Alternate Phone (optional)" error={errors.altPhone?.message} {...register('altPhone')} />
          </div>

          <Textarea
            label="Address"
            rows={3}
            error={errors.address?.message}
            {...register('address', { required: 'Address is required' })}
          />

          <div className="grid sm:grid-cols-2 gap-5">
            <Input
              label="City"
              error={errors.city?.message}
              {...register('city', { required: 'City is required' })}
            />
            <Select
              label="State"
              error={errors.state?.message}
              {...register('state', { required: 'State is required' })}
            >
              <option value="">Select State</option>
              {INDIAN_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <Input
              label="Pincode"
              error={errors.pincode?.message}
              {...register('pincode', {
                required: 'Pincode is required',
                validate: (v) => isValidPincode(v) || 'Enter a valid 6-digit pincode',
              })}
            />
            <Select label="ID Proof Type" error={errors.idProofType?.message} {...register('idProofType')}>
              {ID_PROOF_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="card-surface rounded-2xl p-6 sticky top-28 space-y-4">
            <h2 className="font-display text-xl text-cream">Order Summary</h2>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item._id} className="flex items-center justify-between text-sm">
                  <span className="text-cream/70">{formatPhone(item.phoneNumber)}</span>
                  <span className="text-cream font-medium">{formatINR(item.price)}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-white/10">
              {appliedCoupon ? (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-emerald-400">
                    Coupon applied: -{formatINR(appliedCoupon.discount)}
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-xs text-cream/40 hover:text-red-400"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Input
                    containerClassName="flex-1"
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    loading={applyingCoupon}
                    onClick={handleApplyCoupon}
                  >
                    Apply
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-cream/60">Subtotal</span>
                <span className="text-cream">{formatINR(subtotal)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-cream/60">Discount</span>
                  <span className="text-emerald-400">- {formatINR(appliedCoupon.discount)}</span>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-white/10 pt-3">
                <span className="text-cream font-semibold">Total</span>
                <span className="text-gold-400 font-display text-xl">{formatINR(total)}</span>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" loading={placing}>
              Place Order & Pay {formatINR(total)}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
