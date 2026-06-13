import api from './api';

export const getMoviesAPI = (page,limit, month,year) =>
  api.get('/admin/movies', {
    page : page,
    limit: limit,
    month: month,
    year: year
  });