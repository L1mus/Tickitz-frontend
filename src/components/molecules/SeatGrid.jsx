export default function SeatGrid({ seats = [], selectedIds = [], onToggle }) {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const leftCols = [1, 2, 3, 4, 5, 6, 7];
  const rightCols = [8, 9, 10, 11, 12, 13, 14];

  const findSeat = (row, col) => seats.find((s) => s.row === row && s.seatNumber === col);

  const renderBlock = (row, colsBlock, isNumberRow = false) => {
    return colsBlock.map((col, index) => {
      const isLastInBlock = index === colsBlock.length - 1;
      
      const seat = findSeat(row, col);
      const isLoveNest = row === 'G' || seat?.seatType?.toLowerCase().includes('love');
      const isOdd = col % 2 !== 0;
      
      let marginClass = !isLastInBlock ? 'mr-2 md:mr-3' : '';
      
      // Logika margin khusus Love Nest agar menyatu per pasang (1-2, 3-4, 5-6, 7-8, dst)
      if (isLoveNest && !isNumberRow) {
        if (isOdd) {
          marginClass = '';
        } else if (!isLastInBlock) {
          marginClass = 'mr-5.5 md:mr-8.25'; 
        }
      }

      // Render untuk baris angka penunjuk kolom di bagian bawah
      if (isNumberRow) {
        return (
          <div 
            key={`num-${col}`} 
            className="h-6 w-6 md:h-8 md:w-8 flex items-center justify-center text-xs md:text-sm font-bold text-gray-500 mr-2 md:mr-3 last:mr-0"
          >
            {col}
          </div>
        );
      }

      // Jika data kursi tidak ditemukan (kosong/lorong)
      if (!seat) {
        return <div key={`empty-${row}-${col}`} className="h-6 w-6 md:h-8 md:w-8 shrink-0" />;
      }

      const isSold = seat.status?.toLowerCase() === 'sold';
      const isSelected = selectedIds.includes(seat.id);

      // Membuat sudut melengkung khas sofa gandeng (kiri melengkung kiri saja, kanan melengkung kanan saja)
      let radiusClass = 'rounded-md';
      if (isLoveNest) {
        radiusClass = isOdd 
          ? 'rounded-l-xl rounded-r-none border-r border-white/10' 
          : 'rounded-r-xl rounded-l-none border-l border-white/10';
      }

      // Pengaturan warna latar belakang kursi
      let bgClass = 'bg-[#D0D0E8] hover:bg-primary/30';
      if (isSold) {
        bgClass = 'bg-darkgrey cursor-not-allowed text-transparent';
      } else if (isSelected) {
        bgClass = 'bg-primary text-white shadow-[0_2px_6px_rgba(18,66,223,0.4)]';
      } else if (isLoveNest) {
        bgClass = 'bg-pink-400 hover:bg-pink-500 text-white';
      }

      return (
        <button
          key={`${row}-${col}`}
          type="button"
          disabled={isSold}
          onClick={() => onToggle(seat)}
          title={`Row ${seat.row} - Seat ${seat.seatNumber} (${seat.seatType})`}
          className={`h-6 w-6 md:h-8 md:w-8 transition-all duration-200 flex items-center justify-center text-[10px] font-bold ${marginClass} ${radiusClass} ${bgClass}`}
        >
        </button>
      );
    });
  };

  return (
    <div className="flex flex-col gap-2 md:gap-3 select-none mx-auto w-max py-4">
      {rows.map((row) => {
        const isLoveNestRow = row === 'G' || seats.some(s => s.row === row && s.seatType?.toLowerCase().includes('love'));

        return (
          <div key={row} className="flex items-center">
            {/* Label Baris Kiri (A, B, C...) */}
            <div className="w-6 md:w-8 text-left text-xs md:text-sm font-bold text-gray-400 mr-2 md:mr-4">
              {row}
            </div>

            {isLoveNestRow ? (
              <div className="flex">
                {renderBlock(row, [...leftCols, ...rightCols])}
              </div>
            ) : (
              /* Layout Normal dengan Lorong Tengah untuk Baris Reguler */
              <>
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
              </>
            )}
          </div>
        );
      })}

      {/* ANGKA PENUNJUK KOLOM (1 - 14) DI BAGIAN BAWAH */}
      <div className="flex items-center mt-3">
        <div className="w-6 md:w-8 mr-2 md:mr-4" /> {/* Spacer penyeimbang label baris */}
        
        <div className="flex">
          {renderBlock(null, leftCols, true)}
        </div>

        <div className="w-5 md:w-14" /> {/* Lorong Tengah untuk Label Angka */}

        <div className="flex">
          {renderBlock(null, rightCols, true)}
        </div>
      </div>
    </div>
  );
}