import http from "../../utils/http-common";

const controller = "deliveryMethod";

const updateStatusDeliveryMethodByIdAsync = (data) => {
  return http.post(`/${controller}/update-status-delivery-method-by-id`, data);
};

const getDeliveryMethodsAsync = () => {
  return http.get(`/${controller}/get-all-delivery-method`);
};

const deliveryMethodService = {
  getDeliveryMethodsAsync,
  updateStatusDeliveryMethodByIdAsync,
};

export default deliveryMethodService;
