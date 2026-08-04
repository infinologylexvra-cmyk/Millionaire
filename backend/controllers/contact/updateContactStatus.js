const Contact = require('../../models/Contact');
const { success, error } = require('../../helpers/response');

const updateContactStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      status ? { status } : {},
      { new: true }
    );

    if (!contact) {
      return error(res, 404, 'Contact not found');
    }

    return success(res, 200, 'Contact status updated successfully', contact);
  } catch (err) {
    next(err);
  }
};

module.exports = updateContactStatus;
