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

export const generateQuestion = (quizId) => {
  return API.get(`/generate-question/${quizId}`);
};

export const searchWeb = (quizId) => {
  return API.get(`/search-web/${quizId}`);
};

export const youtubeSearch = (quizId) => {
  return API.get(`/youtube-search/${quizId}`);
};

export const generateComplete = (quizId) =>{
  return API.get(`/quiz-gen-complete/${quizId}`)
}

export const getQuizById = (quizId) => {
  return API.get(`/quiz/${quizId}`);
};

export const saveResults = (data) => {
  return API.post("/save-results", data);
};


