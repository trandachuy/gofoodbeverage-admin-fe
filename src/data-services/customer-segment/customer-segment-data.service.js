import { guidIdEmptyValue } from "constants/string.constants";
import http from "../../utils/http-common";

const controller = "customerSegment";

const getCustomerSegmentsAsync = (pageNumber, pageSize, keySearch) => {
  return http.get(
    `/${controller}/get-customer-segments?pageNumber=${pageNumber}&pageSize=${pageSize}&keySearch=${keySearch}`
  );
};

const getCustomerSegmentByIdAsync = (id) => {
  return http.get(`/${controller}/get-customer-segment-by-id/${id}`);
};

const createCustomerSegmentAsync = (data) => {
  return http.post(`/${controller}/create-customer-segment`, data);
};

const updateCustomerSegmentAsync = (data) => {
  return http.put(`/${controller}/update-customer-segment`, data);
};

const deleteCustomerSegmentByIdAsync = (data) => {
  return http.delete(`/${controller}/delete-customer-segment-by-id/${data}`);
};

// The storeId is optional
const getCustomerSegmentByStoreIdAsync = (storeId = guidIdEmptyValue) => {
  return http.get(`/${controller}/get-customer-segment-by-store-id/${storeId}`);
};

const customerSegmentDataService = {
  getCustomerSegmentsAsync,
  getCustomerSegmentByIdAsync,
  createCustomerSegmentAsync,
  updateCustomerSegmentAsync,
  deleteCustomerSegmentByIdAsync,
  getCustomerSegmentByStoreIdAsync,
};
export default customerSegmentDataService;
