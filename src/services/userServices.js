import userApi from "./api.js"
export const getProfileAPI = async () => {
    const response = await userApi.get("/users/profile");
    return response.data;
};

export const updateProfileAPI = async (payload) => {
    const response = await userApi.patch("/users/profile", payload, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
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