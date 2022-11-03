import http from "../../utils/http-common";

const controller = "purchaseOrder";

const createPurchaseOrderAsync = (data) => {
  return http.post(`/${controller}/create-purchase-order`, data);
};

const updatePurchaseOrderByIdAsync = (data) => {
  return http.put(`/${controller}/update-purchase-order-by-id`, data);
};

const cancelPurchaseOrderStatusByIdAsync = (data) => {
  return http.put(`/${controller}/cancel-purchase-order-by-id`, data);
};

const approvePurchaseOrderStatusByIdAsync = (data) => {
  return http.put(`/${controller}/approve-purchase-order-by-id`, data);
};

const completePurchaseOrderStatusByIdAsync = (data) => {
  return http.put(`/${controller}/complete-purchase-order-by-id`, data);
};

const getAllPurchaseOrderAsync = (pageNumber, pageSize, keySearch) => {
  return http.get(
    `/${controller}/get-all-purchase-order?pageNumber=${pageNumber}&pageSize=${pageSize}&keySearch=${keySearch}`
  );
};

const getPurchaseOrderByIdAsync = (id) => {
  return http.get(`/${controller}/get-purchase-order-by-id/${id}`);
};

const getPurchaseOrderByMaterialIdAsync = (materialId) => {
  return http.get(`/${controller}/get-purchase-order-by-material-id/${materialId}`);
};

const getPurchaseOrderByBranchIdAsync = (branchId) => {
  return http.get(`/${controller}/get-purchase-order-by-branch-id/${branchId}`);
};

const getPurchaseOrderBySupplierIdAsync = (supplierId) => {
  return http.get(`/${controller}/get-purchase-order-by-supplier-id/${supplierId}`);
};

const getPurchaseOrderPrepareDataAsync = () => {
  return http.get(`/${controller}/get-purchase-order-prepare-data`);
};

const purchaseOrderDataService = {
  createPurchaseOrderAsync,
  getAllPurchaseOrderAsync,
  getPurchaseOrderByIdAsync,
  updatePurchaseOrderByIdAsync,
  getPurchaseOrderByMaterialIdAsync,
  getPurchaseOrderBySupplierIdAsync,
  getPurchaseOrderPrepareDataAsync,
  cancelPurchaseOrderStatusByIdAsync,
  approvePurchaseOrderStatusByIdAsync,
  completePurchaseOrderStatusByIdAsync,
  getPurchaseOrderByBranchIdAsync,
};
export default purchaseOrderDataService;
