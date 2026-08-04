const Contact = require('../../models/Contact');
const { success } = require('../../helpers/response');
const { getPagination, buildPaginationMeta } = require('../../helpers/pagination');

const getContacts = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query, 20);
    const { status } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const [contacts, total] = await Promise.all([
      Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Contact.countDocuments(filter),
    ]);

    return success(res, 200, 'Contacts fetched', contacts, {
      pagination: buildPaginationMeta(total, page, limit),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getContacts;
