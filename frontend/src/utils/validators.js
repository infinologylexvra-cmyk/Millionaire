export const isValidEmail = (value = '') => /^\S+@\S+\.\S+$/.test(value);
export const isValidIndianPhone = (value = '') => /^[6-9]\d{9}$/.test(value);
export const isValidPincode = (value = '') => /^\d{6}$/.test(value);
export const isValidOTP = (value = '') => /^\d{6}$/.test(value);
