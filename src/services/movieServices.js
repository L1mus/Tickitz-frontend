import api from './api';

export const homeAPI = async (params = {}) => {
    const response = await api.get("/movies", { params });
    return response;
};

export const detailAPI = async (id) => {
    const response = await api.get(`/movies/${id}`)
    return response;
}

export const booksAPI = async (id) => {
    const response = await api.get(`/movies/${id}/showtime`)
    return response;
}