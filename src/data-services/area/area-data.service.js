import http from "../../utils/http-common";

const controller = "area";

const getAreaManagementByBranchIdAsync = (storeBranchId, pageNumber, pageSize) => {
  return http.get(
    `/${controller}/get-area-management-by-branch-id?storeBranchId=${storeBranchId}&pageNumber=${pageNumber}&pageSize=${pageSize}`
  );
};

const createAreaManagementAsync = (data) => {
  return http.post(`/${controller}/create-area-management`, data);
};

const getAreasByBranchIdAsync = (storeBranchId) => {
  return http.get(`/${controller}/get-areas-by-branch-id?storeBranchId=${storeBranchId}`);
};

const updateAreaAsync = (data) => {
  return http.put(`/${controller}/update-area`, data);
};

const getAreaByIdAsync = (data) => {
  return http.get(
    `/${controller}/get-area-by-id?id=${data.id}&storeBranchId=${data.storeBranchId}`
  );
};

const deleteAreaByIdAsync = (id) => {
  return http.delete(`/${controller}/delete-area-by-id/${id}`);
};

const areaDataService = {
  getAreaManagementByBranchIdAsync,
  createAreaManagementAsync,
  getAreasByBranchIdAsync,
  getAreaByIdAsync,
  updateAreaAsync,
  deleteAreaByIdAsync,
};
export default areaDataService;
