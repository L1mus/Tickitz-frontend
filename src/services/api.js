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
        const loginState = state.auth ? JSON.parse(state.auth) : null;
        const token = loginState?.token;
        console.log(token)
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
//             localStorage.removeItem("persist:ew-DB");
//             window.location.href = "/auth/login";
//         }
//         return Promise.reject(error);
//     },
// );

export default api;