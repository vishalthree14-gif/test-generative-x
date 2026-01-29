import API from "./api";

export const createCampaign = (data) => {
  return API.post("/create-compains", data);
};

export const getCampaigns = () => {
  return API.get("/get-compains");
};

export const addMember = (data) => {
  return API.post("/add-member", data);
};

export const getMembers = (compainId) => {
  return API.get(`/get-members/${compainId}`);
};
