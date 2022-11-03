import http from "../../utils/http-common";

const controller = "branch";

const createBranchManagementAsync = (data) => {
  return http.post(`/${controller}/create-branch-management`, data);
};

const getBranchManagementsAsync = (pageNumber, pageSize, keySearch) => {
  return http.get(
    `/${controller}/get-branch-managements?pageNumber=${pageNumber}&pageSize=${pageSize}&keySearch=${keySearch}`
  );
};

const getAllBranchsAsync = () => {
  return http.get(`/${controller}/get-all-branch-management`);
};

const getBranchByIdAsync = (branchId) => {
  return http.get(`/${controller}/get-branch-by-id/${branchId}`);
};

const updateBranchByIdAsync = (data) => {
  return http.post(`/${controller}/update-branch-by-id`, data);
};

const deleteStoreBranchByIdAsync = (branchId) => {
  return http.delete(`/${controller}/delete-branch-by-id/${branchId}`);
};

const branchDataService = {
  createBranchManagementAsync,
  getBranchManagementsAsync,
  getAllBranchsAsync,
  getBranchByIdAsync,
  updateBranchByIdAsync,
  deleteStoreBranchByIdAsync,
};
export default branchDataService;
