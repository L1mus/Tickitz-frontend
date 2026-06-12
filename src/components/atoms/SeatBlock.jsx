function getSeatStyle(seat, isSelected) {
  if (!seat) return '';
  if (seat.status === 'Sold')
    return 'bg-[#4E4B66] cursor-not-allowed opacity-80';
  if (isSelected) return 'bg-primary cursor-pointer';
  if (seat.seatType === 'love_nest')
    return 'bg-[#F589D7] cursor-pointer hover:opacity-75';
  return 'bg-[#D0D0E8] cursor-pointer hover:bg-primary/40';
}

export default function SeatBlock({
  rows,
  cols,
  seats,
  selectedIds,
  onToggle,
  displayRow,
}) {
  const getSeat = (row, col) =>
    seats.find((s) => s.row === row && s.seatNumber === col);

  return (
    <div className="flex flex-col gap-1.5">
      {rows.map((row) => (
        <div key={row} className="flex gap-1.5">
          {cols.map((col) => {
            const seat = getSeat(row, col);
            const isSelected = selectedIds.includes(seat?.id);
            return (
              <button
                key={col}
                type="button"
                disabled={seat?.status === 'Sold'}
                onClick={() => seat && seat.status !== 'Sold' && onToggle(seat)}
                title={seat ? `${displayRow}${col}` : ''}
                className={`h-7 w-7 rounded-sm transition-colors ${getSeatStyle(seat, isSelected)} `}
              />
            );
          })}
        </div>
      ))}

      {/* Nomor kolom */}
      <div className="mt-1 flex gap-1.5">
        {cols.map((col) => (
          <span key={col} className="w-7 text-center text-[11px] text-gray-400">
            {col}
          </span>
        ))}
      </div>
    </div>
  );
}
