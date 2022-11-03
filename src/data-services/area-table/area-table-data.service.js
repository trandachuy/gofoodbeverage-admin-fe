import http from "../../utils/http-common";

const controller = "areaTable";

const getAreaTableByBranchAsync = (pageNumber, pageSize, storeBranchId, keySearch) => {
  return http.get(
    `/${controller}/get-area-tables-by-branch?pageNumber=${pageNumber}&pageSize=${pageSize}
    &keySearch=${keySearch}&storeBranchId=${storeBranchId}`
  );
};

const getAreaTableByIdAsync = (data) => {
  return http.get(`/${controller}/get-area-table-by-id?id=${data.id}&storeBranchId=${data.storeBranchId}`);
};

const createAreaTableByAreaIdAsync = (data) => {
  return http.post(`/${controller}/create-area-table-by-area-id`, data);
};

const updateAreaTableByAreaIdAsync = (data) => {
  return http.put(`/${controller}/update-area-table-by-area-id`, data);
};

const deleteAreaTableByIdAsync = (id) => {
  return http.delete(`/${controller}/delete-area-table-by-id/${id}`);
};

const areaTableDataService = {
  getAreaTableByBranchAsync,
  getAreaTableByIdAsync,
  createAreaTableByAreaIdAsync,
  updateAreaTableByAreaIdAsync,
  deleteAreaTableByIdAsync,
};
export default areaTableDataService;
