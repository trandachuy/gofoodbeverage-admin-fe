import http from "../../utils/http-common";

const controller = "store";

const getPrepareRegisterNewStoreDataAsync = () => {
  return http.get(`/${controller}/get-prepare-register-new-store-data`);
};

const getStoreLogo = () => {
  return http.get(`/${controller}/get-store-logo`);
};

const registerNewStoreAccountAsync = (data) => {
  return http.post(`/${controller}/register-new-store-account`, data);
};

const getCurrencyByStoreId = () => {
  return http.get(`/${controller}/get-currency-by-store-id`);
};

const getPrepareAddressDataAsync = () => {
  return http.get(`/${controller}/get-prepare-address-data`);
};

const getStoreByIdAsync = () => {
  return http.get(`/${controller}/get-store-by-id`);
};

const updateStoreManagementAsync = (data) => {
  return http.put(`/${controller}/update-store`, data);
};

const getStoreBankAccountByStoreIdAsync = () => {
  return http.get(`/${controller}/get-store-bank-account-by-store-id`);
};

const getAllPlatformActivatedAsync = () => {
  return http.get(`/${controller}/get-all-platform-activated`);
};

const activateAccountStoreAsync = (data) => {
  return http.put(`/${controller}/activate-account-store`, data);
};

const createSliderAsync = (data) => {
  return http.post(`/${controller}/create-slider`, data);
};

const getAvailableBranchQuantityAsync = () => {
  return http.get(`/${controller}/get-available-branch-quantity`);
};

const getCurrentOrderPackageInfoAsync = () => {
  return http.get(`/${controller}/get-current-package-info`);
};

const createBranchPurchaseOrderPackageAsync = (data) => {
  return http.post(`/${controller}/create-branch-purchase-order-package`, data);
};

const getStoreBannersAsync = (bannerType) => {
  return http.get(`/${controller}/get-store-banners/${bannerType}`);
};

const updateStoreBannersAsync = (data) => {
  return http.post(`/${controller}/update-store-banners`, data);
};

const updateStoreLogoAsync = (data) => {
  return http.post(`/${controller}/update-store-logo`, data);
};

const getThemesAsync = () => {
  return http.get(`/${controller}/get-themes`);
};

const getStoreInformationAsync = () => {
  return http.get(`/${controller}/information`);
};

const storeDataService = {
  getPrepareRegisterNewStoreDataAsync,
  getStoreLogo,
  registerNewStoreAccountAsync,
  getCurrencyByStoreId,
  getPrepareAddressDataAsync,
  getStoreByIdAsync,
  updateStoreManagementAsync,
  getStoreBankAccountByStoreIdAsync,
  getAllPlatformActivatedAsync,
  activateAccountStoreAsync,
  createSliderAsync,
  getAvailableBranchQuantityAsync,
  getCurrentOrderPackageInfoAsync,
  createBranchPurchaseOrderPackageAsync,
  getStoreBannersAsync,
  updateStoreBannersAsync,
  updateStoreLogoAsync,
  getThemesAsync,
  getStoreInformationAsync,
};

export default storeDataService;
