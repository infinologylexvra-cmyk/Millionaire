import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import SEO from '../../components/Common/SEO';
import EmptyState from '../../components/Common/EmptyState';
import Input from '../../components/Forms/Input';
import Select from '../../components/Forms/Select';
import Checkbox from '../../components/Forms/Checkbox';
import Button from '../../components/Buttons/Button';
import useAuth from '../../hooks/useAuth';
import userService from '../../services/userService';
import { INDIAN_STATES } from '../../utils/constants';
import { isValidIndianPhone, isValidPincode } from '../../utils/validators';

const emptyAddress = {
  fullName: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
  isDefault: false,
};

const Addresses = () => {
  const { user, refreshUser, getErrorMessage } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: emptyAddress });

  const addresses = user?.addresses || [];

  const openAddForm = () => {
    setEditingId(null);
    reset(emptyAddress);
    setShowForm(true);
  };

  const openEditForm = (address) => {
    setEditingId(address._id);
    reset({
      fullName: address.fullName,
      phone: address.phone,
      line1: address.line1,
      line2: address.line2 || '',
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      isDefault: !!address.isDefault,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    reset(emptyAddress);
  };

  const onSubmit = async (values) => {
    try {
      if (editingId) {
        await userService.updateAddress(editingId, values);
      } else {
        await userService.addAddress(values);
      }
      await refreshUser();
      toast.success(editingId ? 'Address updated' : 'Address added');
      closeForm();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDelete = async (addressId) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      await userService.deleteAddress(addressId);
      await refreshUser();
      toast.success('Address removed');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <SEO title="My Addresses" />

      <section className="card-surface rounded-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-display text-xl text-cream">Saved Addresses</h2>
          <Button variant="outline" size="sm" onClick={openAddForm}>
            <FiPlus /> Add New Address
          </Button>
        </div>

        {addresses.length === 0 && !showForm && (
          <EmptyState
            title="No saved addresses"
            description="Add an address to speed up checkout."
            action={
              <Button variant="outline" onClick={openAddForm}>
                <FiPlus /> Add New Address
              </Button>
            }
          />
        )}

        {addresses.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            {addresses.map((address) => (
              <div
                key={address._id}
                className="relative rounded-xl border border-white/10 bg-surface p-5"
              >
                {address.isDefault && (
                  <span className="absolute top-4 right-4 text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full gold-gradient-bg text-charcoal font-semibold">
                    Default
                  </span>
                )}
                <p className="text-sm font-semibold text-cream mb-1">{address.fullName}</p>
                <p className="text-sm text-cream/60 mb-2">{address.phone}</p>
                <p className="text-sm text-cream/60">
                  {address.line1}
                  {address.line2 ? `, ${address.line2}` : ''}
                </p>
                <p className="text-sm text-cream/60 mb-4">
                  {address.city}, {address.state} - {address.pincode}
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => openEditForm(address)}
                    className="text-cream/50 hover:text-gold-400 transition-colors"
                    aria-label="Edit address"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(address._id)}
                    className="text-cream/50 hover:text-red-400 transition-colors"
                    aria-label="Delete address"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {showForm && (
        <section className="card-surface rounded-2xl p-6 mt-4">
          <h3 className="font-display text-lg text-cream mb-6">
            {editingId ? 'Edit Address' : 'Add New Address'}
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <Input
                label="Full Name"
                error={errors.fullName?.message}
                {...register('fullName', { required: 'Full name is required' })}
              />
              <Input
                label="Phone"
                error={errors.phone?.message}
                {...register('phone', {
                  required: 'Phone is required',
                  validate: (value) => isValidIndianPhone(value) || 'Enter a valid Indian phone number',
                })}
              />
            </div>
            <Input
              label="Address Line 1"
              error={errors.line1?.message}
              {...register('line1', { required: 'Address line 1 is required' })}
            />
            <Input label="Address Line 2 (optional)" {...register('line2')} />
            <div className="grid sm:grid-cols-3 gap-5">
              <Input
                label="City"
                error={errors.city?.message}
                {...register('city', { required: 'City is required' })}
              />
              <Select label="State" error={errors.state?.message} {...register('state', { required: 'State is required' })}>
                <option value="">Select State</option>
                {INDIAN_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </Select>
              <Input
                label="Pincode"
                error={errors.pincode?.message}
                {...register('pincode', {
                  required: 'Pincode is required',
                  validate: (value) => isValidPincode(value) || 'Enter a valid 6-digit pincode',
                })}
              />
            </div>
            <Checkbox label="Set as default address" {...register('isDefault')} />
            <div className="flex items-center gap-3">
              <Button type="submit" loading={isSubmitting}>
                {editingId ? 'Update Address' : 'Save Address'}
              </Button>
              <Button type="button" variant="ghost" onClick={closeForm}>
                Cancel
              </Button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
};

export default Addresses;
