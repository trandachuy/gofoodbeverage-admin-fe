import http from "../../utils/http-common";

const controller = "shift";

const getShiftssAsync = (date, branchId, pageNumber, pageSize) => {
  return http.get(`/${controller}/get-shifts?pageNumber=${pageNumber}&pageSize=${pageSize}&date=${date}&branchId=${branchId}`);
};

const getShiftDetailOrderAsync = (id, pageNumber, pageSize) => {
  return http.get(`/${controller}/get-shift-detail-order?pageNumber=${pageNumber}&pageSize=${pageSize}&shiftId=${id}`);
};

const getShiftDetailSellingProductAsync = (id, pageNumber, pageSize) => {
  return http.get(`/${controller}/get-shift-detail-selling-product?pageNumber=${pageNumber}&pageSize=${pageSize}&shiftId=${id}`);
};

const getInfoShiftByIdRequesAsync = (id) => {
  return http.get(`/${controller}/get-shift-info-by-id?shiftId=${id}`);
};


const shiftDataService = {
  getShiftssAsync,
  getShiftDetailOrderAsync,
  getShiftDetailSellingProductAsync,
  getInfoShiftByIdRequesAsync,
};
export default shiftDataService;
