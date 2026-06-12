import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import {
  getOrderDetailSlice,
  getOrderHistorySlice,
} from '../../redux/slices/userSlice';

// const mockTickets = [
//   {
//     id: 1,
//     dateFull: "Tuesday, 07 July 2020 - 04:30pm",
//     movieTitle: "Spider-Man: Homecoming",
//     cinemaName: "CineOne21",
//     ticketStatus: "Ticket in active",
//     paymentStatus: "Not Paid",
//     details: {
//         type: "Payment",
//         virtual: "12321328913829724",
//         total:"$30",
//         dueDate:"June 23, 2023"
//     },
//   },
//   {
//     id: 2,
//     dateFull: "Monday, 14 June 2020 - 02:00pm",
//     movieTitle: "Avengers: End Game",
//     cinemaName: "ebv.id",
//     ticketStatus: "Ticket used",
//     paymentStatus: "Paid",
//     details: {
//       category: "PG-13",
//       time: "2:00pm",
//       seats: "C4, C5, C6",
//       movieShort: "Spider-Man: ..",
//       dateShort: "07 Jul",
//       count: "3 pcs",
//       total: "$30.00",
//       qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TICKET123",
//     },
//   },
// ];

const getBadgeStyles = (status) => {
  switch (status) {
    case 'Active':
    case 'Ticket in active':
      return 'bg-teal-100 text-teal-600';
    case 'Not Paid':
    case 'Unpaid':
      return 'bg-red-100 text-red-500';
    case 'Used':
    case 'Ticket used':
      return 'bg-gray-200 text-gray-500';
    case 'Paid':
      return 'bg-indigo-100 text-indigo-500';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const TicketCard = ({ ticket }) => {
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);

  const { selectedOrderDetail } = useSelector((state) => state.user);
  const ASSET_URL = import.meta.env.VITE_ASSET_URL || 'http://localhost:8080';

  const myDetail = selectedOrderDetail
    ? selectedOrderDetail[ticket.booking_id]
    : undefined;

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success('Virtual Account Copied!');
  };

  const handleToggleExpand = () => {
    if (!isExpanded) {
      if (!myDetail) {
        dispatch(getOrderDetailSlice(ticket.booking_id))
          .unwrap()
          .catch((err) => toast.error(err || 'Failed to Load Ticket Details'));
      }
    }
    setIsExpanded(!isExpanded);
  };
  return (
    <div className="mb-6 w-full rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
      {/* Header Info */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="mb-1 text-sm text-gray-400">{ticket.showtime}</p>
          <h2 className="text-2xl font-semibold text-gray-800">
            {ticket.movie_title}
          </h2>
        </div>
        <div className="text-2xl font-bold tracking-tighter text-blue-900 italic">
          {ticket.cinema_logo && (
            <img
              src={`${ASSET_URL}${ticket.cinema_logo}`}
              alt="logo-cinema"
              className="h-8 object-contain"
            />
          )}
          {/* <span className="">
            {ticket.cinema_name}
          </span> */}
        </div>
      </div>

      {/* Divider */}
      <hr className="mb-6 border-gray-100" />

      {/* Status & Action */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <span
            className={`rounded-md px-6 py-2 text-sm font-medium ${getBadgeStyles(ticket.status_ticket)}`}
          >
            {ticket.status_ticket}
          </span>

          <span
            className={`rounded-md px-6 py-2 text-sm font-medium ${getBadgeStyles(ticket.status_paid)}`}
          >
            {ticket.status_paid}
          </span>
        </div>

        <button
          onClick={handleToggleExpand}
          className="flex items-center gap-2 font-medium text-gray-400 transition-colors hover:text-gray-600"
        >
          {isExpanded ? 'Hide Details' : 'Show Details'}
          <svg
            className={`h-4 w-4 transform transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </button>
      </div>

      {/* Expanded Details Section */}
      {isExpanded && myDetail && (
        <div className="mt-8 border-t border-gray-100 pt-6">
          <h3 className="mb-4 text-lg font-medium text-gray-700">
            Ticket Information
          </h3>

          {ticket.status_paid === 'Not Paid' ||
          ticket.status_paid === 'Unpaid' ? (
            <div className="flex flex-col">
              <div className="mb-4 grid grid-cols-[160px_10px_1fr_auto] items-center gap-y-4">
                <div className="text-sm text-gray-400">Virtual Number</div>
                <div className="text-gray-400">:</div>
                <div className="font-bold text-gray-800">
                  {myDetail.virtua_account || 'No Virtual Account Available'}
                </div>

                <button
                  onClick={() => handleCopy(myDetail.virtua_account)}
                  className="text-primary rounded-md border border-blue-800 px-4 py-2 text-sm font-medium hover:bg-blue-500 hover:text-white"
                >
                  Copy
                </button>

                <div className="text-sm text-gray-400">Total Payment</div>
                <div className="text-gray-400">:</div>
                <div className="items-end font-bold text-gray-800">
                  Rp {(myDetail.total_price || 0).toLocaleString('id-ID')}
                </div>
                <div></div>
              </div>

              {myDetail.due_date && (
                <p className="mt-2 mb-6 rounded-lg border border-red-100 bg-red-50 p-4 text-sm leading-relaxed text-gray-500">
                  Pay this payment bill before it is due, on{' '}
                  <span className="font-bold text-red-500">
                    {myDetail.due_date}
                  </span>
                  . If the bill has not been paid by the specified time, it will
                  be forfeited.
                </p>
              )}

              <button className="bg-primary w-max rounded-md px-6 py-2 text-sm font-medium text-white hover:bg-blue-700">
                Check Payment
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-8 md:flex-row">
              {/* QR Code Placeholder */}
              <div className="h-32 w-32 flex-shrink-0 rounded-md border border-gray-200 bg-gray-50 p-2">
                {myDetail.qr_code ? (
                  <img
                    src={
                      myDetail.qr_code.startsWith('http')
                        ? myDetail.qr_code
                        : `${ASSET_URL}${myDetail.qr_code}`
                    }
                    alt="QR Code"
                    className="h-full w-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=MockTicketData';
                    }}
                  />
                ) : (
                  <span className="text-center text-xs text-gray-400">
                    No QR Code
                  </span>
                )}
              </div>

              {/* Grid Data */}
              <div className="grid flex-grow grid-cols-3 gap-4">
                <div>
                  <p className="mb-1 text-xs text-gray-400">Category</p>
                  <p className="font-semibold text-gray-800">
                    {myDetail.category || '-'}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-xs text-gray-400">Time</p>
                  <p className="font-semibold text-gray-800">
                    {myDetail.showtime_time || '-'}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-xs text-gray-400">Seats</p>
                  <p className="font-semibold text-gray-800">
                    {myDetail.seats && myDetail.seats.length > 0
                      ? myDetail.seats.join(', ')
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-xs text-gray-400">Movie</p>
                  <p className="font-semibold text-gray-800">
                    {myDetail.movie_title}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-xs text-gray-400">Date</p>
                  <p className="font-semibold text-gray-800">
                    {myDetail.showtime_date}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-xs text-gray-400">Count</p>
                  <p className="font-semibold text-gray-800">
                    {myDetail.quantity || 0} pcs
                  </p>
                </div>
              </div>

              {/* Total Price */}
              <div className="flex w-40 flex-col justify-center">
                <p className="mb-1 text-sm text-gray-400">Total</p>
                <p className="text-2xl font-semibold text-gray-900">
                  Rp {(myDetail.total_price || 0).toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function TicketList() {
  const dispatch = useDispatch();
  const { orderHistory, isLoading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getOrderHistorySlice())
      .unwrap()
      .catch((err) => toast.error(err || 'Failed to Load Order History'));
  }, [dispatch]);

  if (isLoading && orderHistory.length === 0) {
    return (
      <div className="py-20 text-center font-sans text-gray-500">
        Loading your history orders...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center rounded-xl bg-gray-50 p-8">
      {orderHistory && orderHistory.length > 0 ? (
        orderHistory.map((ticket) => (
          <TicketCard key={ticket.booking_id} ticket={ticket} />
        ))
      ) : (
        <div className="py-20 text-center text-gray-400">
          Kamu belum memiliki riwayat pemesanan tiket.
        </div>
      )}
    </div>
  );
}
