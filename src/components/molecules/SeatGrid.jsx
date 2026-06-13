/**
 * SeatGrid
 *
 * LoveNest seats:
 *   - Selalu datang berpasangan (seat_number ganjil + genap berikutnya).
 *     Contoh: G8 & G9 → dirender menyatu jadi satu "sofa".
 *   - Klik salah satu → pilih keduanya sekaligus (pair selection).
 *   - Visual: dua kotak tanpa gap, sudut luar melengkung, sudut dalam
 *     rata — mirip kursi bioskop couple di gambar referensi.
 *
 * @typedef {'available'|'selected'|'sold'|'lovenest'|'lovenest-sold'} SeatStatus
 *
 * @typedef {Object} Seat
 * @property {string}  id         - e.g. "G8"
 * @property {string}  row        - e.g. "G"
 * @property {number}  seatNumber - e.g. 8
 * @property {string}  seatType   - "Regular" | "LoveNest"
 * @property {string}  status     - "Available" | "Sold"
 *
 * @param {Object}   props
 * @param {Seat[]}   props.seats        - flat list of all seats
 * @param {string[]} props.selectedIds  - currently selected seat IDs
 * @param {Function} props.onToggle     - (ids: string[]) => void
 *                                        untuk LN dikirim array 2 id,
 *                                        untuk Regular array 1 id
 */
const SeatGrid = ({ seats = [], selectedIds = [], onToggle }) => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L'];
  const leftCols = [1, 2, 3, 4, 5, 6, 7];
  const rightCols = [8, 9, 10, 11, 12, 13, 14];

  const seatMap = {};
  seats.forEach((s) => {
    seatMap[`${s.row}${s.seatNumber}`] = s;
  });

  const getStatus = (id) => {
    const s = seatMap[id];
    if (!s) return 'empty';
    if (selectedIds.includes(id)) return 'selected';
    if (s.status === 'Sold') return 'sold';
    if (s.seatType === 'LoveNest') return 'lovenest';
    return 'available';
  };

  const isLN = (id) => seatMap[id]?.seatType === 'LoveNest';

  const getLNPair = (row, col) => {
    const isOdd = col % 2 === 1;
    const partnerCol = isOdd ? col + 1 : col - 1;
    const leftCol = isOdd ? col : partnerCol;
    const rightCol = isOdd ? partnerCol : col;
    return {
      leftId: `${row}${leftCol}`,
      rightId: `${row}${rightCol}`,
      leftCol,
      rightCol,
    };
  };

  const handleClick = (row, col) => {
    const id = `${row}${col}`;
    const s = seatMap[id];
    if (!s || s.status === 'Sold') return;

    if (s.seatType === 'LoveNest') {
      const { leftId, rightId } = getLNPair(row, col);
      const bothSelected =
        selectedIds.includes(leftId) && selectedIds.includes(rightId);
      if (bothSelected) {
        onToggle([leftId, rightId], 'deselect');
      } else {
        onToggle([leftId, rightId], 'select');
      }
    } else {
      onToggle([id]);
    }
  };

  const regularClass = (status) => {
    const base =
      'w-6 h-5 flex-shrink-0 transition-colors duration-150 rounded-t-sm rounded-b-[2px]';
    switch (status) {
      case 'selected':
        return `${base} bg-primary cursor-pointer`;
      case 'sold':
        return `${base} bg-[#8C8C8C] cursor-not-allowed`;
      default:
        return `${base} bg-[#E0E0E0] cursor-pointer hover:bg-primary/30`;
    }
  };

  const lnLeftClass = (leftStatus) => {
    const base = 'flex-shrink-0 transition-colors duration-150 cursor-pointer';
    const color = lnColor(leftStatus);
    return `${base} ${color} h-5 w-[26px] rounded-tl-[10px] rounded-bl-[4px] rounded-tr-[2px] rounded-br-[0px]`;
  };

  const lnRightClass = (rightStatus) => {
    const base = 'flex-shrink-0 transition-colors duration-150 cursor-pointer';
    const color = lnColor(rightStatus);
    return `${base} ${color} h-5 w-[26px] rounded-tr-[10px] rounded-br-[4px] rounded-tl-[2px] rounded-bl-[0px]`;
  };

  const lnColor = (status) => {
    switch (status) {
      case 'selected':
        return 'bg-primary';
      case 'sold':
        return 'bg-[#8C8C8C]';
      default:
        return 'bg-pink-400 hover:bg-pink-500';
    }
  };

  const renderSection = (cols) => {
    return (
      <div className="flex flex-col gap-1.5">
        {/* Nomor kolom */}
        <div className="flex items-center gap-1.25 pl-4.75">
          {cols.map((c) => (
            <span
              key={c}
              className="w-6 shrink-0 text-center text-[10px] text-gray-400"
            >
              {c}
            </span>
          ))}
        </div>

        {/* Baris */}
        {rows.map((row) => {
          const rendered = new Set();

          return (
            <div key={row} className="flex items-center gap-1.25">
              {/* Label baris */}
              <span className="w-3.5 shrink-0 text-center text-[11px] text-gray-400">
                {row}
              </span>

              {cols.map((col) => {
                if (rendered.has(col)) return null;

                const id = `${row}${col}`;
                const status = getStatus(id);

                // LoveNest pair rendering
                if (isLN(id)) {
                  const { leftCol, rightCol, leftId, rightId } = getLNPair(
                    row,
                    col
                  );
                  if (col !== leftCol) {
                    rendered.add(col);
                    return null;
                  }

                  rendered.add(leftCol);
                  rendered.add(rightCol);

                  const leftStatus = getStatus(leftId);
                  const rightStatus = getStatus(rightId);
                  const isSoldPair = seatMap[leftId]?.status === 'Sold';

                  return (
                    <button
                      key={id}
                      aria-label={`Love Nest ${leftId}-${rightId}`}
                      disabled={isSoldPair}
                      onClick={() => !isSoldPair && handleClick(row, col)}
                      className="flex shrink-0 items-end gap-0 focus:outline-none"
                      style={{ gap: '1px' }}
                    >
                      <span
                        className={lnLeftClass(leftStatus)}
                        aria-hidden="true"
                      />
                      <span
                        className={lnRightClass(rightStatus)}
                        aria-hidden="true"
                      />
                    </button>
                  );
                }

                //Regular / empty seat
                if (status === 'empty') {
                  return (
                    <span
                      key={id}
                      className="h-5 w-6 shrink-0"
                      aria-hidden="true"
                    />
                  );
                }

                return (
                  <button
                    key={id}
                    aria-label={`Seat ${id}`}
                    disabled={status === 'sold'}
                    onClick={() => status !== 'sold' && handleClick(row, col)}
                    className={regularClass(status)}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex justify-center gap-6">
      {renderSection(leftCols)}
      {renderSection(rightCols)}
    </div>
  );
};

export default SeatGrid;
