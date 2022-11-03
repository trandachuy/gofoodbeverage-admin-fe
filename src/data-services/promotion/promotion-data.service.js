import http from "../../utils/http-common";

const controller = "promotion";

const createPromotionAsync = (data) => {
  return http.post(`/${controller}/create-promotion`, data);
};

const getPromotionsAsync = (pageNumber, pageSize, keySearch) => {
  return http.get(
    `/${controller}/get-promotions?pageNumber=${pageNumber}&pageSize=${pageSize}&keySearch=${keySearch}`
  );
};

const stopPromotionByIdAsync = (id) => {
  return http.post(`/${controller}/stop-promotion-by-id/${id}`);
};

const deletePromotionByIdAsync = (id) => {
  return http.delete(`/${controller}/delete-promotion-by-id/${id}`);
};

const getPromotionByIdAsync = (id) => {
  return http.get(`/${controller}/get-promotion-by-id/${id}`);
}

const updatePromotionAsync = (data) => {
  return http.put(`/${controller}/update-promotion`, data);
}

const promotionDataService = {
  createPromotionAsync,
  getPromotionsAsync,
  stopPromotionByIdAsync,
  deletePromotionByIdAsync,
  getPromotionByIdAsync,
  updatePromotionAsync,
};
export default promotionDataService;
