const { success, error } = require('../../helpers/response');

const addAddress = async (req, res, next) => {
  try {
    if (req.body.isDefault === true) {
      req.user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    req.user.addresses.push(req.body);
    await req.user.save();

    return success(res, 201, 'Address added successfully', req.user.addresses);
  } catch (err) {
    next(err);
  }
};

const updateAddress = async (req, res, next) => {
  try {
    const address = req.user.addresses.id(req.params.addressId);
    if (!address) {
      return error(res, 404, 'Address not found');
    }

    if (req.body.isDefault === true) {
      req.user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    Object.assign(address, req.body);
    await req.user.save();

    return success(res, 200, 'Address updated successfully', req.user.addresses);
  } catch (err) {
    next(err);
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    const address = req.user.addresses.id(req.params.addressId);
    if (!address) {
      return error(res, 404, 'Address not found');
    }

    req.user.addresses.pull(req.params.addressId);
    await req.user.save();

    return success(res, 200, 'Address deleted successfully', req.user.addresses);
  } catch (err) {
    next(err);
  }
};

module.exports = { addAddress, updateAddress, deleteAddress };
