import api from './api';

/**
 * @param {number} bookingId
 * @returns {Promise<PaymentPageResponse>}
 */
export const fetchPaymentPage = (bookingId) =>
  api.get(`/transactions/payment/${bookingId}`);

/**
 * @param {number} bookingId
 * @param {number} paymentMethodId
 * @returns {Promise<TransactionModalResponse>}
 */
export const postSubmitPayment = (bookingId, paymentMethodId) =>
  api.post('/transactions/submit', {
    booking_id: bookingId,
    payment_method_id: paymentMethodId,
  });

/**
 * @param {number} transactionId
 * @param {number} bookingId
 * @returns {Promise<TicketResultResponse>}
 */
export const postConfirmPayment = (transactionId, bookingId) =>
  api.post('/transactions/confirm', {
    transaction_id: transactionId,
    booking_id: bookingId,
  });

/**
 * @param {number} transactionId
 * @returns {Promise<TicketResultResponse>}
 */
export const fetchTicketResult = (transactionId) =>
  api.get(`/transactions/ticket/${transactionId}`);

/**
 * @param {number} transactionId
 * @returns {Promise<TicketResultResponse>}
 */
export const fetchQrImage = (transactionId) =>
  api.get(`/transactions/qr/${transactionId}`);
