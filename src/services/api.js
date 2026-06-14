import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
// const BASE_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
});
api.interceptors.request.use(
    (config) => {
        const state = JSON.parse(localStorage.getItem("persist:auth") || "{}");
        const token = JSON.parse(state.token || "{}");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

// api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response?.status === 401) {
//             localStorage.removeItem("persist:auth");
//             window.location.href = "/auth/";
//         }
//         return Promise.reject(error);
//     },
// );

export default api;