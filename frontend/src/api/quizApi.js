import API from "./api";


export const createQuiz = (data) => {
  return API.post("/create-quiz", data);
};


export const getQuiz = (data) => {
  return API.get("/only-self-quizs", data);
};


export const getAllQuiz = (data) => {
  return API.get("/get-all-quizs", data);
};

export const getCampaigns = () => {
  return API.get("/get-compains");
};

export const createCampaign = (data) => {
  return API.post("/create-compains", data);
};


