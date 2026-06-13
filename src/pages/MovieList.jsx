import { useState, useEffect } from "react";
import { Button } from "../components/atoms/Button";
import MovieCard from "../components/organism/MovieCard";
import Header from "../components/organism/Header";
import Footer from "../components/organism/Footer";
import { useDispatch, useSelector } from "react-redux";
import { getMovie } from "../redux/slices/movieSlice";

function MovieList() {
    const { movieList, pagination, loading, error } = useSelector((state) => state.movies);
    const dispatch = useDispatch();

    const [search, setSearch] = useState("");
    const [activeGenre, setActiveGenre] = useState("");
    const [page, setPage] = useState(1);
    const API_URL = "http://localhost:8080/img/"

    const genresList = ["Thriller", "Horror", "Romantic", "Adventure", "Sci-Fi"];

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            dispatch(getMovie({
                search,
                genre: activeGenre,
                //     status: "now_showing", opsional jika ingin menampilkan hanya film yang tayang bulan ini
                page
            }));

        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [dispatch, search, activeGenre, page]);

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
            setActiveGenre("");
        } else {
            setActiveGenre(genreName);
        }
        setPage(1);
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    function HeroBanner() {
        const heroBanners = [
            {
                id: 1,
                backdrop: "/src/assets/images/supergirl.webp",
                tagline: "LIST MOVIE OF THE WEEK",
                title: "Experience the Magic of Cinema: Book Your Tickets Today"
            },
            {
                id: 2,
                backdrop: "/src/assets/images/minions-monster.webp",
                tagline: "NEW RELEASE THIS WEEK",
                title: "Discover the Most Anticipated Action Blockbusters"
            },
            {
                id: 3,
                backdrop: "/src/assets/images/garuda-di-dadaku.webp",
                tagline: "EXCLUSIVE IN TICKITZ",
                title: "Watch Premium Cinematic Masterpieces from Your Best Seats"
            }
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
            setCurrentIndex((prev) => (prev === heroBanners.length - 1 ? 0 : prev + 1));
        };

        const prevSlide = () => {
            setCurrentIndex((prev) => (prev === 0 ? heroBanners.length - 1 : prev - 1));
        };

        return (
            <section className="w-full">
                <div className="relative w-full h-100 md:h-120 overflow-hidden shadow-xl bg-gray-900">

                    <div
                        className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                        {heroBanners.map((banner) => (
                            <div key={banner.id} className="relative w-full h-full shrink-0">
                                <img
                                    src={banner.backdrop}
                                    alt={banner.title}
                                    className="w-full h-full object-cover object-center"
                                />

                                <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/50 to-transparent flex flex-col justify-center px-8 md:px-16">
                                    <p className="text-xs md:text-sm font-semibold text-gray-300 tracking-widest uppercase mb-3">
                                        {banner.tagline}
                                    </p>
                                    <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-2xl">
                                        {banner.title}
                                    </h1>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                        {heroBanners.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`transition-all duration-300 rounded-full ${currentIndex === index
                                    ? "w-6 h-1.5 bg-blue-600"
                                    : "w-1.5 h-1.5 bg-white/50 hover:bg-white"
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
            <section className="px-5 md:px-20 lg:px-24 py-5">
                {/* content */}

                <section className="flex flex-col md:flex-row gap-5">
                    <div>
                        <label className="text-gray-700 font-semibold" htmlFor="search-input">Search Movie</label>
                        <div className="border border-gray-300 rounded-md flex w-70 h-12 p-2 px-4 mt-2 bg-white items-center">
                            <input
                                id="search-input"
                                value={search}
                                onChange={handleSearchChange}
                                placeholder="Spiderman..."
                                className="outline-none pl-2 focus:outline-0 w-full text-gray-800"
                                type="text"
                            />
                        </div>
                    </div>

                    <div>
                        <p className="text-gray-700 font-semibold mb-2">Filter Genre</p>
                        <div className="flex flex-wrap gap-2">
                            {genresList.map((g) => (
                                <button
                                    key={g}
                                    onClick={() => handleGenreClick(g)}
                                    className={`px-4 py-2 rounded-md font-medium border text-sm ${activeGenre === g
                                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                        : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                                        }`}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {loading ? (
                    <div className="text-center py-10 text-gray-500 font-medium">Loading movies...</div>
                ) : error ? (
                    <div className="text-center py-10 text-red-500 font-medium">Error: {error}</div>
                ) : movieList.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 font-medium">No movies found.</div>
                ) : (
                    <>
                        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 my-5 w-full max-w-6xl mx-auto">
                            {movieList?.map((m) => (
                                <div key={m.id} className="w-full">
                                    <MovieCard id={m.id} poster={`${API_URL}${m.poster}`} title={m.title} genres={m.genres} />
                                </div>
                            ))}
                        </section>

                        <section className="flex justify-center items-center gap-2 my-8 flex-wrap">

                            <button
                                disabled={!pagination?.has_prev}
                                onClick={() => handlePageChange(pagination.prev)}
                                className="px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 text-sm font-semibold transition-colors"
                            >
                                Previous
                            </button>

                            {Array.from({ length: pagination?.total_page || 1 }, (_, index) => {
                                const pageNumber = index + 1;

                                const isActive = pagination?.current_page === pageNumber;

                                return (
                                    <button
                                        key={pageNumber}
                                        onClick={() => handlePageChange(`/api/movies?page=${pageNumber}`)}
                                        className={`w-10 h-10 rounded-md text-sm font-semibold border transition-all ${isActive
                                            ? "bg-blue-600 text-white border-blue-600 shadow-md scale-105"
                                            : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-gray-800"
                                            }`}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            })}

                            <button
                                disabled={!pagination?.has_next}
                                onClick={() => handlePageChange(pagination.next)}
                                className="px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 text-sm font-semibold transition-colors"
                            >
                                Next
                            </button>

                        </section>

                    </>
                )}
            </section>
            <Footer></Footer>
        </section>
    )
}

export default MovieList;