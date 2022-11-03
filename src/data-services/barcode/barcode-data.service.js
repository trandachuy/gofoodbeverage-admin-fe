import http from "../../utils/http-common";

const controller = "barcode";

const getBarcodeConfigByStoreIdAsync = () => {
  return http.get(`/${controller}/get-barcode-config-by-store-id`);
};

const updateBarcodeConfigByStoreIdAsync = (data) => {
  return http.put(`/${controller}/update-barcode-config`, data);
};

const barcodeDataService = {
  getBarcodeConfigByStoreIdAsync,
  updateBarcodeConfigByStoreIdAsync
};
export default barcodeDataService;
