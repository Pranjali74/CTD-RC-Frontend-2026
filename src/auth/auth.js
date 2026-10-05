export const isAuthenticated = () => {
  return Boolean(
    localStorage.getItem("isVerified") === "true"
  );
};


export const getToken = () => {
  return localStorage.getItem("token");
};


export const setToken = (token) => {
  if (token) {
    localStorage.setItem(
      "token",
      token
    );
  }
};


export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("currentUser");
  localStorage.removeItem("isVerified");
};