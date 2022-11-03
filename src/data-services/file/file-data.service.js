import http from "../../utils/http-common";

const controller = "file";

const uploadFileAsync = data => {
  return http.post(`/${controller}/upload`, data);
};

const fileDataService = {
  uploadFileAsync,
};

export default fileDataService;
