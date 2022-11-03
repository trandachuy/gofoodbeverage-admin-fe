import http from "../../utils/http-common";

const controller = "materialCategory";

const createMaterialCategoryAsync = (data) => {
  return http.post(`/${controller}/create-material-category`, data);
};

const getMaterialCategoriesAsync = (pageNumber, pageSize, keySearch) => {
  return http.get(
    `/${controller}/get-material-categories?pageNumber=${pageNumber}&pageSize=${pageSize}&keySearch=${keySearch}`
  );
};

const getAllMaterialCategoriesAsync = () => {
  return http.get(`/${controller}/get-all-material-categories`);
};

const getMaterialCategoryByIdAsync = (data) => {
  return http.get(`/${controller}/get-material-category-by-id/${data}`);
};

const updateMaterialCategoryByIdAsync = (data) => {
  return http.put(`/${controller}/update-material-category`, data);
};

const deleteMaterialCategoryByIdAsync = (data) => {
  return http.delete(`/${controller}/delete-material-categories-by-id/${data}`);
};

const materialCategoryDataService = {
  createMaterialCategoryAsync,
  getMaterialCategoriesAsync,
  getAllMaterialCategoriesAsync,
  getMaterialCategoryByIdAsync,
  deleteMaterialCategoryByIdAsync,
  updateMaterialCategoryByIdAsync,
};
export default materialCategoryDataService;
