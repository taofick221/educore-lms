import apiClient from "./client";
import type {
  AuthTokens,
  LoginData,
  RegisterData,
  User,
} from "../types/auth";

export const login = async (
  data: LoginData,
): Promise<AuthTokens> => {
  const response = await apiClient.post<AuthTokens>(
    "/accounts/login/",
    data,
  );

  return response.data;
};

export const register = async (
  data: RegisterData,
): Promise<User> => {
  const response = await apiClient.post<User>(
    "/accounts/register/",
    data,
  );

  return response.data;
};

export const getProfile = async (): Promise<User> => {
  const response = await apiClient.get<User>(
    "/accounts/me/",
  );

  return response.data;
};

export const refreshToken = async (
  refresh: string,
): Promise<{ access: string }> => {
  const response = await apiClient.post<{ access: string }>(
    "/accounts/refresh/",
    { refresh },
  );

  return response.data;
};

export const logout = async (
  refresh: string,
): Promise<void> => {
  await apiClient.post("/accounts/logout/", {
    refresh,
  });
};