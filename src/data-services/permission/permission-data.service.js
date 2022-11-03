import http from "../../utils/http-common";

const controller = "permission";

const getGroupPermissionsAsync = (pageNumber, pageSize, keySearch) => {
  return http.get(`/${controller}/get-group-permissions?pageNumber=${pageNumber}&pageSize=${pageSize}&keySearch=${keySearch}`);
};

const getPermissionGroupsAsync = () => {
  return http.get(`/${controller}/get-permission-groups`);
};

const getPermissionsAsync = (token) => {
  return http.get(`/${controller}/get-permissions?token=${token}`);
};

const createGroupPermissionAsync = (data) => {
  return http.post(`/${controller}/create-group-permission`, data);
};

const getGroupPermissionByIdAsync = (id) => {
  return http.get(`/${controller}/get-group-permission-by-id/${id}`);
};

const updateGroupPermissionByIdAsync = (data) => {
  return http.put(`/${controller}/update-group-permission-by-id`, data);
};

const getGroupPermissionManagementAsync = () => {
  return http.get(`/${controller}/get-group-permissions-management`);
};

const permissionDataService = {
  getGroupPermissionsAsync,
  getPermissionGroupsAsync,
  getPermissionsAsync,
  createGroupPermissionAsync,
  getGroupPermissionByIdAsync,
  updateGroupPermissionByIdAsync,
  getGroupPermissionManagementAsync,
};
export default permissionDataService;
