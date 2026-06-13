
export default function SeatGrid({ seats = [], selectedIds = [], onToggle }) {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];;
  const leftCols = [1, 2, 3, 4, 5, 6, 7];
  const rightCols = [8, 9, 10, 11, 12, 13, 14];

  const findSeat = (row, col) => seats.find((s) => s.row === row && s.seatNumber === col);

  const renderBlock = (row, colsBlock, isNumberRow = false) => {
    return colsBlock.map((col, index) => {
      const isLastInBlock = index === colsBlock.length - 1;
      const isLoveNest = row === 'G';
      const isOdd = col % 2 !== 0;
      let marginClass = !isLastInBlock ? 'mr-2 md:mr-3' : '';
      
      if (isLoveNest && !isNumberRow) {
        if (isOdd) {
          marginClass = '';
        } else if (!isLastInBlock) {
          marginClass = 'mr-4 md:mr-6';
        }
      }

      if (isNumberRow) {
        return (
          <div key={`num-${col}`} className={`h-6 w-6 md:h-8 md:w-8 flex items-center justify-center text-xs md:text-sm font-semibold text-gray-400 ${marginClass}`}>
            {col}
          </div>
        );
      }

      const seat = findSeat(row, col);
      if (!seat) {
        return <div key={`empty-${row}-${col}`} className={`h-6 w-6 md:h-8 md:w-8 shrink-0 ${marginClass}`} />;
      }

      const isSold = seat.status?.toLowerCase() === 'sold';
      const isSelected = selectedIds.includes(seat.id);

      let radiusClass = 'rounded-md';
      if (isLoveNest) {
        radiusClass = isOdd 
          ? 'rounded-l-lg rounded-r-none border-r border-white/20' 
          : 'rounded-r-lg rounded-l-none border-l border-white/20';
      }

      let bgClass = 'bg-[#D6D8E7] hover:bg-primary/40';
      if (isSold) {
        bgClass = 'bg-darkgrey cursor-not-allowed';
      } else if (isSelected) {
        bgClass = 'bg-primary shadow-[0_2px_8px_rgba(18,66,223,0.4)] text-white';
      } else if (isLoveNest) {
        bgClass = 'bg-[#F472B6] hover:bg-[#db2777]';
      }

      return (
        <button
          key={col}
          type="button"
          disabled={isSold}
          onClick={() => onToggle(seat)}
          title={`Row ${seat.row} - Seat ${seat.seatNumber}`}
          className={`h-6 w-6 md:h-8 md:w-8 transition-all duration-200 ${marginClass} ${radiusClass} ${bgClass}`}
        />
      );
    });
  };

  return (
    <div className="flex flex-col gap-2 md:gap-3 select-none mx-auto w-max py-4">
      {rows.map((row) => (
        <div key={row} className="flex items-center">
          {/* Label Baris Kiri */}
          <div className="w-6 md:w-8 text-left text-xs md:text-sm font-bold text-gray-400 mr-2 md:mr-4">
            {row}
          </div>

          {/* Blok Kursi Kiri (1-7) */}
          <div className="flex">
            {renderBlock(row, leftCols)}
          </div>

          {/* Lorong Jalan Tengah */}
          <div className="w-8 md:w-14" />

          {/* Blok Kursi Kanan (8-14) */}
          <div className="flex">
            {renderBlock(row, rightCols)}
          </div>
        </div>
      ))}

      {/* Angka Penunjuk Kolom */}
      <div className="flex items-center mt-2">
        <div className="w-6 md:w-8 mr-2 md:mr-4" /> {/* Spacing mengimbangi huruf */}
        <div className="flex">
          {renderBlock('NUM', leftCols, true)}
        </div>
        <div className="w-8 md:w-14" />
        <div className="flex">
          {renderBlock('NUM', rightCols, true)}
        </div>
      </div>
    </div>
  );
}