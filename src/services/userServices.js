import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// 1. Buat instance Axios mandiri khusus untuk fitur kamu sendiri
const userApi = axios.create({
    baseURL: BASE_URL,
    // headers: { "Content-Type": "application/json" },
});

// 2. Buat fungsi pembersih token lokal di file ini
const getCleanToken = () => {
    try {
        const persistData = localStorage.getItem("persist:auth");
        if (persistData) {
            const authState = JSON.parse(persistData || "{}");
            let token = authState?.token;

            if (token) {
                // Hapus tanda kutip dua perusak (byte 0) khusus untuk request kamu
                return token.replace(/^"|"$/g, '');
            }
        }
    } catch (error) {
        console.error("Failed to parse local token", error);
    }
    return null;
};

// 3. Pasang interceptor otomatis khusus untuk instance ini
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


// ==================== DAFTAR API ENDPOINT KAMU ====================

// Ambil Profile User
export const getProfileAPI = async () => {
    const response = await userApi.get("/users/profile");
    return response.data;
};

// Update Profile / Upload Foto
export const updateProfileAPI = async (payload) => {
    const response = await userApi.patch("/users/profile", payload);
    return response.data;
};

// Ambil List Riwayat Transaksi
export const getOrderHistoryAPI = async () => {
    const response = await userApi.get("/users/history");
    return response.data;
};

// Ambil Detail Tiket Spesifik
export const getOrderDetailAPI = async (id) => {
    const response = await userApi.get(`/users/history/${id}/detail`);
    return response.data;
};