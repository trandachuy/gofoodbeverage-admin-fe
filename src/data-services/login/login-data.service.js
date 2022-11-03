import http from "../../utils/http-common";

const controller = "login";

const authenticate = (data) => {
  return http.post(`/${controller}/authenticate`, data);
};

const refreshTokenAndPermissionsAsync = (data) => {
  return http.post(`/${controller}/refresh-token-and-permissions`, data);
};

const checkAccountLoginAsync = (data) => {
  return http.post(`/${controller}/check-before-authenticate`, data);
};

const loginDataService = {
  authenticate,
  refreshTokenAndPermissionsAsync,
  checkAccountLoginAsync,
};
export default loginDataService;
