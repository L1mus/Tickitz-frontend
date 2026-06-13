import { useState } from 'react';

const PRESET_TIMES = ['10:00', '12:30', '15:15', '17:30', '20:00'];

const DateTimePicker = ({
  cinemaDates,
  cinemaTimes,
  onAddDate,
  onRemoveDate,
  onToggleTime,
  onRemoveTime,
  errors,
}) => {
  const [tempDate, setTempDate] = useState('');

  const handleAddDate = () => {
    if (tempDate && !cinemaDates.includes(tempDate)) {
      onAddDate(tempDate, setTempDate);
    }
  };

  return (
    <div className="space-y-4 pt-2">
      <label className="block text-sm font-medium text-gray-500">
        Set Date &amp; Time
      </label>

      {/* DATE */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="date"
            value={tempDate}
            max="2030-12-31"
            onChange={(e) => setTempDate(e.target.value)}
            className={`w-full cursor-pointer rounded-lg border-2 bg-white p-3 outline-none md:w-56 ${
              errors?.cinemaDates ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <button
            type="button"
            onClick={handleAddDate}
            className="h-12 rounded-lg bg-[#5F2EEA] px-5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-purple-700 active:scale-95"
          >
            Add Date
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-1 text-xs font-semibold text-gray-500">
          {cinemaDates.map((date, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-semibold text-[#5F2EEA]"
            >
              {date}
              <button
                type="button"
                onClick={() => onRemoveDate(idx)}
                className="ml-1 font-bold text-red-400 hover:text-red-600"
              >
                ×
              </button>
            </span>
          ))}
          {cinemaDates.length === 0 && (
            <p
              className={`text-xs italic ${errors?.cinemaDates ? 'font-medium text-red-500' : 'text-gray-400'}`}
            >
              {errors?.cinemaDates ?? 'No release date selected yet'}
            </p>
          )}
        </div>
      </div>

      {/* TIME */}
      <div className="space-y-2 pt-2">
        <div className="flex flex-wrap gap-2.5">
          {PRESET_TIMES.map((time) => {
            const isActive = cinemaTimes.includes(time);
            return (
              <button
                key={time}
                type="button"
                onClick={() => onToggleTime(time)}
                className={`rounded-lg border px-4 py-2 text-xs font-semibold transition-all duration-200 active:scale-95 ${
                  isActive
                    ? 'border-transparent bg-[#5F2EEA] text-white shadow-md shadow-purple-200'
                    : `bg-white text-gray-600 hover:bg-purple-50 ${
                        errors?.cinemaTimes
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`
                }`}
              >
                {time}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-semibold text-gray-500">
          {cinemaTimes.map((time, idx) => (
            <span
              key={idx}
              className="inline-flex items-center rounded-md border border-gray-200 bg-gray-100 px-3 py-1 tracking-wide"
            >
              {time}
              <button
                type="button"
                onClick={() => onRemoveTime(idx)}
                className="ml-2 font-bold text-gray-400 hover:text-red-500"
              >
                ×
              </button>
            </span>
          ))}
          {cinemaTimes.length === 0 && (
            <p
              className={`text-xs italic ${errors?.cinemaTimes ? 'font-medium text-red-500' : 'text-gray-400'}`}
            >
              {errors?.cinemaTimes ?? 'No broadcast hours have been added yet'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DateTimePicker;
