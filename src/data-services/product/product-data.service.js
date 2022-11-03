import languageService from "services/language/language.service";
import http, { downloadAsync } from "../../utils/http-common";

const controller = "product";

const getProductsAsync = (pageNumber, pageSize, keySearch) => {
  return http.get(`/${controller}/get-products?pageNumber=${pageNumber}&pageSize=${pageSize}&keySearch=${keySearch}`);
};

const getAllProductsAsync = () => {
  return http.get(`/${controller}/get-all-products`);
};

const getAllProductsActiveAsync = () => {
  return http.get(`/${controller}/get-products-active`);
};

const getAllProductsWithCategoryAsync = () => {
  return http.get(`/${controller}/get-all-products-with-category`);
};

const getProductInComboByProductIdAsync = (productId) => {
  return http.get(`/${controller}/get-product-in-combo-by-product-id/${productId}`);
};

const getProductsByFilterAsync = (
  pageNumber,
  pageSize,
  keySearch,
  branchId,
  productCategoryId,
  statusId,
  platformId
) => {
  return http.get(
    `/${controller}/get-products-by-filter?pageNumber=${pageNumber}&pageSize=${pageSize}&keySearch=${keySearch}
      &branchId=${branchId}&productCategoryId=${productCategoryId}&statusId=${statusId}&platformId=${platformId}`
  );
};

const createProductAsync = (data) => {
  return http.post(`/${controller}/create-product`, data);
};

const importProductAsync = (data) => {
  return http.post(`/${controller}/import`, data, {
    headers: {
      ...http.headers,
      "X-Lang": languageService.getLang(),
    },
  });
};

const deleteProductByIdAsync = (data) => {
  return http.delete(`/${controller}/delete-product-by-id/${data}`);
};

const getProductByIdAsync = (productId) => {
  return http.get(`/${controller}/get-product-by-id?productId=${productId}`);
};

const getProductsByCategoryIdAsync = (categoryId, keySearch) => {
  return http.get(`/${controller}/get-products-by-category-id?categoryId=${categoryId}&keySearch=${keySearch}`);
};

const getAllProductIncludedProductUnitAsync = () => {
  return http.get(`/${controller}/get-all-product-included-unit`);
};

const updateProductAsync = (data) => {
  return http.put(`/${controller}/update-product`, data);
};

const changeStatusAsync = (id) => {
  return http.put(`/${controller}/change-status/${id}`);
};

const updateProductByCategoryAsync = async (data) => {
  return http.post(`/${controller}/update-product-by-category-id`, data);
};

const getAllOrderNotCompletedByProductIdAsync = (productId) => {
  return http.get(`/${controller}/get-all-order-not-completed-by-product-id/${productId}`);
};

const getAllProductToppings = () => {
  return http.get(`/${controller}/get-all-product-toppings`);
};

const downloadImportProductTemplateAsync = (languageCode) => {
  return downloadAsync(`/${controller}/download-import-product-template?languageCode=${languageCode}`);
};

const productDataService = {
  getProductsAsync,
  createProductAsync,
  importProductAsync,
  getAllProductsAsync,
  getAllProductsActiveAsync,
  getAllProductsWithCategoryAsync,
  getProductsByFilterAsync,
  deleteProductByIdAsync,
  getProductByIdAsync,
  updateProductAsync,
  changeStatusAsync,
  getProductsByCategoryIdAsync,
  getAllProductIncludedProductUnitAsync,
  updateProductByCategoryAsync,
  getAllOrderNotCompletedByProductIdAsync,
  getAllProductToppings,
  getProductInComboByProductIdAsync,
  downloadImportProductTemplateAsync,
};
export default productDataService;
