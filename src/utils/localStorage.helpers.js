export const localStorageKeys = {
  USED_TIME: "USED_TIME",
  TOKEN: "TOKEN",
  PERMISSIONS: "PERMISSIONS",
  PERMISSION_GROUP: "PERMISSION_GROUP",
  PRODUCT_FILTER: "PRODUCT_FILTER",
  ORDER_REPORT_FILTER: "ORDER_REPORT_FILTER",
};

export const getStorage = (key) => {
  return localStorage.getItem(key);
};

export const setStorage = (key, value) => {
  localStorage.setItem(key, value);
};
