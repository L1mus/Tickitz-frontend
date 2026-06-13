import { Button } from '../atoms/Button';

export default function SummaryCard({
  summary,
  selectedSeats = [],
  onCheckout,
  isLoading = false,
}) {
  const totalPrice = summary.ticket_price * selectedSeats.length;

  const sortedSeats = [...selectedSeats].sort((a, b) => {
    if (a.row !== b.row) return a.row.localeCompare(b.row);
    return a.seatNumber - b.seatNumber;
  });

  const seatLabels = sortedSeats.map((s) => `${s.row}${s.seatNumber}`).join(', ');

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm font-main">
      {/* Brand Informasi Bioskop */}
      <div className="mb-6 flex flex-col items-center text-center">
        {summary.cinema_logo ? (
          <img
            src={summary.cinema_logo}
            alt={summary.cinema_name}
            className="h-10 object-contain mb-2"
          />
        ) : (
          <div className="h-10 w-10 bg-gray-100 rounded-full mb-2" />
        )}
        <h4 className="text-lg font-bold text-darkgrey">{summary.cinema_name}</h4>
      </div>

      <h5 className="mb-4 text-sm font-bold tracking-wide text-grey uppercase">
        Order Summary
      </h5>

      {/* Rincian Baris */}
      <div className="space-y-3.5">
        <div className="flex items-start justify-between text-sm">
          <span className="text-grey font-medium">Movie selected</span>
          <span className="text-right font-bold text-darkgrey max-w-[60%]">{summary.movie_title}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-grey font-medium">Date</span>
          <span className="font-bold text-darkgrey">{formatDate(summary.show_date)}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-grey font-medium">Time</span>
          <span className="font-bold text-darkgrey">{summary.show_time}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-grey font-medium">One ticket price</span>
          <span className="font-bold text-darkgrey">{formatCurrency(summary.ticket_price)}</span>
        </div>

        <div className="flex items-start justify-between text-sm">
          <span className="text-grey font-medium">Seat choosed</span>
          <span className="max-w-[60%] text-right font-bold text-primary wrap-break-word">
            {seatLabels || '—'}
          </span>
        </div>
      </div>

      {/* Pembatas Total */}
      <div className="mt-6 flex items-center justify-between border-t border-dashed border-gray-200 pt-5">
        <span className="text-base font-bold text-darkgrey">Total Payment</span>
        <span className="text-2xl font-black text-primary">
          {formatCurrency(totalPrice)}
        </span>
      </div>

      {/* Tombol Aksi Utama */}
      <Button
        color="blue"
        size="full"
        shape="rectangle"
        className="mt-6 w-full py-3 font-bold uppercase tracking-wider text-sm transition-all shadow-md bg-primary text-white rounded-lg hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={onCheckout}
        disabled={selectedSeats.length === 0 || isLoading}
      >
        {isLoading ? 'Processing...' : 'Checkout now'}
      </Button>
    </div>
  );
}