export const getToken = () => {
  return localStorage.getItem("access");
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const logout = () => {
  localStorage.removeItem("access");
};