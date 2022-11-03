import http from "../../utils/http-common";

const controller = "material";

const getMaterialManagementsAsync = (pageNumber, pageSize, keySearch) => {
  return http.get(`/${controller}/get-materials?pageNumber=${pageNumber}&pageSize=${pageSize}&keySearch=${keySearch}`);
};

const getAllMaterialManagementsAsync = () => {
  return http.get(`/${controller}/get-all-material-management`);
};

const getMaterialsByFilterAsync = (pageNumber, pageSize, keySearch, unitId, branchId, materialCategoryId, isActive) => {
  return http.get(
    `/${controller}/get-materials-by-filter?pageNumber=${pageNumber}&pageSize=${pageSize}&keySearch=${keySearch}
      &unitId=${unitId}&branchId=${branchId}&materialCategoryId=${materialCategoryId}&isActive=${isActive}`
  );
};

const createMaterialManagementAsync = (data) => {
  return http.post(`/${controller}/create-material-management`, data);
};

const getMaterialByIdAsync = (id) => {
  return http.get(`/${controller}/get-material-by-id/${id}`);
};

const getPrepareMaterialEditDataAsync = (id) => {
  return http.get(`/${controller}/get-material-prepare-edit-data/${id}`);
};

const updateMaterialManagementAsync = (data) => {
  return http.put(`/${controller}/update-material-management`, data);
};

const activateMaterialByIdAsync = (materialId) => {
  return http.put(`/${controller}/activate-material/${materialId}`);
};

const deactivateMaterialByIdAsync = (materialId) => {
  return http.put(`/${controller}/deactivate-material/${materialId}`);
};

const deleteMaterialManagementAsync = (id) => {
  return http.delete(`/${controller}/delete-material-management/${id}`);
};

const importMaterialsAsync = (data) => {
  return http.post(`/${controller}/import-materials`, data);
};

const deleteProductPriceMaterialByMaterialIdAsync = (materialId) => {
  return http.delete(`/${controller}/delete-product-price-material-by-material-id/${materialId}`);
};

const getAllMaterialsFilterAsync = () => {
  return http.get(`/${controller}/get-all-material-filter`);
};

const updateCostPerUnitByMaterialIdAsync = (data) => {
  return http.put(`/${controller}/update-cost-per-unit-by-material-id`, data);
};

const materialDataService = {
  getMaterialManagementsAsync,
  getAllMaterialManagementsAsync,
  getMaterialsByFilterAsync,
  getPrepareMaterialEditDataAsync,
  createMaterialManagementAsync,
  getMaterialByIdAsync,
  updateMaterialManagementAsync,
  deleteMaterialManagementAsync,
  activateMaterialByIdAsync,
  deactivateMaterialByIdAsync,
  importMaterialsAsync,
  deleteProductPriceMaterialByMaterialIdAsync,
  getAllMaterialsFilterAsync,
  updateCostPerUnitByMaterialIdAsync,
};
export default materialDataService;
