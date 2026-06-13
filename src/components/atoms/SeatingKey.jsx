export default function SeatingKey() {
  return (
    <div className="font-main">
      <h4 className="text-sm font-bold text-darkgrey mb-3">Seating key</h4>
      <div className="flex flex-wrap items-center gap-6">
        
        <div className="flex items-center gap-2">
          <span className="h-5 w-5 rounded bg-[#D6D8E7]" />
          <span className="text-xs font-medium text-darkgrey">Available</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-5 w-5 rounded bg-primary" />
          <span className="text-xs font-medium text-darkgrey">Selected</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex">
            <span className="h-5 w-3 bg-pink-400 rounded-l-md" />
            <span className="h-5 w-3 bg-pink-400 rounded-r-md border-l border-white/30" />
          </div>
          <span className="text-xs font-medium text-darkgrey">Love nest</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-5 w-5 rounded bg-darkgrey" />
          <span className="text-xs font-medium text-sebg-darkgrey">Sold</span>
        </div>

      </div>
    </div>
  );
}