import { authKey } from "@/constant/storageKey";
import { getFromLocalStorage } from "@/utils/stripe/local-storage";

export const isLoggedIn = () => {
  const authToken = getFromLocalStorage(authKey);
  return !!authToken;
};

export const isToken = () => {
  const authToken = getFromLocalStorage(authKey);
  return authToken;
};
