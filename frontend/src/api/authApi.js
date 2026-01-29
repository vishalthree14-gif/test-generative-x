import API from "./api";

// LOGIN
export const loginUser = (data) => {
  return API.post("/auth/login", data);
};

// REGISTER
export const registerUser = (data) => {
  return API.post("/auth/register", data);
};
