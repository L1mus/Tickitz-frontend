import api from './api';

export const getSalesChartAPI = async ({ filterBy, movieName = '' }) => {
  const params = { filter_by: filterBy };
  if (movieName) params.movie_name = movieName;
  const response = await api.get('/admin/sales-chart', { params });
  return response.data;
};

export const getTicketSalesAPI = async ({ genreId = 0, locationId = 0 }) => {
  const params = {};
  if (genreId) params.genre_id = genreId;
  if (locationId) params.location_id = locationId;
  const response = await api.get('/admin/ticket-sales', { params });
  return response.data;
};

export const getMovieOptionsAPI = async () => {
  const response = await api.get('/admin/movie-options');
  return response.data;
};

export const getMovieListAPI = async () => {
  const response = await api.get('/admin/movies', { params: { limit: 999 } });
  return response.data;
};