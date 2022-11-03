import http from "../../utils/http-common";

const controller = "supplier";

const getAllSupplierAsync = () => {
  return http.get(`/${controller}/get-all-supplier`);
};

const getListSupplierAsync = (pageNumber, pageSize, keySearch) => {
  return http.get(
    `/${controller}/get-list-supplier?pageNumber=${pageNumber}&pageSize=${pageSize}&keySearch=${keySearch}`
  );
};

const getSupplierByIdAsync = (id) => {
  return http.get(`/${controller}/get-supplier-by-id/${id}`);
};

const createSupplierAsync = (data) => {
  return http.post(`/${controller}/create-supplier`, data);
};

const updateSupplierAsync = (data) => {
  return http.put(`/${controller}/update-supplier`, data);
};

const deleteSupplierByIdAsync = (data) => {
  return http.delete(`/${controller}/delete-supplier-by-id/${data}`);
};

const supplierDataService = {
  getAllSupplierAsync,
  getListSupplierAsync,
  createSupplierAsync,
  getSupplierByIdAsync,
  updateSupplierAsync,
  deleteSupplierByIdAsync,
};
export default supplierDataService;
