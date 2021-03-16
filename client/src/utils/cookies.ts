import Cookies from "js-cookie";

const tokenName = "token";

export const setToken = (token: string, user_id: string) => {
  Cookies.set(tokenName, { token: token, user_id: user_id });
};

export const getToken = () => {
  if (Cookies.getJSON(tokenName)) return Cookies.getJSON(tokenName).token;
};

export const getTokenUser = () => {
  if (Cookies.getJSON(tokenName)) return Cookies.getJSON(tokenName).user_id;
};

export const removeToken = () => {
  Cookies.remove(tokenName);
};
