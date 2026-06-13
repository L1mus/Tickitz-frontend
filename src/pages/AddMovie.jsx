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
  } = useMovieForm(id, isEditMode);

  if (isDetailLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-blue-600 font-medium">Loading movie data...</p>
      </div>
    );
  }

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
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className={`rounded-lg px-6 py-2.5 text-xs font-semibold text-white transition-colors shadow-sm ${
                    errors.movieImage ? 'bg-red-500 hover:bg-red-600' : 'bg-[#1D4ED8] hover:bg-blue-700'
                  }`}
                >
                  {formData.movieImage instanceof File ? 'Change Image' : isEditMode ? 'Change Poster' : 'Upload'}
                </button>
                <span className="text-xs text-gray-500 truncate max-w-xs">
                  {formData.movieImage instanceof File
                    ? formData.movieImage.name
                    : isEditMode
                    ? 'Current poster (upload new to replace)'
                    : 'No files selected yet'}
                </span>
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
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500 block">Category (Genres)</label>
              <div className={`w-full max-h-30 overflow-y-auto p-3 rounded-sm bg-[#FCFDFE] border transition-all ${
                errors.genreIds ? 'border-red-500' : 'border-[#DEDEDE] focus-within:border-purple-400'
              }`}>
                {!optionsLoaded ? <p className="text-xs text-gray-400">Loading categories...</p>
                  : genreOptions.length > 0 ? genreOptions.map((genre) => (
                    <label key={genre.id} className="flex items-center gap-3 mb-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input type="checkbox" value={genre.id} checked={isChecked('genreIds', genre.id)}
                        onChange={(e) => handleCheckboxChange(e, 'genreIds')} className="w-4 h-4 accent-purple-600 cursor-pointer" />
                      <span className="text-sm text-gray-700">{genre.name || genre.genre_name}</span>
                    </label>
                  )) : <p className="text-xs text-gray-400">No categories available.</p>}
              </div>
              {errors.genreIds && <p className="text-xs text-red-500 font-medium">{errors.genreIds}</p>}
            </div>

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
                      type="number" name="durationHour" placeholder="Hour" min="0"
                      onKeyDown={(e) => ['-', '+', 'e', 'E'].includes(e.key) && e.preventDefault()}
                      value={formData.durationHour} onChange={handleChange}
                      className={`w-full h-12.5 md:h-16 px-4 rounded-sm bg-[#FCFDFE] text-sm text-center text-gray-700 outline-none border transition-all ${
                        errors.durationHour ? 'border-red-500' : 'border-[#DEDEDE] focus:border-purple-400'
                      }`}
                    />
                    {errors.durationHour && <p className="text-[11px] text-red-500 mt-1">{errors.durationHour}</p>}
                  </div>
                  <div>
                    <input
                      type="number" name="durationMinute" placeholder="Minute" min="0" max="59"
                      onKeyDown={(e) => ['-', '+', 'e', 'E'].includes(e.key) && e.preventDefault()}
                      value={formData.durationMinute} onChange={handleChange}
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
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500 block">Director Name</label>
              <div className={`w-full max-h-30 overflow-y-auto p-3 rounded-sm bg-[#FCFDFE] border transition-all ${
                errors.directorIds ? 'border-red-500' : 'border-[#DEDEDE]'
              }`}>
                {!optionsLoaded ? <p className="text-xs text-gray-400">Loading directors...</p>
                  : directorOptions.length > 0 ? directorOptions.map((director) => (
                    <label key={director.id} className="flex items-center gap-3 mb-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input type="checkbox" value={director.id} checked={isChecked('directorIds', director.id)}
                        onChange={(e) => handleCheckboxChange(e, 'directorIds')} className="w-4 h-4 accent-purple-600" />
                      <span className="text-sm text-gray-700">{director.name || director.director_name}</span>
                    </label>
                  )) : <p className="text-xs text-gray-400">No directors available.</p>}
              </div>
              {errors.directorIds && <p className="text-xs text-red-500 font-medium">{errors.directorIds}</p>}
            </div>

            {/* CAST */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500 block">Cast</label>
              <div className={`w-full max-h-30 overflow-y-auto p-3 rounded-sm bg-[#FCFDFE] border transition-all ${
                errors.castIds ? 'border-red-500' : 'border-[#DEDEDE]'
              }`}>
                {!optionsLoaded ? <p className="text-xs text-gray-400">Loading casts...</p>
                  : castOptions.length > 0 ? castOptions.map((cast) => (
                    <label key={cast.id} className="flex items-center gap-3 mb-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input type="checkbox" value={cast.id} checked={isChecked('castIds', cast.id)}
                        onChange={(e) => handleCheckboxChange(e, 'castIds')} className="w-4 h-4 accent-purple-600" />
                      <span className="text-sm text-gray-700">{cast.name || cast.cast_name}</span>
                    </label>
                  )) : <p className="text-xs text-gray-400">No casts available.</p>}
              </div>
              {errors.castIds && <p className="text-xs text-red-500 font-medium">{errors.castIds}</p>}
            </div>

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

            {/* LOCATION */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500 block">Available Locations</label>
              <div className={`w-full max-h-30 overflow-y-auto p-3 rounded-sm bg-[#FCFDFE] border transition-all ${
                errors.locationIds ? 'border-red-500' : 'border-[#DEDEDE]'
              }`}>
                {!optionsLoaded ? <p className="text-xs text-gray-400">Loading locations...</p>
                  : locationOptions.length > 0 ? locationOptions.map((loc) => (
                    <label key={loc.id} className="flex items-center gap-3 mb-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input type="checkbox" value={loc.id} checked={isChecked('locationIds', loc.id)}
                        onChange={(e) => handleCheckboxChange(e, 'locationIds')} className="w-4 h-4 accent-purple-600" />
                      <span className="text-sm text-gray-700">{loc.city_name || loc.name}</span>
                    </label>
                  )) : <p className="text-xs text-gray-400">No locations available.</p>}
              </div>
              {errors.locationIds && <p className="text-xs text-red-500 font-medium">{errors.locationIds}</p>}
            </div>

            {/* DATE & TIME */}
            <DateTimePicker
              cinemaDates={formData.cinemaDates}
              cinemaTimes={formData.cinemaTimes}
              onAddDate={handleAddDate}
              onRemoveDate={handleRemoveDate}
              onToggleTime={handleToggleTime}
              onRemoveTime={handleRemoveTime}
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