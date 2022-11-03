import http from "../../utils/http-common";

const controller = "paymentConfig";

const getAllStorePaymentConfigAsync = () => {
  return http.get(`/${controller}/get-payment-configs`);
};

const updatePaymentConfigAsync = data => {
  return http.put(`/${controller}/update-payment-config`, data);
};

const enablePaymentConfigAsync = data => {
  return http.put(`/${controller}/enable-payment-config`, data);
};

const paymentConfigDataService = {
  getAllStorePaymentConfigAsync,
  updatePaymentConfigAsync,
  enablePaymentConfigAsync
  
};
export default paymentConfigDataService;
