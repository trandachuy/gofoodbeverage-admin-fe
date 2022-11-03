import http from "../../utils/http-common";

const controller = "emailCampaign";

const getAllEmailCampaignAsync = (pageNumber, pageSize, keySearch) => {
  return http.get(
    `/${controller}/get-all-email-campaign?pageNumber=${pageNumber}&pageSize=${pageSize}&keySearch=${keySearch}`
  );
};

const createEmailCampaignAsync = (data) => {
  return http.post(`/${controller}/create-email-campaign`, data);
};

const emailCampaignDataService = {
  getAllEmailCampaignAsync,
  createEmailCampaignAsync,
};
export default emailCampaignDataService;
