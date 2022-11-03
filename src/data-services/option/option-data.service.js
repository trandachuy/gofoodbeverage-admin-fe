import http from "../../utils/http-common";

const controller = "option";

const getOptionsByStoreIdAsync = (pageNumber, pageSize, keySearch) => {
  return http.get(
    `/${controller}/get-option-managements?pageNumber=${pageNumber}&pageSize=${pageSize}&keySearch=${keySearch}`
  );
};

const getAllOptionByStoreIdAsync = () => {
  return http.get(`/${controller}/get-all-option-management`);
};

const getOptionByIdAsync = (id) => {
  return http.get(`/${controller}/get-option-by-id/${id}`);
};

const createOptionManagementAsync = (data) => {
  return http.post(`/${controller}/create-option-management`, data);
};

const updateOptionAsync = (data) => {
  return http.put(`/${controller}/update-option`, data);
};

const deleteOptionByIdAsync = (data) => {
  return http.delete(`/${controller}/delete-option-by-id/${data}`);
};

const optionDataService = {
  createOptionManagementAsync,
  getOptionsByStoreIdAsync,
  getAllOptionByStoreIdAsync,
  deleteOptionByIdAsync,
  getOptionByIdAsync,
  updateOptionAsync,
};
export default optionDataService;
