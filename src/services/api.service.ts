import { LoginResponse } from "@/hooks/auth/use-auth-login";
import { PAGES } from "@/lib/constants";
import { CustomMethod, SecureRequestProps } from "@/types/api.types";
import axios from "axios";
import { deleteCookie, getCookie, setCookie } from "cookies-next";

const authRoutes = [
  PAGES.LOGIN_PAGE,
  PAGES.REGISTER_PAGE,
  PAGES.FORGOT_PASSWORD_PAGE,
  PAGES.RESET_PASSWORD_PAGE,
  PAGES.VERIFY_EMAIL_PAGE,
  PAGES.VERIFY_ACCOUNT_PAGE,
  PAGES.COMPLETE_INVITE_PAGE,
];

export async function logout(redirect = true) {
  // Destroy the session
  deleteCookie("user_session_token");
  deleteCookie("user_session");

  if (typeof window !== "undefined" && redirect) {
    if (authRoutes.includes(window.location.pathname)) {
      return;
    }
    const currentUrl = window.location.pathname;
    const loginUrl = `${PAGES.LOGIN_PAGE}?callback=${encodeURIComponent(currentUrl)}`;
    window.location.href = loginUrl;
  }
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
    return undefined;
  }

  const user = JSON.parse(session as string) as LoginResponse["data"]["user"];
  
  // Normalize role to uppercase to match frontend route expectations
  if (user.role) {
    user.role = user.role.toUpperCase() as UserType;
  }
  
  return user;
}

export const getIsClient = () => {
  const user = getUserSession();
  return user?.role === "CLIENT";
};

export const getIsAdmin = () => {
  const user = getUserSession();
  return user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
};

export function updateUserSession(updatedUser: Partial<LoginResponse["data"]["user"]>) {
  const session = getCookie("user_session");
  if (!session) {
    return;
  }

  const user = JSON.parse(session as string) as LoginResponse["data"]["user"];
  const newUser = {
    ...user,
    ...updatedUser,
  };
  setCookie("user_session", JSON.stringify(newUser));
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

  const headers = {
    "Content-Type": "application/json",
    ...requestHeader,
  };

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
