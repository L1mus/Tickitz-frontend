import { Button } from '../components/atoms/Button';
import { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router';
import Footer from '../components/organism/Footer';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { getMovieDetail, getMovieShowtime } from '../redux/slices/movieSlice';
const ASSET_URL = import.meta.env.VITE_ASSET_URL || 'http://localhost:8080';


const groupShowtimesByCinema = (showtimeList) => {
    if (!showtimeList || showtimeList.length === 0) return [];
    const groups = showtimeList.reduce((acc, curr) => {
        const cinemaId = curr.cinema_id;
        if (!acc[cinemaId]) {
            acc[cinemaId] = {
                id: cinemaId,
                name: curr.cinema_name,
                logo: curr.cinema_logo ? `${ASSET_URL}${curr.cinema_logo}` : '',
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

    const { movieDetail, movieShowtime, loading, error, upcomingMovies } = useSelector(
        (state) => state.movies
    );

    const isUpcoming = upcomingMovies?.some((m) => m.id === Number(id));
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [selectedCinema, setSelectedCinema] = useState('');
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        location: '',
    });
    const [errors, setErrors] = useState({
        date: false,
        time: false,
        location: false,
        cinema: false
    });

    const [filteredCinemas, setFilteredCinemas] = useState([]);
    const [hasFiltered, setHasFiltered] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const cinemasPerPage = 4;
    const allShowtimes = movieShowtime || [];
    const allCinemasGrouped = groupShowtimesByCinema(allShowtimes);

    const locationOptions = [
        ...new Set(
            allShowtimes
                .filter((s) => !formData.date || s.date === formData.date)
                .filter((s) => !formData.time || s.time === formData.time)
                .map((s) => s.city)
        ),
    ]
        .filter(Boolean)
        .sort();

    const dateOptions = [
        ...new Set(
            allShowtimes
                .filter(
                    (s) =>
                        !formData.location || s.city?.toLowerCase() === formData.location
                )
                .filter((s) => !formData.time || s.time === formData.time)
                .map((s) => s.date)
        ),
    ]
        .filter(Boolean)
        .sort();

    const timeOptions = [
        ...new Set(
            allShowtimes
                .filter(
                    (s) =>
                        !formData.location || s.city?.toLowerCase() === formData.location
                )
                .filter((s) => !formData.date || s.date === formData.date)
                .map((s) => s.time)
        ),
    ]
        .filter(Boolean)
        .sort();

    useEffect(() => {
        if (id) {
            dispatch(getMovieDetail(id));
            dispatch(getMovieShowtime(id));
        }
    }, [id, dispatch]);

    useEffect(() => {
        if (!loading && movieDetail && location.state?.scrollToTiket) {
            const timer = setTimeout(() => {
                const ticketSection = document.getElementById('booking-area');
                if (ticketSection)
                    ticketSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
        setSelectedCinema('');

        let result = [...allCinemasGrouped];
        if (loc) result = result.filter((c) => c.city === loc);
        result = result
            .map((cinema) => {
                let schedules = [...cinema.schedules];
                if (date) schedules = schedules.filter((s) => s.date === date);
                if (time) schedules = schedules.filter((s) => s.time === time);
                return { ...cinema, schedules };
            })
            .filter((cinema) => cinema.schedules.length > 0);

        setFilteredCinemas(result);
    }, [formData, movieShowtime]);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            return new Intl.DateTimeFormat('en-US', {
                month: 'long',
                day: '2-digit',
                year: 'numeric',
            }).format(new Date(dateString));
        } catch {
            return dateString;
        }
    };

    const formatTimeAMPM = (timeString) => {
        if (!timeString) return '';
        const [hours, minutes] = timeString.split(':');
        const h = parseInt(hours, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayHours = h % 12 || 12;
        return `${String(displayHours).padStart(2, '0')}:${minutes} ${ampm}`;
    };

    const formatDuration = (timeString) => {
        if (!timeString) return '';
        const [hours, minutes] = timeString.split(':');
        return `${parseInt(hours, 10)} hours ${parseInt(minutes, 10)} minutes`;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        setErrors((prev) => ({ ...prev, [name]: false }));

        if (name === 'location') {
            dispatch(setSelectedLocation(value));
        }
    };

    const handleBookNow = () => {
        const newErrors = {
            date: !formData.date,
            time: !formData.time,
            location: !formData.location,
            cinema: !selectedCinema
        };

        setErrors(newErrors);

        if (newErrors.date || newErrors.time || newErrors.location || newErrors.cinema) {
            toast.error('Please fill in all options before booking!');
            return;
        }

        const cinema = filteredCinemas.find((c) => c.id === selectedCinema);
        if (!cinema) return;

        const schedule =
            cinema.schedules.find(
                (s) => s.date === formData.date && s.time === formData.time
            ) || cinema.schedules[0];

        if (!schedule?.showtime_id) {
            toast.error('Showtime not found, please reselect.');
            return;
        }

        navigate(`/users/order?showtime_id=${schedule.showtime_id}`);
    };


    const totalPages = Math.ceil(filteredCinemas.length / cinemasPerPage);
    const currentCinemas = filteredCinemas.slice(
        (currentPage - 1) * cinemasPerPage,
        currentPage * cinemasPerPage
    );

    const getPageNumbers = () => {
        if (totalPages <= 5)
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        const pages = [];
        const start = Math.max(1, currentPage - 2);
        const end = Math.min(totalPages, currentPage + 2);
        if (start > 1) pages.push(1, '...');
        for (let i = start; i <= end; i++) pages.push(i);
        if (end < totalPages) pages.push('...', totalPages);
        return pages;
    };

    if (loading)
        return (
            <div className="py-20 text-center text-xl font-bold">
                Loading Movie Details...
            </div>
        );
    if (error)
        return (
            <div className="py-20 text-center font-bold text-red-500">
                Error: {error}
            </div>
        );
    if (!movieDetail)
        return (
            <div className="py-20 text-center text-gray-500">Movie Not Found</div>
        );

    return (
        <section id="movie-detail-container">
            <section className="relative h-120 w-full overflow-hidden bg-black px-0">
                <img
                    className="h-full w-full object-cover object-center"
                    src={`${movieDetail?.poster}`}
                    alt={movieDetail?.title}
                />
                <div className="absolute inset-0 h-120 bg-black/50" />
            </section>

            <section className="relative z-10 -mt-90 px-5 md:px-20 lg:px-24">
                <section className="md:flex md:flex-row md:items-start">
                    <div className="shrink-0">
                        <img
                            className="rounded-md shadow-lg md:mt-30 md:w-80"
                            src={`${movieDetail?.poster}`}
                            alt={movieDetail?.title}
                        />
                    </div>

                    <div className="md:ml-10 md:text-black md:self-end">
                        <p className="my-3 text-center text-xl font-bold md:my-0 md:text-left md:text-3xl">
                            {movieDetail?.title}
                        </p>
                        <div className="mt-2 flex flex-wrap justify-center gap-2 md:justify-start">
                            {movieDetail?.genres?.map((g, index) => (
                                <span
                                    key={index}
                                    className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium whitespace-nowrap text-gray-600"
                                >
                                    {g.genre}
                                </span>
                            ))}
                        </div>

                        <section className="mt-5 flex justify-between text-black md:gap-20">
                            <section>
                                <p className="text-sm text-gray-400">Release date</p>
                                <p className="mb-3 font-medium">{formatDate(movieDetail?.release_date)}</p>
                                <p className="text-sm text-gray-400">Duration</p>
                                <p className="font-medium">{formatDuration(movieDetail?.duration)}</p>
                            </section>

                            <section className="max-w-xs">
                                <p className="text-sm text-gray-400">Directed by</p>
                                <p className="mb-3 font-medium">{movieDetail?.directors}</p>
                                <p className="text-sm text-gray-400">Casts</p>
                                <p className="font-medium">
                                    {movieDetail?.casts?.map((c, idx) => (
                                        <span key={idx}>
                                            {c.name}{idx < movieDetail.casts.length - 1 ? ', ' : ''}
                                        </span>
                                    ))}
                                </p>
                            </section>
                        </section>
                    </div>
                </section>

                <section className="mt-8">
                    <p className="text-lg font-bold md:text-2xl">Synopsis</p>
                    <p className="mt-2 leading-relaxed text-gray-500 md:w-2/3 md:text-lg">
                        {movieDetail?.synopsis}
                    </p>
                </section>
            </section>
            <section>
                {isUpcoming ? (
                    <div className="my-10 rounded-md bg-gray-100 py-10 text-center">
                        <p className='font-bold text-lg'>Coming Soon</p>
                        <p className="mt-2 text-gray-400">Tickets are not available yet. Stay tuned!</p>
                    </div>
                ) : (

                    <section
                        id="booking-area"
                        className="mt-10 px-5 text-center md:px-20 lg:px-24"
                    >
                        <p className="text-lg font-bold md:hidden">Showtimes and Tickets</p>
                        <p className="hidden text-left text-2xl font-bold md:block">
                            Book Tickets
                        </p>

                        <div className="mt-4 flex flex-col gap-2 md:flex-row md:justify-between md:gap-10">
                            {/* Date */}
                            <section className="w-full">
                                <p className="my-2 text-start font-bold">Choose Date</p>


                                <div className={`relative flex h-12 w-full border border-gray-300 items-center rounded-sm bg-white p-3
                                ${errors.date ? 'ring-2 ring-red-500' : formData.date ? 'ring-2 ring-primary' : ''}`}>
                                    <img
                                        src="/src/assets/icons/calendar (1) 1.svg"
                                        alt="date"
                                        className="z-10 h-5 w-5"
                                    />
                                    <select
                                        name="date"
                                        id="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        className="absolute inset-0 z-0 w-full cursor-pointer appearance-none bg-transparent p-3 pr-8 pl-3 text-center font-bold text-gray-500 outline-none"
                                    >
                                        <option value="" disabled hidden>
                                            Set a date
                                        </option>
                                        {dateOptions.map((date, index) => (
                                            <option
                                                key={index}
                                                value={date}
                                                className="font-normal text-black"
                                            >
                                                {date}
                                            </option>
                                        ))}
                                    </select>
                                    <img
                                        src="/src/assets/icons/Forward.svg"
                                        alt=""
                                        className="pointer-events-none z-10 ml-auto h-4 w-4"
                                    />
                                </div>
                                {errors.date && <p className="mt-1 text-left text-xs text-red-500">Please select a date</p>}

                                {(formData.time || formData.location) && (
                                    <p className="mt-1 text-left text-xs text-primary">
                                        {dateOptions.length} date{dateOptions.length !== 1 ? 's' : ''}{' '}
                                        available
                                    </p>
                                )}
                            </section>

                            {/* Time */}
                            <section className="w-full">
                                <p className="my-2 text-start font-bold">Choose Time</p>
                                <div className={`relative flex h-12 w-full items-center rounded-sm border border-gray-300 bg-white p-3
                                ${errors.time ? 'ring-2 ring-red-500' : formData.time ? 'ring-2 ring-primary' : ''}`}>
                                    <img
                                        src="/src/assets/icons/time.svg"
                                        alt="time"
                                        className="z-10 h-5 w-5"
                                    />
                                    <select
                                        name="time"
                                        id="time"
                                        value={formData.time}
                                        onChange={handleInputChange}
                                        className="absolute inset-0 z-0 w-full cursor-pointer appearance-none bg-transparent p-3 pr-8 pl-3 text-center font-bold text-gray-500 outline-none"
                                    >
                                        <option value="" disabled hidden>
                                            Set a time
                                        </option>
                                        {timeOptions.map((time, index) => (
                                            <option
                                                key={index}
                                                value={time}
                                                className="font-normal text-black"
                                            >
                                                {formatTimeAMPM(time)}
                                            </option>
                                        ))}
                                    </select>
                                    <img
                                        src="/src/assets/icons/Forward.svg"
                                        alt=""
                                        className="pointer-events-none z-10 ml-auto h-4 w-4"
                                    />
                                </div>
                                {errors.time && <p className="mt-1 text-left text-xs text-red-500">Please select a time</p>}

                                {(formData.date || formData.location) && (
                                    <p className="mt-1 text-left text-xs text-primary">
                                        {timeOptions.length} time slot
                                        {timeOptions.length !== 1 ? 's' : ''} available
                                    </p>
                                )}
                            </section>

                            {/* Location */}
                            <section className="w-full">
                                <p className="my-2 text-start font-bold">Choose Location</p>
                                <div className={`relative flex h-12 w-full border border-gray-300 items-center rounded-sm bg-white p-3
                                ${errors.location ? 'ring-2 ring-red-500' : formData.location ? 'ring-2 ring-primary' : ''}`}>
                                    <img
                                        src="/src/assets/icons/entypo_location.svg"
                                        alt="location"
                                        className="z-10 h-5 w-5"
                                    />
                                    <select
                                        name="location"
                                        id="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        className="absolute inset-0 z-0 w-full cursor-pointer appearance-none bg-transparent p-3 pr-8 pl-3 text-center font-bold text-gray-500 outline-none"
                                    >
                                        <option value="" disabled hidden>
                                            Set a location
                                        </option>
                                        {locationOptions.map((loc, index) => (
                                            <option
                                                key={index}
                                                value={loc.toLowerCase()}
                                                className="font-normal text-black"
                                            >
                                                {loc}
                                            </option>
                                        ))}
                                    </select>
                                    <img
                                        src="/src/assets/icons/Forward.svg"
                                        alt=""
                                        className="pointer-events-none z-10 ml-auto h-4 w-4"
                                    />
                                </div>
                                {errors.location && <p className="mt-1 text-left text-xs text-red-500">Please select a location</p>}
                                {(formData.date || formData.time) && (
                                    <p className="mt-1 text-left text-xs text-primary">
                                        {locationOptions.length} city
                                        {locationOptions.length !== 1 ? 's' : ''} available
                                    </p>
                                )}
                            </section>
                        </div>

                        <section className="flex flex-row items-center justify-between">
                            {hasFiltered && (
                                <section className="my-5 flex flex-row items-center gap-2 font-bold">
                                    <p>Choose Cinema</p>
                                    <p className="text-gray-400">
                                        {filteredCinemas.length} Result
                                        {filteredCinemas.length !== 1 ? 's' : ''}
                                    </p>
                                </section>
                            )}
                            {(formData.date || formData.time || formData.location) && (
                                <Button
                                    type="button"
                                    onClick={() => setFormData({ date: '', time: '', location: '' })}
                                    className="mt-4 rounded-sm border border-gray-300 px-5 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 md:mt-0"
                                >
                                    Reset Filter
                                </Button>
                            )}
                        </section>
                    </section>

                )}
            </section>
            {hasFiltered && (
                <>
                    <section className="my-6 flex w-full flex-col justify-start gap-4 px-5 md:flex-row md:gap-8 md:px-20 lg:px-24">
                        {currentCinemas.map((cinema) => (
                            <Button
                                key={cinema.id}
                                onClick={() => {
                                    setSelectedCinema(cinema.id);
                                    setErrors((prev) => ({ ...prev, cinema: false })); 
                                }}
                                className={`flex min-h-20 w-full rounded-md border bg-white py-6 transition-all duration-200 outline-none hover:shadow-md active:scale-95 md:w-1/4 
                                    ${selectedCinema === cinema.id
                                        ? 'border-blue-600 bg-blue-50 ring-2 ring-primary'
                                        : errors.cinema
                                            ? 'border-red-500 ring-2 ring-red-500' 
                                            : 'border-gray-300 hover:border-primary'
                                    }`}
                            >
                                <img
                                    className="mx-auto h-12 object-contain p-1 px-6"
                                    src={cinema.logo}
                                    alt={cinema.name}
                                />
                            </Button>
                        ))}
                        {filteredCinemas.length === 0 && (
                            <p className="my-4 w-full text-center text-gray-400">
                                There are no cinemas available for this selection.
                            </p>
                        )}
                    </section>
                    {errors.cinema && <p className="px-5 text-left text-xs text-red-500 md:px-20 lg:px-24">Please select a cinema</p>}

                    {totalPages > 1 && (
                        <section className="my-5 flex items-center justify-center gap-2">
                            <Button
                                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                ‹
                            </Button>
                            {getPageNumbers().map((num, idx) =>
                                num === '...' ? (
                                    <span
                                        key={`ellipsis-${idx}`}
                                        className="px-2 text-gray-400 select-none"
                                    >
                                        ...
                                    </span>
                                ) : (
                                    <Button
                                        key={num}
                                        onClick={() => setCurrentPage(num)}
                                        className={`h-9 w-9 rounded-md border text-sm font-medium transition-colors ${currentPage === num ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        {num}
                                    </Button>
                                )
                            )}
                            <Button
                                onClick={() =>
                                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                                }
                                disabled={currentPage === totalPages}
                                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                ›
                            </Button>
                        </section>
                    )}
                </>
            )}


            <section className="flex justify-center px-5">
                {isUpcoming ? (
                    <></>
                ) : (
                    <Button
                        color="blue"
                        onClick={handleBookNow}
                        className="m-auto my-5 w-full rounded-md px-10 py-3 text-lg font-bold md:w-60"
                    >
                        Book Now
                    </Button>
                )}
            </section>
            <Footer />
        </section>
    );
}

export default MovieDetails;
