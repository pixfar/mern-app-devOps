export const getFromLocalStorage = (key: any) => {
  if (!key || typeof window === "undefined") {
    return "";
  }
  return localStorage.getItem(key);
};

export const removeUserInfo = (key: any) => {
  return localStorage.removeItem(key);
};
