import http from "../../utils/http-common";

const prefix = "account";

const validationPasswordAsync = (data) => {
  return http.post(`/${prefix}/validation-password`, data);
};

const updatePasswordAsync = (data) => {
  return http.post(`/${prefix}/update-password`, data);
};

const uploadAccountAvatarAsync = data => {
  return http.post(`/${prefix}/upload-account-avatar`, data);
};

const userDataService = {
  uploadAccountAvatarAsync,
  updatePasswordAsync,
  validationPasswordAsync,
};

export default userDataService;
