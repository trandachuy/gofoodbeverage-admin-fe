import http from "../../utils/http-common";

const controller = "bill";

const getBillConfigurationAsync = () => {
  return http.get(`/${controller}/get-bill-configuration`);
};

const updateBillConfigurationAsync = data => {
  return http.put(`/${controller}/update-bill-configuration`, data);
};

const billDataService = {
  getBillConfigurationAsync,
  updateBillConfigurationAsync,
};

export default billDataService;
