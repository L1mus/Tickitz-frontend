import api from './api';

export const getMoviesAPI = async () => {
    const response = await api.get("/admin/movies");
    return response.data;
};