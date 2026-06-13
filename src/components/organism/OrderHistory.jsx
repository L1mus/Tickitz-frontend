import { useState } from "react";


const mockTickets = [
  {
    id: 1,
    dateFull: "Tuesday, 07 July 2020 - 04:30pm",
    movieTitle: "Spider-Man: Homecoming",
    cinemaName: "CineOne21",
    ticketStatus: "Ticket in active",
    paymentStatus: "Not Paid",
    details: {
        type: "Payment",
        virtual: "12321328913829724",
        total:"$30",
        dueDate:"June 23, 2023"
    }, 
  },
  {
    id: 2,
    dateFull: "Monday, 14 June 2020 - 02:00pm",
    movieTitle: "Avengers: End Game",
    cinemaName: "ebv.id",
    ticketStatus: "Ticket used",
    paymentStatus: "Paid",
    details: {
      category: "PG-13",
      time: "2:00pm",
      seats: "C4, C5, C6",
      movieShort: "Spider-Man: ..", 
      dateShort: "07 Jul",
      count: "3 pcs",
      total: "$30.00",
      qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TICKET123",
    },
  },
];


const getBadgeStyles = (status) => {
  switch (status) {
    case "Ticket in active":
      return "bg-teal-100 text-teal-600";
    case "Not Paid":
      return "bg-red-100 text-red-500";
    case "Ticket used":
      return "bg-gray-200 text-gray-500";
    case "Paid":
      return "bg-indigo-100 text-indigo-500";
    default:
      return "bg-gray-100 text-gray-600";
  }
};


const TicketCard = ({ ticket }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 mb-6 p-8">
      {/* Header Info */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-gray-400 text-sm mb-1">{ticket.dateFull}</p>
          <h2 className="text-2xl font-semibold text-gray-800">
            {ticket.movieTitle}
          </h2>
        </div>
        <div className="text-2xl font-bold text-blue-900 italic tracking-tighter">
          {ticket.cinemaName}
        </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-100 mb-6" />

      {/* Status & Action */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <span
            className={`px-6 py-2 rounded-md font-medium text-sm ${getBadgeStyles(ticket.ticketStatus)}`}>
            {ticket.ticketStatus}
          </span>
          
          <span
            className={`px-6 py-2 rounded-md font-medium text-sm ${getBadgeStyles(ticket.paymentStatus)}`}>
            {ticket.paymentStatus}
          </span>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-gray-400 font-medium hover:text-gray-600 transition-colors"
        >
          {isExpanded ? "Hide Details" : "Show Details"}
          <svg className={`w-4 h-4 transform transition-transform ${
              isExpanded ? "rotate-180" : ""
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
      {isExpanded && ticket.details && (
        <div className="mt-8 pt-6 border-t border-gray-100">
          <h3 className="text-gray-700 font-medium text-lg mb-4">
            Ticket Information
          </h3>
          
          {ticket.details.type === "Payment" ? (
            <div className="flex flex-col">
                <div className="grid grid-cols-[160px_10px_1fr_auto] gap-y-4 items-center mb-4">

                    <div className="text-gray-400 text-sm">Virtual Number</div>
                    <div className="text-gray-400">:</div>
                    <div className="text-gray-800 font-bold">
                        {ticket.details.virtual}
                    </div>

                    <button
                        onClick={() => handleCopy(ticket.details.virtual)}
                        className="border border-blue-800 text-primary px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-500 hover:text-white"> 
                        Copy
                    </button>

                    <div className="text-gray-400 text-sm">Total Payment</div>
                    <div className="text-gray-400">:</div>
                    <div className="text-gray-800 font-bold items-end">
                        {ticket.details.total}
                    </div>
                    <div></div>
                </div>

                <p className="text-grey leading-relaxed mb-6">
                    Pay this payment bill before it is due, on {" "} <span className="text-red-500">{ticket.details.dueDate}</span>. If the bill has not been paid by the specified time, it will be forfeited
                </p>

                <button className="bg-primary hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium w-max">
                    Check Payment
                </button>
            </div>
          ) : (
           <div className="flex flex-col md:flex-row gap-8">
            {/* QR Code Placeholder */}
            <div className="w-32 h-32 flex-shrink-0 bg-gray-50 p-2 border border-gray-200 rounded-md">
              <img
                src={ticket.details.qrCodeUrl}
                alt="QR Code"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Grid Data */}
            <div className="flex-grow grid grid-cols-3 gap-y-6 gap-x-4">
              <div>
                <p className="text-gray-400 text-xs mb-1">Category</p>
                <p className="font-semibold text-gray-800">{ticket.details.category}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Time</p>
                <p className="font-semibold text-gray-800">{ticket.details.time}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Seats</p>
                <p className="font-semibold text-gray-800">{ticket.details.seats}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Movie</p>
                <p className="font-semibold text-gray-800">{ticket.details.movieShort}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Date</p>
                <p className="font-semibold text-gray-800">{ticket.details.dateShort}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Count</p>
                <p className="font-semibold text-gray-800">{ticket.details.count}</p>
              </div>
            </div>

            {/* Total Price */}
            <div className="w-32 flex flex-col justify-center">
              <p className="text-gray-400 text-sm mb-1">Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {ticket.details.total}
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

  return (
    <div className="min-h-screen bg-gray-50 rounded-xl p-8 flex flex-col items-center font-sans">
      {mockTickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}