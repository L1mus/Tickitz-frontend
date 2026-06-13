import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../components/atoms/Button';
import { fetchMoviesThunk } from '../redux/slices/adminMoviesSlice';
import toast from 'react-hot-toast';

// const BACKEND_URL = "http://localhost:8080/img/" ;

function ListMovie() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    moviesList,
    isLoading,
    error,
    totalPages = 1,
  } = useSelector((state) => state.adminMovies);

  const [currentPage, setCurrentPage] = useState(1);
  const [combinedFilter, setCombinedFilter] = useState('');
  const limit = 10;

  useEffect(() => {
    let month = '';
    let year = '';

    if (combinedFilter) {
      const [m, y] = combinedFilter.split('-');
      month = m;
      year = y;
    }

    dispatch(
      fetchMoviesThunk({
        page: currentPage,
        limit: limit,
        month: month,
        year: year,
      })
    );
  }, [dispatch, currentPage, combinedFilter]);

  const handleFilterChange = (e) => {
    setCombinedFilter(e.target.value);
    setCurrentPage(1);
  };

  // --- HELPER FORMAT DATA ---
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${day}/${month}/${year}`;
    }
    return dateString;
  };

  const formatDuration = (movie) => {
    const rawDuration = movie.duration || movie.duration_minute;
    if (!rawDuration) return '-';
    if (typeof rawDuration === 'string' && rawDuration.includes(':')) {
      const parts = rawDuration.split(':');
      return `${parseInt(parts[0], 10) || 0} hours ${parseInt(parts[1], 10) || 0} minute`;
    }
    if (typeof rawDuration === 'number') {
      return `${Math.floor(rawDuration / 60)} hours ${rawDuration % 60} minute`;
    }
    return '-';
  };

  const handleView = (id) => toast(`Melihat detail film ID: ${id}`);
  const handleEdit = (movie) =>
    navigate(`/admin/movies/add-movie/${movie.id}`, { state: { movieData: movie } });
  const handleDelete = () =>
    confirm('Apakah Anda yakin?') &&
    toast('Fitur hapus segera diimplementasikan.');

  const filterOptions = [
    { value: '8-2026', label: 'August 2026' },
    { value: '7-2026', label: 'July 2026' },
    { value: '6-2026', label: 'June 2026' },
    { value: '5-2026', label: 'Mei 2026' },
    { value: '4-2026', label: 'April 2026' },
    { value: '3-2026', label: 'March 2026' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-700">

      <main className="px-4 py-8 md:px-20 md:py-12">
        <div className="rounded-2xl bg-white p-6 md:p-10">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full items-center justify-between md:w-auto">
              <h2 className="text-xl font-bold text-[#14142B] md:text-2xl">
                List Movie
              </h2>
              <div className="block md:hidden">
                <Button
                  onClick={() => navigate('/admin/movies/add-movie')}
                  color="blue"
                  className="flex h-11 w-22.75 items-center justify-center gap-1 rounded-xl text-sm font-semibold text-white"
                >
                  <span className="text-lg leading-none font-light">+</span> Add
                </Button>
              </div>
            </div>

            {/* Dropdown Filter Menyatu */}
            <div className="flex w-full flex-col items-center gap-3 md:w-auto md:flex-row">
              <div className="relative w-full md:w-71">
                <span className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </span>
                <select
                  value={combinedFilter}
                  onChange={handleFilterChange}
                  className="h-14 w-full appearance-none rounded-xl border border-transparent bg-[#F0F1F9] py-3 pr-10 pl-11 text-sm font-medium text-gray-600 transition-colors outline-none focus:border-blue-400"
                >
                  <option value="">All Months & Years</option>
                  {filterOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-gray-400">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              <div className="hidden md:block">
                <Button
                  onClick={() => navigate('/admin/movies/add-movie')}
                  color="blue"
                  className="h-14 w-35 rounded-xl bg-[#1D4ED8] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-blue-100 transition-all hover:bg-blue-700 active:scale-98"
                >
                  Add Movies
                </Button>
              </div>
            </div>
          </div>

          {/* Table Area */}
          {isLoading && (
            <div className="py-10 text-center font-medium text-blue-600">
              Loading movies data...
            </div>
          )}
          {error && (
            <div className="py-10 text-center font-medium text-red-500">
              Failed to load movies: {error}
            </div>
          )}

          {!isLoading && !error && moviesList && (
            <div className="custom-scrollbar w-full overflow-x-auto pb-4">
              <table className="w-full min-w-200 border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                    <th className="w-12 py-4 pl-4 text-center">No</th>
                    <th className="px-4 py-4">Thumbnail</th>
                    <th className="px-4 py-4">Movie Name</th>
                    <th className="px-4 py-4">Category</th>
                    <th className="px-4 py-4">Released Date</th>
                    <th className="px-4 py-4">Duration</th>
                    <th className="w-36 py-4 pr-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 font-medium text-gray-600">
                  {Array.isArray(moviesList) && moviesList.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="py-6 text-center text-gray-400"
                      >
                        Tidak ada film yang cocok dengan filter.
                      </td>
                    </tr>
                  ) : (
                    moviesList?.map((movie, index) => {
                      const imagePath = movie.poster_url || movie.poster;
                      const finalImageUrl = imagePath?.startsWith('http')
                        ? imagePath
                        : `${imagePath}`;
                      return (
                        <tr
                          key={movie.id}
                          className="transition-colors hover:bg-gray-50/50"
                        >
                          <td className="py-4 pl-4 text-center text-gray-400">
                            {(currentPage - 1) * limit + (index + 1)}
                          </td>
                          <td className="px-4 py-3">
                            <img
                              src={finalImageUrl}
                              alt={movie.title}
                              className="h-12 w-12 rounded-lg bg-gray-200 object-cover shadow-sm"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://placehold.co/150';
                              }}
                            />
                          </td>
                          <td className="cursor-pointer px-4 py-4 whitespace-nowrap text-[#1D4ED8] hover:underline">
                            {movie.title}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-gray-500">
                            {movie.category || movie.genres || 'N/A'}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-gray-500">
                            {formatDate(
                              movie.release_date || movie.releasedDate
                            )}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-gray-500">
                            {formatDuration(movie)}
                          </td>
                          <td className="py-4 pr-4">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleView(movie.id)}
                                className="flex h-7.75 w-7.75 justify-center rounded-md bg-[#1D4ED8] p-2 text-white transition-colors hover:bg-blue-700"
                                title="View"
                              >
                                <img
                                  src="/src/assets/icons/eye_movie.svg"
                                  alt="icon eye"
                                />
                              </button>
                              <button
                                onClick={() => handleEdit(movie)}
                                className="flex h-7.75 w-7.75 justify-center rounded-md bg-[#5F63F2] p-2 text-white transition-opacity hover:opacity-90"
                                title="Edit"
                              >
                                <img
                                  src="/src/assets/icons/edit_movie.svg"
                                  alt="icon edit"
                                />
                              </button>
                              <button
                                onClick={() => handleDelete(movie.id)}
                                className="flex h-7.75 w-7.75 justify-center rounded-md bg-[#FF4D4F] p-2 text-white transition-colors hover:bg-red-600"
                                title="Delete"
                              >
                                <img
                                  src="/src/assets/icons/delete_movie.svg"
                                  alt="icon delete"
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* PAGINATION BUTTONS */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-semibold transition-all ${
                      currentPage === page
                        ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white shadow-md shadow-blue-100'
                        : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:text-gray-600'
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </main>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #F3F4F6; border-radius: 999px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 999px; }
      `,
        }}
      />
    </div>
  );
}

export default ListMovie;
