import http from "../../utils/http-common";

const controller = "staff";

const getStaffsAsync = (pageNumber, pageSize, keySearch) => {
  return http.get(`/${controller}/get-staffs?pageNumber=${pageNumber}&pageSize=${pageSize}&keySearch=${keySearch}`);
};

const getDataStaffManagementAsync = (dataRequest) => {
  const { pageNumber, pageSize, keySearch, screenKey, branchId, groupPermissionId } = dataRequest;
  let queryUrlBuilder = `?pageNumber=${pageNumber}&pageSize=${pageSize}&keySearch=${keySearch}&screenKey=${screenKey}`;
  if (branchId) {
    queryUrlBuilder += `&branchId=${branchId}`;
  }
  if (groupPermissionId) {
    queryUrlBuilder += `&groupPermissionId=${groupPermissionId}`;
  }
  return http.get(`/${controller}/get-data-staff-management${queryUrlBuilder}`);
};

const getPrepareCreateNewStaffDataAsync = () => {
  return http.get(`/${controller}/get-prepare-create-new-staff-data`);
};

const getStaffByIdAsync = (id) => {
  return http.get(`/${controller}/get-staff-by-id/${id}`);
};

const createNewStaffAsync = (data) => {
  return http.post(`/${controller}/create-staff`, data);
};

const updateStaffAsync = (data) => {
  return http.put(`/${controller}/update-staff`, data);
};

const deleteStaffByIdAsync = (id) => {
  return http.delete(`/${controller}/delete-staff-by-id/${id}`);
};

const getCurrentStaffAsync = () => {
  return http.get(`/${controller}/get-current-staff`);
};

const updateStaffProfile = (data) => {
  return http.put(`/${controller}/update-profile`, data);
};

const getStaffActivities = (data) => {
  const { pageIndex, pageSize } = data;
  return http.get(`/${controller}/get-staff-activities?pageIndex=${pageIndex}&pageSize=${pageSize}`);
};

const staffDataService = {
  getDataStaffManagementAsync,
  getStaffsAsync,
  getPrepareCreateNewStaffDataAsync,
  createNewStaffAsync,
  getStaffByIdAsync,
  updateStaffAsync,
  deleteStaffByIdAsync,
  updateStaffProfile,
  getCurrentStaffAsync,
  getStaffActivities,
};
export default staffDataService;
