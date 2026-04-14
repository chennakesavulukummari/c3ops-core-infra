// String utilities
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const truncate = (str, length) => {
  return str.length > length ? str.slice(0, length) + '...' : str;
};

export const slugify = (str) => {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// Object utilities
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

export const mergeObjects = (target, source) => {
  return { ...target, ...source };
};

// Array utilities
export const unique = (arr) => {
  return [...new Set(arr)];
};

export const groupBy = (arr, key) => {
  return arr.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) result[group] = [];
    result[group].push(item);
    return result;
  }, {});
};

// Validation utilities
export const isEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Number utilities
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatNumber = (num) => {
  return num.toLocaleString('en-US');
};

// Local storage utilities
export const localStorage_ = {
  set: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  get: (key) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },
  remove: (key) => {
    localStorage.removeItem(key);
  },
  clear: () => {
    localStorage.clear();
  },
};
