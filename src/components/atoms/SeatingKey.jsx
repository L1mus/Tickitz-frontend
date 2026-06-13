/**
 * SeatingKey — legenda warna kursi di Seat Page.
 * Konsisten dengan visual SeatGrid: LoveNest tampil sebagai dua kotak menyatu.
 */
const SeatingKey = () => {
  const newLocal = 'bg-primary h-4.5 w-5 shrink-0 rounded-[3px]';
  return (
    <div className="mt-4 flex flex-wrap items-center gap-5">
      {/* Available */}
      <div className="flex items-center gap-1.5">
        <span className="h-4.5 w-5 shrink-0 rounded-[3px] bg-[#E0E0E0]" />
        <span className="text-xs text-gray-500">Available</span>
      </div>

      {/* Selected */}
      <div className="flex items-center gap-1.5">
        <span className={newLocal} />
        <span className="text-xs text-gray-500">Selected</span>
      </div>

      {/* Love Nest — dua kotak menyatu (sofa shape) */}
      <div className="flex items-center gap-1.5">
        <span className="flex items-end" style={{ gap: '1px' }}>
          <span
            className="h-4.5 w-3 shrink-0 bg-pink-400"
            style={{ borderRadius: '8px 2px 1px 4px' }}
          />
          <span
            className="h-4.5 w-3 shrink-0 bg-pink-400"
            style={{ borderRadius: '2px 8px 4px 1px' }}
          />
        </span>
        <span className="text-xs text-gray-500">Love nest</span>
      </div>

      {/* Sold */}
      <div className="flex items-center gap-1.5">
        <span className="h-4.5 w-5 shrink-0 rounded-[3px] bg-[#8C8C8C]" />
        <span className="text-xs text-gray-500">Sold</span>
      </div>
    </div>
  );
};

export default SeatingKey;
