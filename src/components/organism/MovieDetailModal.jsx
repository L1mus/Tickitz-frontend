function DetailItem({ label, value }) {
  return (
    <div>
      <p className="mb-0.5 text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-700">{value || '-'}</p>
    </div>
  );
}

function MovieDetailModal({
  isModalOpen,
  closeModal,
  isModalLoading,
  selectedMovie,
  getImageUrl,
  formatDate,
  formatDuration,
  resolveNames,
  genreOptions,
  directorOptions,
  castOptions,
  locationOptions,
}) {
    
  if (!isModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
          <h3 className="text-lg font-bold text-[#14142B]">Movie Detail</h3>
          <button
            onClick={closeModal}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {isModalLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-[#1D4ED8]" />
              <span className="ml-3 text-sm font-medium text-gray-500">Loading detail...</span>
            </div>
          ) : selectedMovie ? (
            <div className="space-y-6">
              <div className="flex gap-5">
                <img
                  src={getImageUrl(selectedMovie)}
                  alt={selectedMovie.title}
                  className="h-44 w-32 shrink-0 rounded-xl object-cover shadow-md"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/128x176?text=No+Image'; }}
                />
                <div className="flex flex-col justify-center gap-2">
                  <h4 className="text-xl font-bold text-[#14142B]">{selectedMovie.title}</h4>
                  <p className="text-sm text-gray-500">
                    {resolveNames(selectedMovie.genre_ids, genreOptions)}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      📅 {formatDate(selectedMovie.release_date || selectedMovie.releasedDate)}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                      ⏱ {formatDuration(selectedMovie)}
                    </span>
                  </div>
                </div>
              </div>

              <hr className="border-gray-100" />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <DetailItem label="Genre" value={resolveNames(selectedMovie.genre_ids, genreOptions)} />
                <DetailItem label="Director" value={resolveNames(selectedMovie.director_ids, directorOptions)} />
                <DetailItem label="Cast" value={resolveNames(selectedMovie.cast_ids, castOptions)} />
                <DetailItem
                  label="Available Locations"
                  value={
                    Array.isArray(selectedMovie.location_ids) && selectedMovie.location_ids.length > 0
                      ? selectedMovie.location_ids
                          .map((id) => locationOptions.find((l) => l.id === id)?.city_name || locationOptions.find((l) => l.id === id)?.name || id)
                          .join(', ')
                      : '-'
                  }
                />
                <DetailItem
                  label="Show Dates"
                  value={
                    Array.isArray(selectedMovie.dates) && selectedMovie.dates.length > 0
                      ? selectedMovie.dates.map(formatDate).join(', ')
                      : '-'
                  }
                />
                <DetailItem
                  label="Show Times"
                  value={
                    Array.isArray(selectedMovie.times) && selectedMovie.times.length > 0
                      ? selectedMovie.times.join(' • ')
                      : '-'
                  }
                />
              </div>

              <hr className="border-gray-100" />

              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400">Synopsis</p>
                <p className="text-sm leading-relaxed text-gray-600">
                  {selectedMovie.synopsis || 'No synopsis available.'}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default MovieDetailModal;