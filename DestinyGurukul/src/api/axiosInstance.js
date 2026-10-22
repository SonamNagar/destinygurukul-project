import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ,
  // httpOnly cookies automatically send hongi
  withCredentials: true,
});


// ===============================
// REQUEST INTERCEPTOR
// ===============================
// Cookies httpOnly hain — frontend unhe read/set nahi kar sakta
// Browser automatically cookies har request mein bhejta hai
// Isliye koi manual token header set karne ki zaroorat nahi

api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);


// ===============================
// RESPONSE INTERCEPTOR
// ===============================

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Access token expire hua — silently refresh karo
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Refresh token bhi cookie mein hai — bas endpoint call karo
        await axios.post(
          `${import.meta.env.VITE_API_URL}/users/refresh-token`,
          {},
          { withCredentials: true }
        );

        // Naya accessToken cookie mein set ho gaya — original request dobara bhejo
        return api(originalRequest);

      } catch (refreshError) {
        console.log("Session expired:", refreshError);

        // Cookies clear karo (logout)
        await axios.post(
          `${import.meta.env.VITE_API_URL}/users/logout`,
          {},
          { withCredentials: true }
        ).catch(() => {});

        // User info localStorage se bhi hataao
        localStorage.removeItem("user");
        localStorage.removeItem("teacherEmail");

        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


export default api;