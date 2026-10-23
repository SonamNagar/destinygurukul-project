
import axios from "axios";

// ==========================================
// AXIOS INSTANCE
// ==========================================

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ==========================================
// REFRESH STATE
// ==========================================

// Ek samay par sirf ek refresh request chalegi.
let refreshPromise = null;

// ==========================================
// REQUEST INTERCEPTOR
// ==========================================

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==========================================
// RESPONSE INTERCEPTOR
// ==========================================

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Request configuration available nahi hai.
    if (!originalRequest) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url || "";

    // Authentication endpoints par automatic refresh nahi karna.
    const isAuthRequest =
      requestUrl.includes("/users/login") ||
      requestUrl.includes("/users/register") ||
      requestUrl.includes("/users/refresh-token") ||
      requestUrl.includes("/users/logout");

    // Sirf 401 par refresh attempt karna.
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      isAuthRequest
    ) {
      return Promise.reject(error);
    }

    // Ek request ko baar-baar retry nahi karna.
    originalRequest._retry = true;

    try {
      // Agar refresh request pehle se chal rahi hai,
      // to usi request ka result wait karo.
      if (!refreshPromise) {
        refreshPromise = axios.post(
          `${API_URL}/users/refresh-token`,
          {},
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      await refreshPromise;

      // Refresh successful hone par original request retry karo.
      return api(originalRequest);
    } catch (refreshError) {
      console.error(
        "Token refresh failed:",
        refreshError.response?.status,
        refreshError.response?.data || refreshError.message
      );

      // Sirf authentication failure par local session clear karo.
      const status = refreshError.response?.status;

      if (status === 401 || status === 403) {
        localStorage.removeItem("user");
        localStorage.removeItem("teacherEmail");

        if (window.location.pathname !== "/login") {
          window.location.replace("/login");
        }
      }

      // Network/server error par user data turant clear nahi karte.
      return Promise.reject(refreshError);
    } finally {
      refreshPromise = null;
    }
  }
);

export default api;

