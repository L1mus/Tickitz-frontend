import { Button } from "../components/atoms/Button";
import { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router";
import Footer from "../components/organism/Footer";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { getMovieDetail, getMovieShowtime } from "../redux/slices/movieSlice";

const API_URL = "http://localhost:8080/img/";

const groupShowtimesByCinema = (showtimeList) => {
    if (!showtimeList || showtimeList.length === 0) return [];
    const groups = showtimeList.reduce((acc, curr) => {
        const cinemaId = curr.cinema_id;
        if (!acc[cinemaId]) {
            acc[cinemaId] = {
                id: cinemaId,
                name: curr.cinema_name,
                logo: curr.cinema_logo ? `${API_URL}${curr.cinema_logo}` : "",
                city: curr.city?.toLowerCase(),
                schedules: [],
            };
        }
        acc[cinemaId].schedules.push({
            showtime_id: curr.showtime_id,
            time: curr.time,
            price: curr.price,
            date: curr.date,
        });
        return acc;
    }, {});
    return Object.values(groups);
};

function MovieDetails() {
    const { id } = useParams();
    const { movieDetail, movieShowtime, loading, error } = useSelector((state) => state.movies);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [selectedCinema, setSelectedCinema] = useState("");
    const [formData, setFormData] = useState({ date: "", time: "", location: "" });
    const [filteredCinemas, setFilteredCinemas] = useState([]);
    const [hasFiltered, setHasFiltered] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const cinemasPerPage = 4;
    const allShowtimes = movieShowtime || [];
    const allCinemasGrouped = groupShowtimesByCinema(allShowtimes);

    const locationOptions = [...new Set(
        allShowtimes
            .filter(s => !formData.date || s.date === formData.date)
            .filter(s => !formData.time || s.time === formData.time)
            .map(s => s.city)
    )].filter(Boolean).sort();

    const dateOptions = [...new Set(
        allShowtimes
            .filter(s => !formData.location || s.city?.toLowerCase() === formData.location)
            .filter(s => !formData.time || s.time === formData.time)
            .map(s => s.date)
    )].filter(Boolean).sort();

    const timeOptions = [...new Set(
        allShowtimes
            .filter(s => !formData.location || s.city?.toLowerCase() === formData.location)
            .filter(s => !formData.date || s.date === formData.date)
            .map(s => s.time)
    )].filter(Boolean).sort();

    useEffect(() => {
        if (id) {
            dispatch(getMovieDetail(id));
            dispatch(getMovieShowtime(id));
        }
    }, [id, dispatch]);

    useEffect(() => {
        if (!loading && movieDetail && location.state?.scrollToTiket) {
            const timer = setTimeout(() => {
                const ticketSection = document.getElementById("booking-area");
                if (ticketSection) ticketSection.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [location, loading, movieDetail]);

    useEffect(() => {
        const { date, time, location: loc } = formData;
        const anySelected = date || time || loc;

        if (!anySelected) {
            setHasFiltered(false);
            setFilteredCinemas([]);
            return;
        }

        setHasFiltered(true);
        setCurrentPage(1);
        setSelectedCinema("");

        let result = [...allCinemasGrouped];
        if (loc) result = result.filter(c => c.city === loc);
        result = result
            .map(cinema => {
                let schedules = [...cinema.schedules];
                if (date) schedules = schedules.filter(s => s.date === date);
                if (time) schedules = schedules.filter(s => s.time === time);
                return { ...cinema, schedules };
            })
            .filter(cinema => cinema.schedules.length > 0);

        setFilteredCinemas(result);
    }, [formData, movieShowtime]);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        try {
            return new Intl.DateTimeFormat("en-US", { month: "long", day: "2-digit", year: "numeric" }).format(new Date(dateString));
        } catch { return dateString; }
    };

    const formatTimeAMPM = (timeString) => {
        if (!timeString) return "";
        const [hours, minutes] = timeString.split(":");
        const h = parseInt(hours, 10);
        const ampm = h >= 12 ? "PM" : "AM";
        const displayHours = h % 12 || 12;
        return `${String(displayHours).padStart(2, "0")}:${minutes} ${ampm}`;
    };

    const formatDuration = (timeString) => {
        if (!timeString) return "";
        const [hours, minutes] = timeString.split(":");
        return `${parseInt(hours, 10)} hours ${parseInt(minutes, 10)} minutes`;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleBookNow = () => {
        if (!formData.date || !formData.time || !formData.location || !selectedCinema) {
            toast.error("Please select date, time, location, and a cinema first!");
            return;
        }
        const cinema = filteredCinemas.find(c => c.id === selectedCinema);
        if (!cinema) return;

        const schedule = cinema.schedules.find(
            s => s.date === formData.date && s.time === formData.time
        ) || cinema.schedules[0];

        if (!schedule?.showtime_id) {
            toast.error("Showtime not found, please reselect.");
            return;
        }

        navigate(`/users/order?showtime_id=${schedule.showtime_id}`, {
            state: {
                showtime_id: schedule.showtime_id,
                movie: {
                    id: movieDetail?.id,
                    title: movieDetail?.title,
                    poster: movieDetail?.poster,
                    duration: movieDetail?.duration,
                    genres: movieDetail?.genres,
                },
                cinema: {
                    id: cinema.id,
                    name: cinema.name,
                    logo: cinema.logo,
                    city: cinema.city,
                },
                schedule: {
                    date: schedule.date,
                    time: schedule.time,
                    price: schedule.price,
                },
            },
        });
    };

    const totalPages = Math.ceil(filteredCinemas.length / cinemasPerPage);
    const currentCinemas = filteredCinemas.slice((currentPage - 1) * cinemasPerPage, currentPage * cinemasPerPage);

    const getPageNumbers = () => {
        if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
        const pages = [];
        const start = Math.max(1, currentPage - 2);
        const end = Math.min(totalPages, currentPage + 2);
        if (start > 1) pages.push(1, "...");
        for (let i = start; i <= end; i++) pages.push(i);
        if (end < totalPages) pages.push("...", totalPages);
        return pages;
    };

    if (loading) return <div className="text-center py-20 text-xl font-bold">Loading Movie Details...</div>;
    if (error) return <div className="text-center py-20 text-red-500 font-bold">Error: {error}</div>;
    if (!movieDetail) return <div className="text-center py-20 text-gray-500">Movie Not Found</div>;

    return (
        <section id="movie-detail-container">
            <section className="relative px-0 w-full h-120 overflow-hidden bg-black">
                <img className="object-cover w-full h-full object-center" src={`${API_URL}${movieDetail?.poster}`} alt={movieDetail?.title} />
                <div className="absolute h-120 inset-0 bg-black/50" />
            </section>

            <section className="px-5 md:px-20 lg:px-24 -mt-90 z-10 relative">
                <section className="md:flex md:flex-row">
                    <div>
                        <img className="md:w-80 md:mt-20 rounded-md shadow-lg" src={`${API_URL}${movieDetail?.poster}`} alt={movieDetail?.title} />
                    </div>
                    <div className="md:mt-95 md:ml-10 md:text-black">
                        <p className="text-center md:text-left text-xl my-3 md:my-0 font-bold md:text-3xl">{movieDetail?.title}</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                            {movieDetail?.genres?.map((g, index) => (
                                <span key={index} className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600 font-medium whitespace-nowrap">{g.genre}</span>
                            ))}
                        </div>
                        <section className="flex justify-between mt-5 md:gap-20 text-black">
                            <section>
                                <p className="text-sm text-gray-400">Release date</p>
                                <p className="mb-3 font-medium">{formatDate(movieDetail?.release_date)}</p>
                                <p className="text-sm text-gray-400">Duration</p>
                                <p className="font-medium">{formatDuration(movieDetail?.duration)}</p>
                            </section>
                            <section>
                                <p className="text-sm text-gray-400">Directed by</p>
                                <p className="mb-3 font-medium">{movieDetail?.directors}</p>
                                <p className="text-sm text-gray-400">Casts</p>
                                <div className="flex flex-wrap gap-1 font-medium">
                                    {movieDetail?.casts?.map((c, idx) => (
                                        <p key={idx}>{c.name}{idx < movieDetail.casts.length - 1 ? "," : ""}</p>
                                    ))}
                                </div>
                            </section>
                        </section>
                    </div>
                </section>
                <section className="mt-8">
                    <p className="text-lg font-bold md:text-2xl">Synopsis</p>
                    <p className="text-gray-500 leading-relaxed mt-2 md:text-lg md:w-2/3">{movieDetail?.synopsis}</p>
                </section>
            </section>

            <section id="booking-area" className="px-5 md:px-20 lg:px-24 text-center mt-10">
                <p className="font-bold text-lg md:hidden">Showtimes and Tickets</p>
                <p className="hidden md:block text-left text-2xl font-bold">Book Tickets</p>

                <div className="flex md:justify-between flex-col md:flex-row md:gap-10 gap-2 mt-4">

                    {/* Date */}
                    <section className="w-full">
                        <p className="text-start my-2 font-bold">Choose Date</p>

                        <div className="flex w-full rounded-sm items-center h-12 p-3 bg-gray-200 relative">
                            <img src="/src/assets/icons/calendar (1) 1.svg" alt="date" className="w-5 h-5 z-10" />
                            <select
                                name="date" id="date" value={formData.date} onChange={handleInputChange}
                                className="w-full bg-transparent outline-none text-center pl-3 pr-8 appearance-none cursor-pointer absolute inset-0 font-bold text-gray-500 p-3 z-0"
                            >
                                <option value="" disabled hidden>Set a date</option>
                                {dateOptions.map((date, index) => (
                                    <option key={index} value={date} className="text-black font-normal">{date}</option>
                                ))}
                            </select>
                            <img src="/src/assets/icons/Forward.svg" alt="" className="ml-auto z-10 w-4 h-4 pointer-events-none" />
                        </div>
                        {(formData.time || formData.location) && (
                            <p className="text-xs text-blue-500 mt-1 text-left">{dateOptions.length} date{dateOptions.length !== 1 ? "s" : ""} available</p>
                        )}
                    </section>

                    {/* Time */}
                    <section className="w-full">
                        <p className="text-start my-2 font-bold">Choose Time</p>
                        <div className="flex w-full rounded-sm items-center h-12 p-3 bg-gray-200 relative">
                            <img src="/src/assets/icons/time.svg" alt="time" className="w-5 h-5 z-10" />
                            <select
                                name="time" id="time" value={formData.time} onChange={handleInputChange}
                                className="w-full bg-transparent outline-none pl-3 pr-8 appearance-none cursor-pointer absolute inset-0 text-center font-bold text-gray-500 p-3 z-0"
                            >
                                <option value="" disabled hidden>Set a time</option>
                                {timeOptions.map((time, index) => (
                                    <option key={index} value={time} className="text-black font-normal">{formatTimeAMPM(time)}</option>
                                ))}
                            </select>
                            <img src="/src/assets/icons/Forward.svg" alt="" className="ml-auto z-10 w-4 h-4 pointer-events-none" />
                        </div>
                        {(formData.date || formData.location) && (
                            <p className="text-xs text-blue-500 mt-1 text-left">{timeOptions.length} time slot{timeOptions.length !== 1 ? "s" : ""} available</p>
                        )}
                    </section>

                    {/* Location */}
                    <section className="w-full">
                        <p className="text-start my-2 font-bold">Choose Location</p>
                        <div className="flex w-full rounded-sm items-center h-12 p-3 bg-gray-200 relative">
                            <img src="/src/assets/icons/entypo_location.svg" alt="location" className="w-5 h-5 z-10" />
                            <select
                                name="location" id="location" value={formData.location} onChange={handleInputChange}
                                className="w-full bg-transparent outline-none text-center pl-3 pr-8 appearance-none cursor-pointer absolute inset-0 font-bold text-gray-500 p-3 z-0"
                            >
                                <option value="" disabled hidden>Set a location</option>
                                {locationOptions.map((loc, index) => (
                                    <option key={index} value={loc.toLowerCase()} className="text-black font-normal">{loc}</option>
                                ))}
                            </select>
                            <img src="/src/assets/icons/Forward.svg" alt="" className="ml-auto z-10 w-4 h-4 pointer-events-none" />
                        </div>
                        {(formData.date || formData.time) && (
                            <p className="text-xs text-blue-500 mt-1 text-left">{locationOptions.length} city{locationOptions.length !== 1 ? "s" : ""} available</p>
                        )}
                    </section>
                </div>

                <section className="flex flex-row items-center justify-between">
                    {hasFiltered && (
                        <section className="flex font-bold my-5 flex-row items-center gap-2">
                            <p>Choose Cinema</p>
                            <p className="text-gray-400">{filteredCinemas.length} Result{filteredCinemas.length !== 1 ? "s" : ""}</p>
                        </section>
                    )}
                    {(formData.date || formData.time || formData.location) && (
                        <button
                            type="button"
                            onClick={() => setFormData({ date: "", time: "", location: "" })}
                            className="mt-4 md:mt-0 px-5 py-2 rounded-sm border border-gray-300 text-gray-500 hover:bg-gray-100 transition-colors text-sm font-medium"
                        >
                            Reset Filter
                        </button>
                    )}
                </section>
            </section>

            {hasFiltered && (
                <>
                    <section className="flex flex-col md:flex-row justify-start gap-4 md:gap-8 w-full px-5 md:px-20 lg:px-24 my-6">
                        {currentCinemas.map((cinema) => (
                            <button
                                key={cinema.id}
                                onClick={() => setSelectedCinema(cinema.id)}
                                className={`border flex rounded-md w-full md:w-1/4 py-6 min-h-20 bg-white transition-all duration-200 outline-none hover:shadow-md active:scale-95
                                    ${selectedCinema === cinema.id ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600" : "border-gray-300 hover:border-blue-500"}`}
                            >
                                <img className="h-12 px-6 p-1 mx-auto object-contain" src={cinema.logo} alt={cinema.name} />
                            </button>
                        ))}
                        {filteredCinemas.length === 0 && (
                            <p className="text-center w-full text-gray-400 my-4">There are no cinemas available for this selection.</p>
                        )}
                    </section>

                    {totalPages > 1 && (
                        <section className="flex justify-center items-center gap-2 my-5">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >‹</button>
                            {getPageNumbers().map((num, idx) =>
                                num === "..." ? (
                                    <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 select-none">...</span>
                                ) : (
                                    <button
                                        key={num}
                                        onClick={() => setCurrentPage(num)}
                                        className={`w-9 h-9 rounded-md border text-sm font-medium transition-colors ${currentPage === num ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"}`}
                                    >{num}</button>
                                )
                            )}
                            <button
                                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >›</button>
                        </section>
                    )}
                </>
            )}

            <section className="px-5 flex justify-center">
                <Button color="blue" onClick={handleBookNow} className="w-full md:w-60 rounded-md m-auto my-5 px-10 py-3 text-lg font-bold">
                    Book Now
                </Button>
            </section>

            <Footer />
        </section>
    );
}

export default MovieDetails;