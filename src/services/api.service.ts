import { LoginResponse } from "@/hooks/auth/use-auth-login";
import { CustomMethod, SecureRequestProps } from "@/types/api.types";
import axios from "axios";
import { deleteCookie, getCookie } from "cookies-next";

export async function logout() {
  // Destroy the session
  deleteCookie("user_session_token");
  deleteCookie("user_session");
  window.location.href = `?callback=${window.location.href}`;
}

export async function getSessionToken() {
  const session = await getCookie("user_session_token");
  if (!session) {
    return null;
  } else {
    return session;
  }
}

export function getUserSession() {
  const session = getCookie("user_session");
  if (!session) {
    logout();
    return;
  }

  return JSON.parse(session as string) as LoginResponse["data"]["user"];
}

// const refreshAccessToken = async () => {
//   const refreshToken = "getRefreshToken()";
//   const url = process.env.NEXT_PUBLIC_API_BASE_URL + ENDPOINTS.AUTH_REFRESH_TOKEN;
//   try {
//     const response = await axios.post(url, {
//       refresh_token: refreshToken,
//     });
//     // Save new access token

//     return response.data.access_token;
//   } catch (error) {
//     // Handle refresh token expiration or failure
//     console.error("Refresh token failed", error);
//     throw error;
//   }
// };

axios.interceptors.request.use(
  async (config) => {
    const session = await getSessionToken();
    const token = session;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite retry loops
      // try {
      //   const newAccessToken = await refreshAccessToken();
      //   // Retry original request with the new token
      //   originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
      //   return axios(originalRequest); // Retry the request
      // } catch (err) {
      //   return Promise.reject(err); // Handle refresh token failure
      // }
      logout();
    }
    return Promise.reject(error);
  }
);

export async function secureRequest({
  url,
  method = "get",
  body,
  headers: requestHeader,
  extraConfig = {},
}: SecureRequestProps) {
  const givenMethod = method.toLocaleLowerCase() as CustomMethod;

  const headers = { ...requestHeader };

  if (givenMethod === "get" || (givenMethod === "delete" && !body)) {
    //dont include body in GET request request will fail
    return axios[givenMethod](url, {
      ...extraConfig,
      params: {
        ...body,
      },

      headers,
    });
  }
  if (givenMethod === "delete" && body) {
    return axios.delete(url, {
      headers: {
        ...headers,
      },
      data: body,
    });
  }
  return axios[givenMethod](url, body, { headers });
}
