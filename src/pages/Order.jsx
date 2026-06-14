import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  getSeatPage,
  createBooking,
  toggleSeat,
  clearSelectedSeats,
  resetBooking,
} from '../redux/slices/orderSlice';
import SeatGrid from '../components/molecules/SeatGrid';
import SeatingKey from '../components/atoms/SeatingKey';
import SummaryCard from '../components/organism/SummaryCard';
import Stepper from '../components/molecules/Stepper'

// ─── Main Component 
export default function OrderPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const showtimeIdStr = searchParams.get('showtime_id');
  const showtimeId = showtimeIdStr ? parseInt(showtimeIdStr, 10) : null;

  const seatPage = useSelector((state) => state.order.seatPage);
  const selectedSeats = useSelector((state) => state.order.selectedSeats);
  const booking = useSelector((state) => state.order.booking);

  const selectedIds = selectedSeats.map((s) => s.id);

  useEffect(() => {
    if (showtimeId) {
      dispatch(getSeatPage(showtimeId));
    }
    dispatch(clearSelectedSeats());
    dispatch(resetBooking());
  }, [dispatch, showtimeId]);

  const handleToggleSeat = (seat) => {
    dispatch(toggleSeat(seat));
  };

  const handleCheckout = () => {
    if (!showtimeId || selectedSeats.length === 0) return;
    const payload = {
      showtime_id: showtimeId,
      seat_ids: selectedSeats.map((s) => s.id),
      quantity: selectedSeats.length,
    };

    dispatch(createBooking(payload))
      .unwrap()
      .then((data) => {
        if (data?.booking_id) navigate(`/users/payment/${data.booking_id}`);
      })
      .catch((err) => console.error('Booking failed:', err));
  };

  if (seatPage.loading && !seatPage.seats.length) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f6f8]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f6f8] flex-col font-sans antialiased  flex justify-center items-center">
      
      {/* Container Stepper Atas */}
      <div className="bg-transparent rounded-b-2xl mb-7 mt-7 w-full px-4 md:px-30">
        <Stepper
            steps={['Dates And Time', 'Seat', 'Payment']}
            activeStep={1}
            showCheck={true}
          />
      </div>

      {/* Konten Halaman */}
      <main className="container mx-auto flex flex-col items-start gap-8 pb-16 lg:flex-row px-4 xl:px-8 max-w-7xl">
        
        {/* PANEL KIRI: Header Film & Kursi */}
        <div className="flex-1 w-full flex flex-col gap-6 overflow-hidden">
          
          {/* Header Informasi Film Card */}
          {seatPage.summary && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-xl bg-white p-6 md:p-8 shadow-sm border border-gray-100 gap-6">
              <div className="flex gap-6 items-center">
                <img 
                  src={seatPage.summary.movie_poster} 
                  alt={seatPage.summary.movie_title} 
                  className="w-16 h-24 sm:w-20 sm:h-28 object-cover rounded-lg shadow-sm bg-gray-100"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div className="flex flex-col gap-1.5">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                    {seatPage.summary.movie_title}
                  </h1>
                  <p className="text-sm font-medium text-gray-500">
                    {seatPage.summary.cinema_name}
                  </p>
                  <p className="text-sm font-medium text-gray-500">
                    {new Date(seatPage.summary.show_date).toLocaleDateString('id-ID', {
                      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                    })} • {seatPage.summary.show_time?.slice(0, 5)} WIB
                  </p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/')} 
                className="text-sm font-bold text-primary bg-primary/10 hover:bg-primary/20 px-6 py-3 rounded-lg transition-all self-end sm:self-center shrink-0"
              >
                Change Movie
              </button>
            </div>
          )}

          {/* Area Denah Kursi Card */}
          <div className="rounded-xl bg-white p-6 md:p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-8">Choose Seat</h2>
            
            {/* Indikator Layar */}
            <div className="mb-10 w-full flex flex-col items-center">
              <div className="h-2 w-4/5 max-w-md bg-gray-300 rounded-t-full shadow-[0_4px_12px_rgba(0,0,0,0.1)]" />
              <p className="mt-3 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Screen</p>
            </div>

            {/* Render Grid Kursi */}
            <div className="overflow-x-auto scrollbar-hide pb-4">
              <SeatGrid
                seats={seatPage.seats}
                selectedIds={selectedIds}
                onToggle={handleToggleSeat}
              />
            </div>

            {/* Key / Legend */}
            <div className="mt-8 border-t border-gray-100 pt-6">
              <SeatingKey />
            </div>
          </div>

          {booking?.error && (
            <div className="mt-2 rounded-xl bg-red-50 border border-red-100 px-5 py-3 text-center text-sm font-medium text-red-600">
              ⚠️ {booking.error}
            </div>
          )}
        </div>

        {/* PANEL KANAN: Order Info / Summary */}
        {seatPage.summary && (
          <div className="w-full shrink-0 lg:w-87.5 xl:w-100 lg:sticky lg:top-6">
            <SummaryCard
              summary={seatPage.summary}
              selectedSeats={selectedSeats}
              onCheckout={handleCheckout}
              isLoading={booking?.loading}
            />
          </div>
        )}

      </main>
    </div>
  );
}