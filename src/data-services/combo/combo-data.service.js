import http from "../../utils/http-common";

const controller = "combo";

const getPrepareCreateProductComboDataAsync = () => {
  return http.get(`/${controller}/get-prepare-create-product-combo-data`);
};

const getCombosAsync = (pageNumber, pageSize, keySearch) => {
  return http.get(`/${controller}/get-combos?pageNumber=${pageNumber}&pageSize=${pageSize}`);
};

const getComboByIdAsync = (id) => {
  return http.get(`/${controller}/get-combo-by-id/${id}`);
};

const createComboAsync = (data) => {
  return http.post(`/${controller}/create-combo`, data);
};

const updateComboAsync = (data) => {
  return http.put(`/${controller}/update-combo`, data);
};

const deleteComboByIdAsync = (id) => {
  return http.delete(`/${controller}/delete-combo-by-id/${id}`);
};

const stopComboByIdAsync = (id) => {
  return http.post(`/${controller}/stop-combo-by-id/${id}`);
};

const comboDataService = {
  getPrepareCreateProductComboDataAsync,
  getCombosAsync,
  getComboByIdAsync,
  createComboAsync,
  updateComboAsync,
  deleteComboByIdAsync,
  stopComboByIdAsync,
};

export default comboDataService;
