import { useState, useRef, useEffect } from 'react';

const ITEM_HEIGHT = 44;
const VISIBLE_COUNT = 3; 

function FilterDropdown({ value, onChange, options, className = 'w-full' }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const selected = options.find((o) => String(o.value) === String(value)) ?? options[0];

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange({ target: { value: option.value } });
    setOpen(false);
  };

  const listHeight = Math.min(options.length, VISIBLE_COUNT) * ITEM_HEIGHT;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full appearance-none rounded-xl bg-[#F0F1F9] px-4 py-3.5 pr-10 text-sm font-medium text-gray-500 outline-none border border-transparent focus:border-purple-400 transition-all text-left"
      >
        {selected?.label ?? 'Pilih...'}
      </button>

      {/* Arrow icon */}
      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
        <svg
          className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {open && (
        <ul
          style={{ height: listHeight }}
          className="absolute z-50 mt-2 w-full overflow-y-auto rounded-xl bg-white shadow-lg border border-gray-100 scroll-smooth"
        >
          {options.map((option, index) => {
            const isActive = String(option.value) === String(value);
            return (
              <li
                key={index}
                onClick={() => handleSelect(option)}
                style={{ height: ITEM_HEIGHT }}
                className={`flex items-center px-4 text-sm font-medium cursor-pointer transition-colors
                  ${isActive
                    ? 'bg-[#F0F1F9] text-purple-600'
                    : 'text-gray-500 hover:bg-[#F0F1F9] hover:text-gray-700'
                  }`}
              >
                {option.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default FilterDropdown;