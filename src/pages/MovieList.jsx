import { useState, useEffect } from 'react';
import MovieCard from '../components/organism/MovieCard';
import Footer from '../components/organism/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { getMovie } from '../redux/slices/movieSlice';
import { Button } from '../components/atoms/Button';

function MovieList() {
  const { movieList, pagination, loading, error, activeLocation } = useSelector(
    (state) => state.movies
  );
  const dispatch = useDispatch();

  const [search, setSearch] = useState('');
  const [activeGenre, setActiveGenre] = useState('');
  const [page, setPage] = useState(1);

  const genresList = ['Thriller', 'Horror', 'Music', 'War', 'TV Movie', 'Family', 'Mystery', 'Western', 'History', 'Documentary', 'Crime', 'Fantasy', 'Romance', 'Animation', 'Adventure', 'Science Fiction', 'Comedy', 'Drama'];

  useEffect(() => {
    setPage(1);
  }, [activeLocation?.id]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(
        getMovie({
          search,
          genre: activeGenre,
          page,
          location_id: activeLocation?.id || '',
        })
      );
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [dispatch, search, activeGenre, page, activeLocation?.id]);

  const handlePageChange = (targetUrl) => {
    if (!targetUrl) return;

    const queryString = targetUrl.split('?')[1];
    if (queryString) {
      const urlParams = new URLSearchParams(queryString);
      const pageNumber = urlParams.get('page') || '1';

      setPage(parseInt(pageNumber, 10));
    }
  };

  const handleGenreClick = (genreName) => {
    if (activeGenre === genreName) {
      setActiveGenre('');
    } else {
      setActiveGenre(genreName);
    }
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
    setPage(1);
  };

  function HeroBanner() {
    const heroBanners = [
      {
        id: 1,
        backdrop: '/src/assets/images/supergirl.webp',
        tagline: 'LIST MOVIE OF THE WEEK',
        title: 'Experience the Magic of Cinema: Book Your Tickets Today',
      },
      {
        id: 2,
        backdrop: '/src/assets/images/minions-monster.webp',
        tagline: 'NEW RELEASE THIS WEEK',
        title: 'Discover the Most Anticipated Action Blockbusters',
      },
      {
        id: 3,
        backdrop: '/src/assets/images/garuda-di-dadaku.webp',
        tagline: 'EXCLUSIVE IN TICKITZ',
        title: 'Watch Premium Cinematic Masterpieces from Your Best Seats',
      },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === heroBanners.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000);

      return () => clearInterval(interval);
    }, [heroBanners.length]);

    const nextSlide = () => {
      setCurrentIndex((prev) =>
        prev === heroBanners.length - 1 ? 0 : prev + 1
      );
    };

    const prevSlide = () => {
      setCurrentIndex((prev) =>
        prev === 0 ? heroBanners.length - 1 : prev - 1
      );
    };

    return (
      <section className="w-full">
        <div className="relative h-100 w-full overflow-hidden bg-gray-900 shadow-xl md:h-120">
          <div
            className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {heroBanners.map((banner) => (
              <div key={banner.id} className="relative h-full w-full shrink-0">
                <img
                  src={banner.backdrop}
                  alt={banner.title}
                  className="h-full w-full object-cover object-center"
                />

                <div className="absolute inset-0 flex flex-col justify-center bg-linear-to-r from-black/80 via-black/50 to-transparent px-8 md:px-16">
                  <p className="mb-3 text-xs font-semibold tracking-widest text-gray-300 uppercase md:text-sm">
                    {banner.tagline}
                  </p>
                  <h1 className="max-w-2xl text-2xl leading-tight font-bold text-white md:text-4xl lg:text-5xl">
                    {banner.title}
                  </h1>
                </div>
              </div>
            ))}
          </div>

          <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
            {heroBanners.map((_, index) => (
              <Button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`rounded-full transition-all duration-300 ${currentIndex === index
                    ? 'h-1.5 w-6 bg-blue-600'
                    : 'h-1.5 w-1.5 bg-white/50 hover:bg-white'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <HeroBanner></HeroBanner>
      <section className="px-5 py-5 md:px-20 lg:px-24">
        {/* content */}

        <section className="flex flex-col gap-5 md:flex-row">
          <div>
            <label
              className="font-semibold text-gray-700"
              htmlFor="search-input"
            >
              Search Movie
            </label>
            <div className="mt-2 flex h-12 w-63 items-center rounded-md border border-gray-300 bg-white p-2 px-4">
              <input
                id="search-input"
                value={search}
                onChange={handleSearchChange}
                placeholder="Spiderman..."
                className="w-full pl-2 text-gray-800 outline-none focus:outline-0"
                type="text"
              />
            </div>
          </div>

          <div>
            <p className="mb-2 font-semibold text-gray-700">Filter Genre</p>
            <div className={`relative flex h-12 w-48 items-center rounded-sm bg-gray-200 p-3`}>
              <svg className="z-10 h-5 w-5 shrink-0 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M10 18h4" />
              </svg>
              <select
                value={activeGenre}
                onChange={(e) => handleGenreClick(e.target.value)}
                className="absolute inset-0 z-0 w-full cursor-pointer appearance-none bg-transparent p-3 pl-10 pr-8 font-bold text-gray-500 outline-none text-sm"
              >
                <option value="">All Genres</option>
                {genresList.map((g) => (
                  <option key={g} value={g} className="font-normal text-black">
                    {g}
                  </option>
                ))}
              </select>
              <svg className="pointer-events-none z-10 ml-auto h-4 w-4 shrink-0 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

        </section>

        {loading ? (
          <div className="py-10 text-center font-medium text-gray-500">
            Loading movies...
          </div>
        ) : error ? (
          <div className="py-10 text-center font-medium text-red-500">
            Error: {error}
          </div>
        ) : movieList.length === 0 ? (
          <div className="py-10 text-center font-medium text-gray-500">
            No movies found.
          </div>
        ) : (
          <>
            <section className="mx-auto my-5 grid w-full max-w-6xl grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {movieList?.map((m) => (
                <div key={m.id} className="w-full">
                  <MovieCard
                    id={m.id}
                    poster={`${m.poster}`}
                    title={m.title}
                    genres={m.genres}
                  />
                </div>
              ))}
            </section>

            <section className="my-8 flex flex-wrap items-center justify-center gap-2">
              <Button
                disabled={!pagination?.has_prev}
                onClick={() => handlePageChange(pagination.prev)}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </Button>

              {getPageNumbers(pagination?.current_page, pagination?.total_page || 1).map((page, idx) =>
                page === '...' ? (
                  <span key={`ellipsis-${idx}`} className="px-1 text-gray-400 select-none">
                    ...
                  </span>
                ) : (
                  <Button
                    key={page}
                    onClick={() => handlePageChange(`/api/movies?page=${page}`)}
                    className={`h-10 w-10 rounded-md border text-sm font-semibold transition-all ${pagination?.current_page === page
                        ? 'scale-105 border-blue-600 bg-blue-600 text-white shadow-md'
                        : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                      }`}
                  >
                    {page}
                  </Button>
                )
              )}

              <Button
                disabled={!pagination?.has_next}
                onClick={() => handlePageChange(pagination.next)}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </Button>
            </section>
          </>
        )}
      </section>
      <Footer></Footer>
    </section>
  );
}

const getPageNumbers = (currentPage, totalPage) => {
  if (totalPage <= 5) return Array.from({ length: totalPage }, (_, i) => i + 1);

  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPage];
  } else if (currentPage >= totalPage - 2) {
    return [1, '...', totalPage - 2, totalPage - 1, totalPage];
  } else {
    return [1, '...', currentPage, '...', totalPage];
  }
};

export default MovieList;