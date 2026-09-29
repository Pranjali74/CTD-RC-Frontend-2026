import api from "../api/axios";

export const isAuthenticated = () => {
  return Boolean(localStorage.getItem("token"));
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const setToken = (token) => {
  localStorage.setItem("token", token);
};

export const logout = async () => {
  try {
    await api.post("/user/logout", {});
  } catch {
    void 0;
  }

  for (let index = localStorage.length - 1; index >= 0; index -= 1) {
    const key = localStorage.key(index);
    if (key && !key.startsWith("solved_")) {
      localStorage.removeItem(key);
    }
  }
};