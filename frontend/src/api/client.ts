import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from "../utils/storage";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise: Promise<string | null> | null =
  null;

/* ============================================================
   REFRESH ACCESS TOKEN
============================================================ */

async function refreshAccessToken(): Promise<
  string | null
> {
  const refresh = getRefreshToken();

  if (!refresh) {
    return null;
  }

  if (!refreshPromise) {
    refreshPromise = axios
      .post<{
        access: string;
        refresh?: string;
      }>(
        `${import.meta.env.VITE_API_BASE_URL}/accounts/refresh/`,
        {
          refresh,
        },
      )
      .then(({ data }) => {
        saveTokens({
          access: data.access,
          refresh: data.refresh ?? refresh,
        });

        return data.access;
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

/* ============================================================
   REQUEST INTERCEPTOR
============================================================ */

apiClient.interceptors.request.use(
  (
    config: InternalAxiosRequestConfig,
  ) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    /*
     * IMPORTANT
     *
     * When sending FormData, Axios/browser must create
     * the multipart boundary automatically.
     *
     * Do NOT send:
     * Content-Type: application/json
     */
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
);

/* ============================================================
   RESPONSE INTERCEPTOR
============================================================ */

apiClient.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const original =
      error.config as
        | (
            InternalAxiosRequestConfig & {
              _retry?: boolean;
            }
          )
        | undefined;

    if (
      error.response?.status !== 401 ||
      !original ||
      original._retry ||
      original.url?.includes(
        "/accounts/login/",
      ) ||
      original.url?.includes(
        "/accounts/refresh/",
      )
    ) {
      return Promise.reject(error);
    }

    original._retry = true;

    const token =
      await refreshAccessToken();

    if (!token) {
      return Promise.reject(error);
    }

    original.headers.Authorization =
      `Bearer ${token}`;

    return apiClient(original);
  },
);

export default apiClient;