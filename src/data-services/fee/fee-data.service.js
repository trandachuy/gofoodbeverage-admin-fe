import http from "../../utils/http-common";

const controller = "fee";

const createFeeManagementAsync = (data) => {
  return http.post(`/${controller}/create-fee-management`, data);
};

const getAllFeeInStoreAsync = (pageNumber, pageSize) => {
  return http.get(`/${controller}/get-fees?pageNumber=${pageNumber}&pageSize=${pageSize}`);
};

const deleteFeeByIdAsync = (id) => {
  return http.delete(`/${controller}/delete-fee-by-id/${id}`);
};

const getFeeDetailByIdAsync = (id) => {
  return http.get(`/${controller}/get-fee-detail-by-id/${id}`);
};

const stopFeeByIdAsync = (id) => {
  return http.post(`/${controller}/stop-fee-by-id/${id}`);
};

const feeDataService = {
  createFeeManagementAsync,
  getAllFeeInStoreAsync,
  deleteFeeByIdAsync,
  getFeeDetailByIdAsync,
  stopFeeByIdAsync,
};

export default feeDataService;
