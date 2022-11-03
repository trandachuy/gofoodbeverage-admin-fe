import http from "../../utils/http-common";

const controller = "order";

const getOrderManagementAsync = (data) => {
  return http.get(
    `/${controller}/get-order-management?branchId=${data.branchId}&startDate=${data.startDate}&endDate=${data.endDate}&businessSummaryWidgetFilter=${data.typeOptionDate}&pageNumber=${data.pageNumber}&pageSize=${data.pageSize}&keySearch=${data.keySearch}`
  );
};

const getOrderReportByFilterAsync = (data) => {
  return http.get(
    `/${controller}/get-order-report-by-filter?branchId=${data.branchId}&startDate=${data.startDate}&endDate=${data.endDate}&businessSummaryWidgetFilter=${data.typeOptionDate}&pageNumber=${data.pageNumber}&pageSize=${data.pageSize}&keySearch=${data.keySearch}&serviceTypeId=${data.serviceTypeId}&paymentMethodId=${data.paymentMethodId}&customerId=${data.customerId}&orderStatusId=${data.orderStatusId}`
  );
};

const getOrderByIdAsync = (id) => {
  return http.get(`/${controller}/get-order-by-id/${id}`);
};

const getOrderBusinessSummaryWidgetAsync = (data) => {
  return http.get(
    `/${controller}/get-order-business-summary-widget?branchId=${data.branchId}&startDate=${data.startDate}&endDate=${data.endDate}&businessSummaryWidgetFilter=${data.typeOptionDate}`
  );
};

const getOrderTopSellingProductAsync = (data) => {
  return http.get(
    `/${controller}/get-order-top-selling-product?branchId=${data.branchId}&startDate=${data.startDate}&endDate=${data.endDate}`
  );
};

const calculateStatisticalDataAsync = (data) => {
  return http.post(`/${controller}/calculate-statistical-data`, data);
};

const getOrderBusinessRevenueWidgetAsync = (data) => {
  return http.get(
    `/${controller}/get-order-business-revenue-widget?branchId=${data.branchId}&startDate=${data.startDate}&endDate=${data.endDate}&businessSummaryWidgetFilter=${data.typeOptionDate}`
  );
};

const getOrderProductReportAsync = (data) => {
  return http.get(
    `/${controller}/get-order-product-report?branchId=${data.branchId}&startDate=${data.startDate}&endDate=${data.endDate}&businessSummaryWidgetFilter=${data.typeOptionDate}&pageNumber=${data.pageNumber}&pageSize=${data.pageSize}&keySearch=${data.keySearch}`
  );
};

const getRevenueByTypeAsync = (data) => {
  return http.get(
    `/${controller}/get-revenue-by-type?branchId=${data.branchId}&startDate=${data.startDate}&endDate=${data.endDate}&businessSummaryWidgetFilter=${data.typeOptionDate}`
  );
};

const getOrderSoldProductAsync = (data) => {
  return http.get(
    `/${controller}/get-order-sold-product?branchId=${data.branchId}&startDate=${data.startDate}&endDate=${data.endDate}&businessSummaryWidgetFilter=${data.typeOptionDate}&pageNumber=${data.pageNumber}&pageSize=${data.pageSize}&keySearch=${data.keySearch}&sortNo=${data.sortNo}&sortProductName=${data.sortProductName}&sortCategory=${data.sortCategory}&sortQuantity=${data.sortQuantity}&sortAmount=${data.sortAmount}&sortCost=${data.sortCost}`
  );
};

const orderDataService = {
  getOrderManagementAsync,
  getOrderReportByFilterAsync,
  getOrderByIdAsync,
  getOrderBusinessSummaryWidgetAsync,
  getOrderBusinessRevenueWidgetAsync,
  getOrderTopSellingProductAsync,
  calculateStatisticalDataAsync,
  getOrderProductReportAsync,
  getRevenueByTypeAsync,
  getOrderSoldProductAsync,
};
export default orderDataService;
