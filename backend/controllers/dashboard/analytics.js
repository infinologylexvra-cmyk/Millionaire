const Order = require('../../models/Order');
const NumberModel = require('../../models/Number');
const { success } = require('../../helpers/response');

const getAnalytics = async (req, res, next) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [revenueByMonth, ordersByStatus, soldNumbers] = await Promise.all([
      Order.aggregate([
        { $match: { paymentStatus: 'paid', createdAt: { $gte: sixMonthsAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
            total: { $sum: '$totalAmount' },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Order.aggregate([
        { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
      ]),
      NumberModel.find({ isSold: true }).populate('category', 'name'),
    ]);

    const categoryMap = {};
    soldNumbers.forEach((num) => {
      const categoryName = num.category?.name || 'Uncategorized';
      if (!categoryMap[categoryName]) {
        categoryMap[categoryName] = { category: categoryName, count: 0, revenue: 0 };
      }
      categoryMap[categoryName].count += 1;
      categoryMap[categoryName].revenue += num.price || 0;
    });

    const topCategories = Object.values(categoryMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return success(res, 200, 'Analytics fetched', {
      revenueByMonth,
      ordersByStatus,
      topCategories,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getAnalytics;
