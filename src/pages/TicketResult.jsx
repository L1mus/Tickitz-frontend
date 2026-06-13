import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getTicketResult } from '../redux/slices/transactionSlice';

const TicketResult = () => {
  const { transactionId } = useParams();
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: dataTicket, loading } = useSelector(
    (state) => state.transaction.ticketResult || {}
  );

  useEffect(() => {
    if (transactionId) {
      dispatch(getTicketResult(transactionId));
    }
  }, [transactionId, dispatch]);

  const ticket = dataTicket || {};

  const formatTicketDate = (dateString) => {
    if (!dateString) return '07 Jul';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
  };

  const formatTicketTime = (timeString) => {
    if (!timeString) return '2:00pm';
    const [hours, minutes] = timeString.split(':');
    const hourInt = parseInt(hours, 10);
    const ampm = hourInt >= 12 ? 'pm' : 'am';
    const formattedHour = hourInt % 12 || 12;
    return `${formattedHour}:${minutes}${ampm}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#F5F6F8]">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F5F6F8] antialiased print:bg-white print:min-h-0 print:block">
      <div className="grid w-full flex-1 grid-cols-1 lg:grid-cols-7 print:block">
        <div className="relative flex min-h-[45vh] flex-col justify-between bg-gray-900 p-8 md:p-16 lg:col-span-4 lg:min-h-0 print:hidden">
          {/* Background Poster Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1025&auto=format&fit=crop"
              alt="Cinematic Backdrop"
              className="h-full w-full object-cover opacity-30 brightness-100 grayscale filter"
            />
            <div className="absolute inset-0 bg-linear-to-r from-black/95 via-black/80 to-transparent" />
          </div>

          {/* Brand Logo */}
          <div className="relative z-10">
            <span className="block text-4xl font-black tracking-tight text-white md:text-5xl">
              Tickitz<span className="text-blue-500">.</span>
            </span>
          </div>

          {/* Konten Teks Tengah */}
          <div className="relative z-10 my-auto flex max-w-xl flex-1 flex-col justify-center">
            <h1 className="text-3xl leading-tight font-extrabold tracking-tight text-white md:text-5xl">
              Thankyou For Purchasing
            </h1>
            <p className="mt-4 max-w-2xl text-xs leading-relaxed font-normal text-gray-400 opacity-80 md:text-sm">
              Life is like a movie. Sometimes we just need to step inside,
              settle into a comfortable seat, and let ourselves be swept away by
              an inspiring story. Let's take a moment today to unwind and find
              new motivation on the big screen!
            </p>
          </div>

          {/* Bottom Link Indicator */}
          <div className="relative z-10 pt-6 lg:pt-0">
            <a
              href="#ticket-view"
              className="group inline-flex items-center gap-2 text-xs font-semibold text-white/70 transition-colors hover:text-white"
            >
              <span>Please Download Your Ticket</span>
              <span className="transform transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>
        </div>
        <div
          id="ticket-view"
          className="flex flex-col items-center justify-center bg-[#F5F6F8] p-6 md:p-12 lg:col-span-3 print:p-0 print:bg-white print:pt-50 "
        >
          <div className="relative flex w-full max-w-72.5 flex-col overflow-hidden rounded-2xl bg-white shadow-lg print:shadow-none print:border-2 print:border-darkgrey">
            <div className="flex justify-center bg-white pt-8 pb-6">
              <div className="flex h-36 w-36 items-center justify-center">
                <img
                  src={`http://localhost:8080/api/transactions/qr/${transactionId}`}
                  alt="QR Code Ticket"
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket?.qr_code}`;
                  }}
                />
              </div>
            </div>

            {/* Garis Sobekan Gunting Tengah (Dot Lingkaran & Dashed Line) */}
            <div className="relative flex h-4 w-full items-center bg-white">
              <div className="absolute -left-2 h-4 w-4 rounded-full bg-[#F5F6F8]" />
              <div className="mx-4 w-full border-t border-dashed border-darkgrey" />
              <div className="absolute -right-2 h-4 w-4 rounded-full bg-[#F5F6F8]" />
            </div>

            {/* Bagian Bawah: Data Detail Metadata Komponen */}
            <div className="flex-1 bg-white px-6 pt-5 pb-5 font-sans text-[11px]">
              <div className="relative grid grid-cols-2 gap-y-4">
                {/* GARIS PUTUS-PUTUS VERTIKAL UTAMA (HANYA DI TENGAH) */}
                <div className="absolute inset-y-0 left-1/2 ml-[-0.5px] " />

                {/* Kolom 1 (Movie) */}
                <div className="pr-2">
                  <span className="block text-[10px] font-normal tracking-wide text-gray-400">
                    Movie
                  </span>
                  <span className="mt-0.5 block truncate font-bold text-gray-800">
                    {ticket?.movie_title}
                  </span>
                </div>
                {/* Kolom 2 (Category) */}
                <div className="pl-4">
                  <span className="block text-[10px] font-normal tracking-wide text-gray-400">
                    Category
                  </span>
                  <span className="mt-0.5 block font-bold text-gray-800">
                    {ticket?.category || ''}
                  </span>
                </div>

                {/* Kolom 3 (Date) */}
                <div className="pt-1 pr-2">
                  <span className="block text-[10px] font-normal tracking-wide text-gray-400">
                    Date
                  </span>
                  <span className="mt-0.5 block font-bold text-gray-800">
                    {formatTicketDate(ticket?.show_date || '')}{' '}
                  </span>
                </div>
                {/* Kolom 4 (Time) */}
                <div className="pt-1 pl-4">
                  <span className="block text-[10px] font-normal tracking-wide text-gray-400">
                    Time
                  </span>
                  <span className="mt-0.5 block font-bold text-gray-800">
                    {formatTicketTime(ticket?.show_time)}{' '}
                    {/* SEBELUMNYA: ShowTime */}
                  </span>
                </div>

                {/* Kolom 5 (Count) */}
                <div className="pt-1 pr-2">
                  <span className="block text-[10px] font-normal tracking-wide text-gray-400">
                    Count
                  </span>
                  <span className="mt-0.5 block font-bold text-gray-800">
                    {ticket?.ticket_count} pcs
                  </span>
                </div>
                {/* Kolom 6 (Seats) */}
                <div className="pt-1 pl-4">
                  <span className="block text-[10px] font-normal tracking-wide text-gray-400">
                    Seats
                  </span>
                  <span className="mt-0.5 block font-bold tracking-wide text-gray-800">
                    {ticket?.seat_labels}
                  </span>
                </div>
              </div>

              {/* HARGA TOTAL DI BAGIAN BAWAH TIKET */}
              <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4 text-xs font-semibold">
                <span className="font-medium text-gray-800">Total</span>
                <span className="text-sm font-bold text-gray-900">
                  {ticket?.total_price
                    ? new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                      }).format(ticket.total_price)
                    : 'Rp 0'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex w-full max-w-72.5 flex-col gap-3 print:hidden">
            <button
              onClick={() => window.print()}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-blue-600 bg-white px-6 py-3 text-xs font-bold text-blue-600 transition-all hover:bg-gray-50"
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full rounded-lg bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketResult;
