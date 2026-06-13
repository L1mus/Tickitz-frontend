import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";


const userApi = axios.create({
    baseURL: BASE_URL,
    // headers: { "Content-Type": "application/json" },
});

let store;
export const injectStore = (_store) => {
    store = _store
}

const getCleanToken = () => {
    try {
        // const persistData = localStorage.getItem("persist:auth");
        // if (persistData) {
        //     const authState = JSON.parse(persistData || "{}");
        //     let token = authState?.token;

        //     if (token) {
            
        //         return token.replace(/^"|"$/g, '');
        //     }
        // }

        if (!store) return null
        const state = store.getState();

        let token = state.auth?.token
        if (token) {
            return token.replace(/^"|"$/g, '')
        }
    } catch (error) {
        console.error("Failed to parse local token", error);
    }
    return null;
};

userApi.interceptors.request.use(
    (config) => {
        const token = getCleanToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const getProfileAPI = async () => {
    const response = await userApi.get("/users/profile");
    return response.data;
};

export const updateProfileAPI = async (payload) => {
    const response = await userApi.patch("/users/profile", payload);
    return response.data;
};


export const getOrderHistoryAPI = async () => {
    const response = await userApi.get("/users/history");
    return response.data;
};


export const getOrderDetailAPI = async (id) => {
    const response = await userApi.get(`/users/history/${id}/detail`);
    return response.data;
};