import http from "../../utils/http-common";

const controller = "stamp";

const getStampConfigByStoreIdAsync = () => {
  return http.get(`/${controller}/get-stamp-config-by-store-id`);
};

const updateStampConfigByStoreIdAsync = (data) => {
  return http.put(`/${controller}/update-stamp-config`, data);
};

const stampDataService = {
  getStampConfigByStoreIdAsync,
  updateStampConfigByStoreIdAsync
};
export default stampDataService;
