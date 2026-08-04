/**
 * Standardized API response helpers
 */

const success = (res, statusCode = 200, message = 'Success', data = null, extra = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...extra,
  });
};

const error = (res, statusCode = 500, message = 'Something went wrong', errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

module.exports = { success, error };
