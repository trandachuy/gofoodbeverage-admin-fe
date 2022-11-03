import http from "../../utils/http-common";

const controller = "unitConversion";

const getUnitConversionByUnitIdAsync = (data) => {
  return http.get(`/${controller}/get-unit-conversion-by-unit-id?unitId=${data}`);
};

const createUnitConversionsAsync = (data) => {
  return http.post(`/${controller}/create-unit-conversions`, data);
};

const getUnitConversionAsync = () => {
  return http.get(`/${controller}/get-unit-conversions`);
};

const updateUnitConversionsAsync = (data) => {
  return http.put(`/${controller}/update-unit-conversions`, data);
};

const getUnitConversionsByMaterialIdAsync = (id) => {
  return http.get(`/${controller}/get-unit-conversions-by-material-id/${id}`);
};

const unitConversionDataService = {
  getUnitConversionByUnitIdAsync,
  createUnitConversionsAsync,
  getUnitConversionAsync,
  updateUnitConversionsAsync,
  getUnitConversionsByMaterialIdAsync,
};
export default unitConversionDataService;
