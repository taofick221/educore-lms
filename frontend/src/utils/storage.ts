import type { AuthTokens } from "../types/auth";

const ACCESS_TOKEN = "access_token";
const REFRESH_TOKEN = "refresh_token";

export const saveTokens = (tokens: AuthTokens) => {
  localStorage.setItem(ACCESS_TOKEN, tokens.access);
  localStorage.setItem(REFRESH_TOKEN, tokens.refresh);
};

export const getAccessToken = () =>
  localStorage.getItem(ACCESS_TOKEN);

export const getRefreshToken = () =>
  localStorage.getItem(REFRESH_TOKEN);

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
};