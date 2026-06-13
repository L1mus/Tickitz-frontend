export default function SeatBlock({ row, cols, seats, selectedIds, onToggle }) {
  
  const getSeatStyle = (seat, isSelected) => {
    if (!seat) return 'bg-transparent pointer-events-none';
    if (seat.status === 'Sold') return 'bg-gray-300 cursor-not-allowed opacity-40';
    if (isSelected) return 'bg-[#5F2EEA] shadow-[0_2px_8px_rgba(95,46,234,0.4)]';
    if (seat.seatType && seat.seatType.includes('love')) return 'bg-pink-400 hover:bg-pink-500';
    
    return 'bg-[#D0D0E8] hover:bg-[#5F2EEA]/30';
  };

  return (
    <div className="flex gap-2">
      {cols.map((col) => {
        const seat = seats.find(
          (s) => s.row.toUpperCase() === row.toUpperCase() && s.seatNumber === col
        );
        const isSelected = seat ? selectedIds.includes(seat.id) : false;

        let shapeClass = 'rounded-md';
        let spacingClass = '';

        if (seat?.seatType && seat.seatType.includes('love')) {
          const isLeftPart = col % 2 !== 0;
          
          if (isLeftPart) {
            shapeClass = 'rounded-l-xl rounded-r-none border-r border-black/5 z-10';
          } else {
            shapeClass = 'rounded-r-xl rounded-l-none border-l border-black/5 z-0';
            spacingClass = '-ml-2'; 
          }
        }

        return (
          <button
            key={`${row}-${col}`}
            type="button"
            disabled={!seat || seat.status === 'Sold'}
            onClick={() => seat && onToggle(seat)}
            title={seat ? `${seat.row.toUpperCase()}${seat.seatNumber} (${seat.seatType})` : 'Empty'}
            className={`h-7 w-7 transition-all flex items-center justify-center text-transparent text-[0px] select-none
              ${shapeClass}
              ${spacingClass}
              ${getSeatStyle(seat, isSelected)}
            `}
          >
            {row}{col}
          </button>
        );
      })}
    </div>
  );
}