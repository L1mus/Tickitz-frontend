import api from './api';

/**
 * @param {number} showtimeId
 */
export const fetchSeatPage = (showtimeId) =>
  api.get('/order/seats', { params: { showtime_id: showtimeId } });

/**
 * @param {{ showtime_id: number, seat_ids: number[], quantity: number }} payload
 * @returns {Promise<PaymentPageResponse>}
 */
export const postCreateBooking = (payload) =>
  api.post('/order/booking', payload);
