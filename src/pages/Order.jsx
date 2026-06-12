import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router';
import Header from '../components/organism/Header';
import Footer from '../components/organism/Footer';
import Stepper from '../components/molecules/Stepper';
import { Button } from '../components/atoms/Button';
import SeatGrid from '../components/molecules/SeatGrid';
import SeatingKey from '../components/atoms/SeatingKey';
import SummaryCard from '../components/organism/SummaryCard';
import {
  getSeatPage,
  createBooking,
  toggleSeat,
  toggleLoveNestPair,
  clearSelectedSeats,
  resetBooking,
  selectSeatPage,
  selectSelectedSeats,
  selectBooking,
} from '../redux/slices/orderSlice';

const STEPS = ['Dates And Time', 'Seat', 'Payment'];

export default function OrderPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const showtimeId = Number(params.get('showtime_id'));

  const seatPage = useSelector(selectSeatPage);
  const selectedSeats = useSelector(selectSelectedSeats);
  const booking = useSelector(selectBooking);

  useEffect(() => {
    if (!showtimeId) return;
    dispatch(getSeatPage(showtimeId));
    return () => {
      dispatch(clearSelectedSeats());
      dispatch(resetBooking());
    };
  }, [dispatch, showtimeId]);

  useEffect(() => {
    if (booking.bookingId) {
      navigate(`/payment?booking_id=${booking.bookingId}`);
    }
  }, [booking.bookingId, navigate]);

  const handleToggleSeat = (ids, action) => {
    const seatMap = {};
    seatPage.seats.forEach((s) => {
      seatMap[`${s.row}${s.seat_number}`] = s;
    });

    if (action === 'select' || action === 'deselect') {
      const seatObjects = ids.map((id) => seatMap[id]).filter(Boolean);
      dispatch(toggleLoveNestPair({ seats: seatObjects, action }));
    } else {
      const seat = seatMap[ids[0]];
      if (seat && seat.seat_status !== 'Sold') {
        dispatch(toggleSeat(seat));
      }
    }
  };

  const handleCheckout = () => {
    if (selectedSeats.length === 0) return;
    dispatch(
      createBooking({
        showtime_id: showtimeId,
        seat_ids: selectedSeats.map((s) => s.seat_id),
        quantity: selectedSeats.length,
      })
    );
  };

  if (seatPage.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-t-primary h-10 w-10 animate-spin rounded-full border-4 border-gray-200" />
      </div>
    );
  }

  if (seatPage.error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">{seatPage.error}</p>
      </div>
    );
  }

  const selectedIds = selectedSeats.map((s) => `${s.row}${s.seat_number}`);

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F6FA]">
      <Header />

      <main className="flex-1 px-5 py-8 md:px-16 lg:px-24">
        <div className="mb-8 flex justify-center">
          <Stepper steps={STEPS} activeStep={1} showCheck />
        </div>

        <div className="flex flex-col items-start gap-6 lg:flex-row">
          {/* Panel Kiri */}
          <div className="min-w-0 flex-1">
            {/* Movie info */}
            {seatPage.summary && (
              <div className="mb-5 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <img
                    src={seatPage.summary.movie_poster}
                    alt={seatPage.summary.movie_title}
                    className="h-28 w-20 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <h2 className="mb-2 text-lg font-bold text-gray-900">
                      {seatPage.summary.movie_title}
                    </h2>
                    <span className="rounded-full border border-gray-300 px-3 py-0.5 text-xs text-gray-500">
                      {seatPage.summary.category}
                    </span>
                    <p className="mt-2 text-sm text-gray-500">
                      {seatPage.summary.show_time}
                    </p>
                  </div>
                  <Button
                    color="blue"
                    shape="rectangle"
                    className="shrink-0 px-4 py-2 text-sm"
                    onClick={() => navigate(-1)}
                  >
                    Change
                  </Button>
                </div>
              </div>
            )}

            {/* Seat Grid */}
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-6 text-lg font-bold text-gray-900">
                Choose Your Seat
              </h3>

              {/* Screen indicator */}
              <p className="mb-2 text-center text-xs tracking-widest text-gray-400 uppercase">
                Screen
              </p>
              <div className="mx-auto mb-6 h-1 w-[70%] rounded-sm bg-gray-200" />

              <div className="overflow-x-auto">
                <SeatGrid
                  seats={seatPage.seats}
                  selectedIds={selectedIds}
                  onToggle={handleToggleSeat}
                />
              </div>

              <SeatingKey />
            </div>

            {/* Error booking */}
            {booking.error && (
              <p className="mt-3 text-center text-sm text-red-500">
                {booking.error}
              </p>
            )}
          </div>

          {/* Panel Kanan */}
          {seatPage.summary && (
            <div className="w-full shrink-0 lg:w-72 xl:w-80">
              <SummaryCard
                summary={seatPage.summary}
                selectedSeats={selectedSeats}
                onCheckout={handleCheckout}
                isLoading={booking.loading}
              />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
