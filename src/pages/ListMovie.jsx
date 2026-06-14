import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../components/atoms/Button';
import { fetchMoviesThunk } from '../redux/slices/adminMoviesSlice';
import toast from 'react-hot-toast';
import FilterDropdown from '../components/molecules/FilterDropdown';
import axios from 'axios';
import MovieDetailModal from '../components/organism/MovieDetailModal';
import DeleteMovieModal from '../components/organism/DeleteMovieModal';


const BACKEND_URL = "http://localhost:8080/img/";
const API_URL = "http://localhost:8080";
const MAX_VISIBLE_PAGES = 5;

function ListMovie() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { moviesList, isLoading, error, totalPages = 1 } = useSelector((state) => state.adminMovies);

  const [currentPage, setCurrentPage] = useState(1);
  const [combinedFilter, setCombinedFilter] = useState('');
  const limit = 10;

  const [genreOptions, setGenreOptions] = useState([]);
  const [directorOptions, setDirectorOptions] = useState([]);
  const [castOptions, setCastOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const getFilterParams = () => {
    let month = '';
    let year = '';
    if (combinedFilter) {
      const [m, y] = combinedFilter.split('-');
      month = m;
      year = y;
    }
    return { month, year };
  };

  useEffect(() => {
    const { month, year } = getFilterParams();
    dispatch(fetchMoviesThunk({ page: currentPage, limit, month, year }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, currentPage, combinedFilter]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/admin/movie-options`);
        setGenreOptions(res.data.genres || []);
        setDirectorOptions(res.data.directors || []);
        setCastOptions(res.data.casts || []);
        setLocationOptions(res.data.locations || []);
      } catch (err) {
        console.error('Failed to load options:', err);
      }
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        // eslint-disable-next-line react-hooks/immutability
        closeModal();
        // eslint-disable-next-line react-hooks/immutability
        cancelDelete();
      }
    };
    if (isModalOpen || deleteModalOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, deleteModalOpen]);

  const handleFilterChange = (e) => {
    setCombinedFilter(e.target.value);
    setCurrentPage(1);
  };

  // --- PAGINATION HELPER ---
  const getVisiblePages = () => {
    if (totalPages <= MAX_VISIBLE_PAGES) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const half = Math.floor(MAX_VISIBLE_PAGES / 2);
    let start = Math.max(1, currentPage - half);
    let end = start + MAX_VISIBLE_PAGES - 1;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - MAX_VISIBLE_PAGES + 1);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  // --- HELPER FORMAT DATA ---
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
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

  const getImageUrl = (movie) => {
    const imagePath = movie.poster_url || movie.poster;
    if (!imagePath) return 'https://placehold.co/150';
    return imagePath.startsWith('http') ? imagePath : `${BACKEND_URL}${imagePath}`;
  };

  const resolveNames = (ids, options, nameKey = 'name') =>
    Array.isArray(ids) && ids.length > 0
      ? ids.map((id) => options.find((o) => o.id === id)?.[nameKey] || id).join(', ')
      : '-';

  // --- VIEW MODAL HANDLERS ---
  const handleView = async (id) => {
    setIsModalOpen(true);
    setIsModalLoading(true);
    setSelectedMovie(null);
    try {
      const response = await axios.get(`${API_URL}/api/admin/movies/${id}`);
      setSelectedMovie(response.data.data);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      toast.error('Failed to load movie detail.');
      setIsModalOpen(false);
    } finally {
      setIsModalLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  const handleDelete = (movie) => {
    setMovieToDelete(movie);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!movieToDelete) return;
    setIsDeleting(true);
    try {
      await axios.delete(`${API_URL}/api/admin/movies/${movieToDelete.id}`);
      toast.success(`Movie "${movieToDelete.title}" successfully deleted.`);
      setDeleteModalOpen(false);
      setMovieToDelete(null);
      setTimeout(() => {
        const { month, year } = getFilterParams();
        dispatch(fetchMoviesThunk({ page: currentPage, limit, month, year }));
      }, 300);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete movie.');
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setMovieToDelete(null);
  };

  const handleEdit = (movie) =>
    navigate(`/admin/movies/add-movie/${movie.id}`, { state: { movieData: movie } });

  const filterOptions = [
    { value: '', label: 'All Months & Year' },
    { value: '8-2026', label: 'August 2026' },
    { value: '7-2026', label: 'July 2026' },
    { value: '6-2026', label: 'June 2026' },
    { value: '5-2026', label: 'May 2026' },
    { value: '4-2026', label: 'April 2026' },
    { value: '3-2026', label: 'March 2026' },
  ];

  const visiblePages = getVisiblePages();

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-700">
      <main className="px-4 py-8 md:px-20 md:py-12">
        <div className="rounded-2xl bg-white p-6 md:p-10">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full items-center justify-between md:w-auto">
              <h2 className="text-xl font-bold text-[#14142B] md:text-2xl">List Movie</h2>
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

            <div className="flex w-full flex-col items-center gap-3 md:w-auto md:flex-row">
              <div className="relative w-full md:w-71">
                <FilterDropdown
                  value={combinedFilter}
                  onChange={handleFilterChange}
                  options={filterOptions}
                  className="w-full"
                />
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
            <div className="py-10 text-center font-medium text-blue-600">Loading movies data...</div>
          )}
          {error && (
            <div className="py-10 text-center font-medium text-red-500">Failed to load movies: {error}</div>
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
                      <td colSpan="7" className="py-6 text-center text-gray-400">
                        No movies match the selected filter.
                      </td>
                    </tr>
                  ) : (
                    moviesList?.map((movie, index) => (
                      <tr key={movie.id} className="transition-colors hover:bg-gray-50/50">
                        <td className="py-4 pl-4 text-center text-gray-400">
                          {(currentPage - 1) * limit + (index + 1)}
                        </td>
                        <td className="px-4 py-3">
                          <img
                            src={getImageUrl(movie)}
                            alt={movie.title}
                            className="h-12 w-12 rounded-lg bg-gray-200 object-cover shadow-sm"
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/128x176?text=No+Image'; }}
                          />
                        </td>
                        <td className="cursor-pointer px-4 py-4 whitespace-nowrap text-[#1D4ED8] hover:underline">
                          {movie.title}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-gray-500">
                          {movie.category || movie.genres || 'N/A'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-gray-500">
                          {formatDate(movie.release_date || movie.releasedDate)}
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
                              <img src="/src/assets/icons/eye_movie.svg" alt="icon eye" />
                            </button>
                            <button
                              onClick={() => handleEdit(movie)}
                              className="flex h-7.75 w-7.75 justify-center rounded-md bg-[#5F63F2] p-2 text-white transition-opacity hover:opacity-90"
                              title="Edit"
                            >
                              <img src="/src/assets/icons/edit_movie.svg" alt="icon edit" />
                            </button>
                            <button
                              onClick={() => handleDelete(movie)}
                              className="flex h-7.75 w-7.75 justify-center rounded-md bg-[#FF4D4F] p-2 text-white transition-colors hover:bg-red-600"
                              title="Delete"
                            >
                              <img src="/src/assets/icons/delete_movie.svg" alt="icon delete" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">

              {/* Prev Button */}
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex h-10 items-center justify-center gap-1 rounded-lg border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-500 transition-all hover:bg-primary/40 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Prev
              </button>

              {/* First page + ellipsis */}
              {visiblePages[0] > 1 && (
                <>
                  <button
                    onClick={() => setCurrentPage(1)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-400 hover:bg-primary/40 hover:text-gray-600"
                  >
                    1
                  </button>
                  {visiblePages[0] > 2 && (
                    <span className="flex h-10 w-6 items-center justify-center text-sm text-gray-400">...</span>
                  )}
                </>
              )}

              {/* Visible page numbers */}
              {visiblePages.map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-semibold transition-all ${
                    currentPage === page
                      ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white shadow-md shadow-blue-100'
                      : 'border-gray-200 bg-white text-gray-400 hover:bg-primary/40 hover:text-gray-600'
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* Last page + ellipsis */}
              {visiblePages[visiblePages.length - 1] < totalPages && (
                <>
                  {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                    <span className="flex h-10 w-6 items-center justify-center text-sm text-gray-400">...</span>
                  )}
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-400 hover:bg-primary/40 hover:text-gray-600"
                  >
                    {totalPages}
                  </button>
                </>
              )}

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex h-10 items-center justify-center gap-1 rounded-lg border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-500 transition-all hover:bg-primary/40 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>

            </div>
          )}
        </div>
      </main>

      <MovieDetailModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        isModalLoading={isModalLoading}
        selectedMovie={selectedMovie}
        getImageUrl={getImageUrl}
        formatDate={formatDate}
        formatDuration={formatDuration}
        resolveNames={resolveNames}
        genreOptions={genreOptions}
        directorOptions={directorOptions}
        castOptions={castOptions}
        locationOptions={locationOptions}
      />

      <DeleteMovieModal
        deleteModalOpen={deleteModalOpen}
        cancelDelete={cancelDelete}
        movieToDelete={movieToDelete}
        confirmDelete={confirmDelete}
        isDeleting={isDeleting}
      />

      <style dangerouslySetInnerHTML={{
        __html: `
          .custom-scrollbar::-webkit-scrollbar { height: 5px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: #F3F4F6; border-radius: 999px; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 999px; }
        `,
      }} />
    </div>
  );
}

export default ListMovie;