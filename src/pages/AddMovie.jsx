import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../components/atoms/Button';
import DateTimePicker from '../components/molecules/DateTimePicker';
import useMovieForm from '../hooks/useMovieForm';

function AddMovie() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const fileInputRef = useRef(null);

  const {
    formData,
    errors,
    genreOptions,
    directorOptions,
    castOptions,
    locationOptions,
    optionsLoaded,
    isDetailLoading,
    handleChange,
    handleCheckboxChange,
    handleFileChange,
    handleAddDate,
    handleRemoveDate,
    handleToggleTime,
    handleRemoveTime,
    handleSubmit,
    isChecked,
    setValue,
  } = useMovieForm(id, isEditMode);

  const handleSelectAllTimes = (presetTimes, isAllSelected) => {
    if (isAllSelected) {
      const filtered = formData.cinemaTimes.filter((time) => !presetTimes.includes(time));
      setValue('cinemaTimes', filtered);
    } else {
      const combined = Array.from(new Set([...formData.cinemaTimes, ...presetTimes]));
      setValue('cinemaTimes', combined);
    }
  };

  if (isDetailLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-blue-600 font-medium">Loading movie data...</p>
      </div>
    );
  }

  // Checkbox group TANPA select all (untuk Genres, Director, Cast)
  const renderCheckboxGroup = ({ label, fieldKey, options, optionLabel, hasError }) => {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-500 block">{label}</label>
        <div className={`w-full rounded-sm bg-[#FCFDFE] border transition-all overflow-hidden ${
          hasError ? 'border-red-500' : 'border-[#DEDEDE] focus-within:border-purple-400'
        }`}>
          {!optionsLoaded ? (
            <p className="text-xs text-gray-400 p-3">Loading...</p>
          ) : options.length > 0 ? (
            <div className="max-h-26 overflow-y-auto p-1">
              {options.map((opt) => (
                <label
                  key={opt.id}
                  className="flex items-center gap-2.5 px-2 py-1.5 rounded cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    value={opt.id}
                    checked={isChecked(fieldKey, opt.id)}
                    onChange={(e) => handleCheckboxChange(e, fieldKey)}
                    className="w-4 h-4 accent-purple-600 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700">{optionLabel(opt)}</span>
                </label>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 p-3">No options available.</p>
          )}
        </div>
        {hasError && <p className="text-xs text-red-500 font-medium">{hasError}</p>}
      </div>
    );
  };

  // Checkbox group DENGAN select all (khusus Location)
  const renderCheckboxGroupWithSelectAll = ({ label, fieldKey, options, optionLabel, hasError }) => {
    const allChecked = options.length > 0 && options.every((o) => isChecked(fieldKey, o.id));
    const someChecked = options.some((o) => isChecked(fieldKey, o.id));
    const checkedCount = options.filter((o) => isChecked(fieldKey, o.id)).length;

    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-500 block">{label}</label>
        <div className={`w-full rounded-sm bg-[#FCFDFE] border transition-all overflow-hidden ${
          hasError ? 'border-red-500' : 'border-[#DEDEDE] focus-within:border-purple-400'
        }`}>
          {!optionsLoaded ? (
            <p className="text-xs text-gray-400 p-3">Loading...</p>
          ) : options.length > 0 ? (
            <>
              {/* Select All Bar */}
              <div className="flex items-center justify-between px-3 py-2.5 bg-gray-50 border-b border-[#DEDEDE]">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    ref={(el) => {
                      if (el) el.indeterminate = someChecked && !allChecked;
                    }}
                    onChange={(e) => {
                      const allIds = options.map((o) => o.id);
                      setValue(fieldKey, e.target.checked ? allIds : []);
                    }}
                    className="w-4 h-4 accent-purple-600 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-gray-600">Select all</span>
                </label>
                {someChecked && (
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                    {checkedCount} / {options.length} selected
                  </span>
                )}
              </div>

              {/* Item List */}
              <div className="max-h-26 overflow-y-auto p-1">
                {options.map((opt) => (
                  <label
                    key={opt.id}
                    className="flex items-center gap-2.5 px-2 py-1.5 rounded cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      value={opt.id}
                      checked={isChecked(fieldKey, opt.id)}
                      onChange={(e) => handleCheckboxChange(e, fieldKey)}
                      className="w-4 h-4 accent-purple-600 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700">{optionLabel(opt)}</span>
                  </label>
                ))}
              </div>
            </>
          ) : (
            <p className="text-xs text-gray-400 p-3">No options available.</p>
          )}
        </div>
        {hasError && <p className="text-xs text-red-500 font-medium">{hasError}</p>}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-700">
      <main className="mx-auto max-w-212.5 px-4 py-8 md:py-12">
        <div className="rounded-2xl bg-white p-6 md:p-12 shadow-sm border border-gray-100">
          <h2 className="text-xl md:text-2xl font-bold text-[#14142B] mb-8">
            {isEditMode ? 'Edit Movie' : 'Add New Movie'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* UPLOAD IMAGE */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500 block">Upload Image</label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />

                {/* Button di kiri */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className={`rounded-lg px-6 py-2.5 text-xs font-semibold text-white transition-colors shadow-sm ${
                    errors.movieImage ? 'bg-red-500 hover:bg-red-600' : 'bg-[#1D4ED8] hover:bg-blue-700'
                  }`}
                >
                  {formData.movieImage instanceof File ? 'Change Image' : isEditMode ? 'Change Poster' : 'Upload'}
                </button>

                {/* Preview gambar di kanan */}
                {(formData.movieImage instanceof File || (isEditMode && formData.movieImage)) && (
                  <div className="w-16 h-20 rounded-lg overflow-hidden border border-gray-200 shadow-sm shrink-0">
                    <img
                      src={
                        formData.movieImage instanceof File
                          ? URL.createObjectURL(formData.movieImage)
                          : formData.movieImage
                      }
                      alt="Movie poster preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              {errors.movieImage && <p className="text-xs text-red-500 font-medium">{errors.movieImage}</p>}
            </div>

            {/* MOVIE NAME */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500 block">Movie Name</label>
              <input
                type="text" name="movieName" value={formData.movieName} onChange={handleChange}
                className={`w-full h-12.5 md:h-16 px-4 rounded-sm bg-[#FCFDFE] text-sm text-gray-700 outline-none border transition-all ${
                  errors.movieName ? 'border-red-500' : 'border-[#DEDEDE] focus:border-purple-400'
                }`}
              />
              {errors.movieName && <p className="text-xs text-red-500 font-medium">{errors.movieName}</p>}
            </div>

            {/* CATEGORY / GENRES */}
            {renderCheckboxGroup({
              label: 'Category (Genres)',
              fieldKey: 'genreIds',
              options: genreOptions,
              optionLabel: (o) => o.name || o.genre_name,
              hasError: errors.genreIds,
            })}

            {/* RELEASE DATE & DURATION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500 block">Release date</label>
                <input
                  type="date" max="2030-12-31" name="releaseDate" value={formData.releaseDate} onChange={handleChange}
                  className={`w-full h-12.5 md:h-16 px-4 rounded-sm bg-[#FCFDFE] text-sm text-gray-600 outline-none border transition-all ${
                    errors.releaseDate ? 'border-red-500' : 'border-[#DEDEDE] focus:border-purple-400'
                  }`}
                />
                {errors.releaseDate && <p className="text-xs text-red-500 font-medium">{errors.releaseDate}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500 block">Duration (hour / minute)</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="number"
                      name="durationHour"
                      placeholder="Hour"
                      min="0"
                      max="99"
                      value={formData.durationHour}
                      onChange={handleChange}
                      onKeyDown={(e) => {
                        if (['-', '+', 'e', 'E', '.'].includes(e.key)) {
                          e.preventDefault();
                        }
                        const controlKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
                        if (!controlKeys.includes(e.key) && String(formData.durationHour).length >= 2) {
                          e.preventDefault();
                        }
                      }}
                      className={`w-full h-12.5 md:h-16 px-4 rounded-sm bg-[#FCFDFE] text-sm text-center text-gray-700 outline-none border transition-all ${
                        errors.durationHour ? 'border-red-500' : 'border-[#DEDEDE] focus:border-purple-400'
                      }`}
                    />
                    {errors.durationHour && <p className="text-[11px] text-red-500 mt-1">{errors.durationHour}</p>}
                  </div>
                  <div>
                    <input
                      type="number"
                      name="durationMinute"
                      placeholder="Minute"
                      min="0"
                      max="59"
                      value={formData.durationMinute}
                      onChange={handleChange}
                      onKeyDown={(e) => {
                        if (['-', '+', 'e', 'E', '.'].includes(e.key)) {
                          e.preventDefault();
                        }
                        const controlKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
                        if (!controlKeys.includes(e.key) && String(formData.durationMinute).length >= 2) {
                          e.preventDefault();
                        }
                      }}
                      className={`w-full h-12.5 md:h-16 px-4 rounded-sm bg-[#FCFDFE] text-sm text-center text-gray-700 outline-none border transition-all ${
                        errors.durationMinute ? 'border-red-500' : 'border-[#DEDEDE] focus:border-purple-400'
                      }`}
                    />
                    {errors.durationMinute && <p className="text-[11px] text-red-500 mt-1">{errors.durationMinute}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* DIRECTOR */}
            {renderCheckboxGroup({
              label: 'Director Name',
              fieldKey: 'directorIds',
              options: directorOptions,
              optionLabel: (o) => o.name || o.director_name,
              hasError: errors.directorIds,
            })}

            {/* CAST */}
            {renderCheckboxGroup({
              label: 'Cast',
              fieldKey: 'castIds',
              options: castOptions,
              optionLabel: (o) => o.name || o.cast_name,
              hasError: errors.castIds,
            })}

            {/* SYNOPSIS */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500 block">Synopsis</label>
              <textarea
                name="synopsis" rows="4" value={formData.synopsis} onChange={handleChange}
                className={`w-full h-63 md:h-51.75 p-4 rounded-sm bg-[#FCFDFE] text-sm text-gray-700 outline-none border transition-all resize-none leading-relaxed ${
                  errors.synopsis ? 'border-red-500' : 'border-[#DEDEDE] focus:border-purple-400'
                }`}
              />
              {errors.synopsis && <p className="text-xs text-red-500 font-medium">{errors.synopsis}</p>}
            </div>

            {/* LOCATION - dengan Select All */}
            {renderCheckboxGroupWithSelectAll({
              label: 'Available Locations',
              fieldKey: 'locationIds',
              options: locationOptions,
              optionLabel: (o) => o.city_name || o.name,
              hasError: errors.locationIds,
            })}

            {/* DATE & TIME */}
            <DateTimePicker
              cinemaDates={formData.cinemaDates}
              cinemaTimes={formData.cinemaTimes}
              onAddDate={handleAddDate}
              onRemoveDate={handleRemoveDate}
              onToggleTime={handleToggleTime}
              onRemoveTime={handleRemoveTime}
              onSelectAllTimes={handleSelectAllTimes}
              errors={errors}
            />

            {/* SUBMIT */}
            <div className="pt-6">
              <Button
                type="submit" color="blue"
                className="w-full h-14 rounded-xl bg-[#1D4ED8] text-sm font-semibold text-white shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.99]"
              >
                {isEditMode ? 'Update Movie' : 'Save Movie'}
              </Button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}

export default AddMovie;