import http from "../../utils/http-common";

const controller = "qrCode";
const getAllQrCodeAsync = (pageNumber, pageSize, keySearch, branchId, serviceTypeId, targetId, statusId) => {
  return http.get(
    `/${controller}/get-all-qr-code?pageNumber=${pageNumber}&pageSize=${pageSize}&keySearch=${keySearch}&branchId=${branchId}&serviceTypeId=${serviceTypeId}&targetId=${targetId}&statusId=${statusId}`
  );
};

const getCreateQRCodePrepareDataAsync = () => {
  return http.get(`/${controller}/get-create-prepare-data`);
};

const createQrCodeAsync = (data) => {
  return http.post(`/${controller}/create-qr-code`, data);
};

const getQrCodeByIdAsync = (id) => {
  return http.get(`/${controller}/get-qr-code-by-id/${id}`);
};

const getEditQrCodePrepareDataAsync = (id) => {
  return http.get(`/${controller}/get-edit-prepare-data/${id}`);
};

const updateQrCodeAsync = (data) => {
  return http.put(`/${controller}/update-qr-code`, data);
};

const stopQrCodeByIdAsync = (id) => {
  return http.post(`/${controller}/stop-qr-code-by-id/${id}`);
};

const deleteQrCodeByIdAsync = (id) => {
  return http.delete(`/${controller}/delete-qr-code-by-id/${id}`);
};

const qrCodeDataService = {
  getAllQrCodeAsync,
  getCreateQRCodePrepareDataAsync,
  createQrCodeAsync,
  getQrCodeByIdAsync,
  getEditQrCodePrepareDataAsync,
  updateQrCodeAsync,
  stopQrCodeByIdAsync,
  deleteQrCodeByIdAsync,
};
export default qrCodeDataService;
