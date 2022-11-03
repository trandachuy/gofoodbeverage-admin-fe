import http from "../../utils/http-common";

const controller = "productCategory";

const getProductCategoriesAsync = (pageNumber, pageSize, keySearch) => {
  return http.get(
    `/${controller}/get-product-categories?pageNumber=${pageNumber}&pageSize=${pageSize}&keySearch=${keySearch}`
  );
};

const getAllProductCategoriesAsync = () => {
  return http.get(`/${controller}/get-all-product-categories`);
};

const getProductCategoryByIdAsync = (id) => {
  return http.get(`/${controller}/get-product-category-by-id/${id}`);
};

const createProductCategoryAsync = (data) => {
  return http.post(`/${controller}/create-product-category`, data);
};

const updateProductCategoryAsync = (data) => {
  return http.put(`/${controller}/update-product-category`, data);
};

const deleteProductCategoryByIdAsync = (data) => {
  return http.delete(`/${controller}/delete-product-category-by-id/${data}`);
};

const productCategoryDataService = {
  getProductCategoriesAsync,
  createProductCategoryAsync,
  getAllProductCategoriesAsync,
  getProductCategoryByIdAsync,
  updateProductCategoryAsync,
  deleteProductCategoryByIdAsync,
};
export default productCategoryDataService;
