export const isAuthenticated = () => {
  return Boolean(localStorage.getItem("token"));
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const setToken = (token) => {
  localStorage.setItem("token", token);
};

export const logout = () => {
  localStorage.removeItem("token");
};