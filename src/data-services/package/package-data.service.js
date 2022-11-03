import http from "../../utils/http-common";

const controller = "package";

const getPackagesPricingAsync = () => {
  return http.get(`/${controller}/get-packages-pricing`);
};

const createBankTransferPaymentAsync = (data) => {
  return http.post(`/${controller}/create-bank-transfer-payment`, data);
};

const createVNPayRequestAsync = (data) => {
    return http.post(`/${controller}/create-vnpay-payment`, data);
}

const updateVNPayAsync = data => {
    return http.post(`/${controller}/update-vnpay-payment`, data);
};

const getListPackageOrderAsync = () => {
  return http.get(`/${controller}/get-list-package-order`);
};

const packageDataService = {
  getPackagesPricingAsync,
  createBankTransferPaymentAsync,
  createVNPayRequestAsync,
  updateVNPayAsync,
  getListPackageOrderAsync,
};

export default packageDataService;
