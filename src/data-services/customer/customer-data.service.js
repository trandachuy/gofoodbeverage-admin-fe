import http from "../../utils/http-common";

const controller = "customer";

const getCustomersAsync = (keySearch, pageNumber, pageSize) => {
  return http.get(`/${controller}/get-customers?keySearch=${keySearch}&pageNumber=${pageNumber}&pageSize=${pageSize}`);
};

const GetCustomersBySegmentAsync = (pageNumber, pageSize, keySearch, customerSegmentId) => {
  return http.get(
    `/${controller}/get-customers-by-segment?pageNumber=${pageNumber}&pageSize=${pageSize}&keySearch=${keySearch}
      &customerSegmentId=${customerSegmentId}`
  );
};

const createCustomerAsync = (data) => {
  return http.post(`/${controller}/create-customer`, data);
};

const deleteCustomerByIdAsync = (id) => {
  return http.delete(`/${controller}/delete-customer-by-id/${id}`);
};

const getCustomerByIdAsync = (id) => {
  return http.get(`/${controller}/get-customer-by-id?id=${id}`);
};

const updateCustomerAsync = (data) => {
  return http.put(`/${controller}/update-customer`, data);
};

const getCustomerByAccumulatedPointAsync = (pageNumber, pageSize, accumulatedPoint) => {
  return http.get(
    `/${controller}/get-customer-by-accumulatedPoint?pageNumber=${pageNumber}&pageSize=${pageSize}&accumulatedPoint=${accumulatedPoint}`
  );
};

const getLoyaltyPointByStoreIdAsync = () => {
  return http.get(`/${controller}/get-loyalty-by-store-id`);
};

const modifyLoyaltyPointAsync = (data) => {
  return http.post(`/${controller}/modify-loyalty-point`, data);
};

const getCustomerReportPieChartAsync = (fromDate, toDate, branchId, segmentTimeOption) => {
  return http.get(`/${controller}/get-customer-report?fromDate=${fromDate}&toDate=${toDate}
  &branchId=${branchId}&segmentTimeOption=${segmentTimeOption}`);
};

const getCustomersByDateRangeAsync = (startDate, endDate, branchId) => {
  let query = `startDate=${startDate}&endDate=${endDate}`;
  if (branchId) {
    query += `&branchId=${branchId}`;
  }
  return http.get(`/${controller}/get-customers-by-date-range?${query}`);
};

const customerDataService = {
  getCustomersAsync,
  GetCustomersBySegmentAsync,
  createCustomerAsync,
  deleteCustomerByIdAsync,
  getCustomerByIdAsync,
  updateCustomerAsync,
  getCustomerByAccumulatedPointAsync,
  getLoyaltyPointByStoreIdAsync,
  modifyLoyaltyPointAsync,
  getCustomerReportPieChartAsync,
  getCustomersByDateRangeAsync,
};

export default customerDataService;
