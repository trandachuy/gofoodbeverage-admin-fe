import http from "../../utils/http-common";

const controller = "tax";

const getAllTaxAsync = (pageNumber, pageSize) => {
  return http.get(`/${controller}/get-all-tax?pageNumber=${pageNumber}&pageSize=${pageSize}`);
};

const createTaxAsync = (data) => {
  return http.post(`/${controller}/create-tax`, data);
};

const getAllTaxByTaxTypeAsync = (id) => {
  return http.get(`/${controller}/get-all-tax-by-tax-type/${id}`);
};

const getTaxByIdAsync = (id) => {
  return http.get(`/${controller}/get-tax-by-id/${id}`);
};

const deleteTaxByIdAsync = (id) => {
  return http.delete(`/${controller}/delete-tax-by-id/${id}`);
};

const taxDataService = {
  getAllTaxAsync,
  createTaxAsync,
  getAllTaxByTaxTypeAsync,
  deleteTaxByIdAsync,
  getTaxByIdAsync,
};

export default taxDataService;
