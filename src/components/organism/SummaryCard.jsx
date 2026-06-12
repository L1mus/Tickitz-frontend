import { Button } from '../atoms/Button';

/**
 * SummaryCard — panel kanan di Seat Page.
 *
 * Props:
 * @param {object}   summary              - ShowtimeSummary dari API (snake_case)
 * @param {string}   summary.cinema_logo
 * @param {string}   summary.cinema_name
 * @param {string}   summary.movie_title
 * @param {string}   summary.show_date    - e.g. "2020-07-07"
 * @param {string}   summary.show_time    - e.g. "13:00 PM"
 * @param {number}   summary.ticket_price
 * @param {Array}    selectedSeats        - array seat object dari Redux
 *                                          shape: { seat_id, row, seat_number, seat_type }
 * @param {function} onCheckout           - dipanggil saat klik "Checkout now"
 * @param {boolean}  isLoading            - disable tombol saat createBooking loading
 */

const ROW_ORDER = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L'];

export default function SummaryCard({
  summary,
  selectedSeats = [],
  onCheckout,
  isLoading = false,
}) {
  const totalPrice = summary.ticket_price * selectedSeats.length;

  // Sort seat dan buat label "C4, C5, F11" dll
  const seatLabels = [...selectedSeats]
    .sort((a, b) => {
      const rowDiff = ROW_ORDER.indexOf(a.row) - ROW_ORDER.indexOf(b.row);
      return rowDiff !== 0 ? rowDiff : a.seat_number - b.seat_number;
    })
    .map((s) => `${s.row}${s.seat_number}`)
    .join(', ');

  // Format show_date "2020-07-07" → "Tuesday, 07 July 2020"
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="sticky top-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      {/* Cinema logo + nama */}
      <div className="mb-5 flex flex-col items-center border-b border-gray-100 pb-5">
        {summary.cinema_logo ? (
          <img
            src={summary?.cinema_logo}
            alt={summary.cinema_name}
            className="mb-2 h-5 object-contain"
          />
        ) : (
          <p className="mb-2 text-base font-bold text-blue-600 italic">
            {summary.cinema_name}
          </p>
        )}
        <p className="text-sm font-bold text-gray-800">{summary.cinema_name}</p>
      </div>

      {/* Info rows */}
      <div className="space-y-3 text-sm">
        <Row label="Movie selected">
          <span className="max-w-37.5 truncate text-right font-semibold text-gray-800">
            {summary.movie_title}
          </span>
        </Row>

        <Row label={formatDate(summary.show_date)}>
          <span className="font-semibold text-gray-800">
            {summary.show_time}
          </span>
        </Row>

        <Row label="One ticket price">
          <span className="font-semibold text-gray-800">
            ${summary.ticket_price}
          </span>
        </Row>

        <Row label="Seat choosed">
          <span className="max-w-37.5 text-right leading-snug font-semibold text-gray-800">
            {seatLabels || '—'}
          </span>
        </Row>
      </div>

      {/* Total */}
      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
        <span className="font-bold text-gray-800">Total Payment</span>
        <span className="text-primary text-2xl font-bold">${totalPrice}</span>
      </div>

      {/* Checkout button — disabled saat tidak ada kursi dipilih atau loading */}
      <Button
        color="blue"
        size="full"
        shape="rectangle"
        className="mt-5 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
        onClick={onCheckout}
        disabled={selectedSeats.length === 0 || isLoading}
      >
        {isLoading ? 'Memproses...' : 'Checkout now'}
      </Button>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <span className="shrink-0 text-gray-400">{label}</span>
      {children}
    </div>
  );
}
