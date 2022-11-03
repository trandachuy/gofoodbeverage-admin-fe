import http from "../../utils/http-common";

const controller = "membership";

const getMembershipsAsync = (pageNumber, pageSize) => {
  return http.get(`/${controller}/get-memberships?pageNumber=${pageNumber}&pageSize=${pageSize}`);
};

const getMembershipByIdAsync = (id) => {
  return http.get(`/${controller}/get-membership-by-id/${id}`);
};

const createMembershipAsync = (data) => {
  return http.post(`/${controller}/create-membership`, data);
};

const updateMembershipAsync = (data) => {
  return http.put(`/${controller}/update-membership`, data);
};

const deleteMembershipByIdAsync = (data) => {
  return http.delete(`/${controller}/delete-membership-by-id/${data}`);
};

const membershipDataService = {
  getMembershipsAsync,
  getMembershipByIdAsync,
  createMembershipAsync,
  updateMembershipAsync,
  deleteMembershipByIdAsync,
};
export default membershipDataService;
