import http from "../../utils/http-common";

const controller = "unit";

const getUnitsAsync = () => {
  return http.get(`/${controller}/get-units`);
};

const createUnitAsync = (data) => {
  return http.post(`/${controller}/create-unit`, data);
};

const unitDataService = {
  getUnitsAsync,
  createUnitAsync,
};
export default unitDataService;
