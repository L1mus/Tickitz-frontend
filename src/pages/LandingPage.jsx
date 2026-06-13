    import InputField from "../components/atoms/Input";
    import Footer from "../components/organism/Footer";
    import Header from "../components/organism/Header";
    import MovieCard from "../components/organism/MovieCard";
    import React, { useEffect, useRef, useState } from "react";
    import axios from "axios";
    import { useDispatch, useSelector } from "react-redux";
    import { getMovie } from "../redux/slices/movieSlice";
    import { useNavigate } from "react-router";

    function LandingPage() {
        const navigate = useNavigate()
        const dispatch = useDispatch();
        const { movieList, upcomingMovies, nowShowingMovies, loading, error } = useSelector((state) => state.movies)
        const API_URL ="http://localhost:8080/img/"

        useEffect(() => {
            dispatch(getMovie({ status: "now_showing", limit: 4 }));
            dispatch(getMovie({ status: "upcoming"}));
        }, [dispatch])

        const upComing = upcomingMovies
        const movies = nowShowingMovies

        console.log(upComing)
        const sliderRef = useRef(null);

        const [canGoLeft, setCanGoLeft] = useState(false);
        const [canGoRight, setCanGoRight] = useState(true);
        const [isTrailerOpen, setIsTrailerOpen] = useState(false);

        const checkScrollPosition = () => {
            if (sliderRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;

                setCanGoLeft(scrollLeft > 2);

                setCanGoRight(scrollLeft + clientWidth < scrollWidth - 2);
            }
        };

        useEffect(() => {
            checkScrollPosition();
            window.addEventListener("resize", checkScrollPosition);
            return () => window.removeEventListener("resize", checkScrollPosition);
        }, []);

        const slider = (direction) => {
            if (sliderRef.current) {
                const slidingDistance = 300;

                sliderRef.current.scrollBy({
                    left: direction === "next" ? slidingDistance : -slidingDistance,
                    behavior: "smooth",
                });
            }
        };

        return (
            <>
                <main className="px-5 md:px-20 lg:px-24">
                    <section className="grid md:flex md:items-center md:justify-between py-8">
                        <section className="text-center md:text-left flex flex-col gap-5">
                            <h1 className="text-xl font-bold text-primary">MOVIE TICKET PURCHASES #1 IN INDONESIA</h1>
                            <h1 className="text-4xl md:text-5xl leading-normal">Experience the Magic of Cinema: Book Your Tickets Today</h1>
                            <p className="text-md text-gray-400">Sign up and get the ticket with a lot of discount</p>
                        </section>
                        <section>
                            <div className="m-auto mt-5 grid size-75 md:size-100 lg:size-110 grid-cols-2 grid-rows-3 gap-4">
                                <div className="row-span-2 col-start-1 row-start-1">
                                    <img src="/src/assets/images/nobody-loves-kay.webp" alt="" className="w-full h-full object-cover rounded-t-lg" />
                                </div>

                                <div className="col-start-1 row-start-3">
                                    <img src="/src/assets/images/monster-pabrik-rambut.webp" alt="" className="w-full h-full object-cover rounded-b-lg" />
                                </div>

                                <div className="col-start-2 row-start-1">
                                    <img src="/src/assets/images/colony.webp" alt="" className="w-full h-full object-cover rounded-t-lg" />
                                </div>

                                <div className="row-span-2 col-start-2 row-start-2">
                                    <img src="/src/assets/images/warkop-dki.webp" alt="" className="w-full h-full object-cover rounded-b-lg" />
                                </div>
                            </div>

                        </section>
                    </section>

                    <section>
                        <section className="text-center md:text-start md:w-1/2">
                            <p className="text-primary font-bold py-5">WHY CHOOSE US</p>
                            <p className="text-4xl md:text-3xl leading-normal">Unleashing the Ultimate Movie Experience</p>
                        </section>
                        <section className="text-center flex flex-col md:flex-row md:text-justify md:my-2 md:items-start gap-8 py-5">
                            <div>
                                <img className="m-auto md:m-0" src="/src/assets/icons/shield.svg" alt="guaranteed" />
                                <p className="font-bold py-2 md:py-3">Guaranteed</p>
                                <p className="text-gray-500">Book your cinema tickets with total confidence. We ensure your seats are locked in and confirmed instantly every time.</p>
                            </div>
                            <div>
                                <img className="m-auto md:m-0" src="/src/assets/icons/afordable.svg" alt="affordable" />
                                <p className="font-bold py-2 md:py-3">Affordable</p>
                                <p className="text-gray-500">Enjoy the best movie deals in town. We provide premium cinema experiences that are easy on your pocket every day.</p>
                            </div>
                            <div>
                                <img className="m-auto md:m-0" src="/src/assets/icons/customer.svg" alt="customer-service" />
                                <p className="font-bold py-2 md:py-3">24/7 Customer Support</p>
                                <p className="text-gray-500">Need a hand with your booking? Our dedicated team is online around the clock to assist you with any concerns.</p>
                            </div>
                        </section>
                    </section>

                    <section className="w-full py-10">
                        <section className="text-center py-5 md:w-1/2 md:m-auto px-4">
                            <p className="font-bold text-primary">MOVIES</p>
                            <p className="text-3xl py-5">Exciting Movies That Should Be Watched Today</p>
                        </section>

                        <section className="w-full">
                            <section className="flex w-full overflow-x-auto snap-x snap-mandatory gap-6 pb-6 px-4 md:px-0 scrollbar-hide">

                                {movies?.map((m, index) => (
                                    <div
                                        key={index}
                                        className="w-[calc(100%/4-18px)] min-w-65 md:min-w-0 shrink-0 snap-start"
                                    >
                                        <MovieCard
                                            id={m.id}
                                            poster={`${API_URL}${m.poster}`}
                                            title={m.title}
                                            genres={m.genres}
                                        />
                                    </div>
                                ))}

                            </section>
                        </section>

                        <button onClick={() => navigate("/movies")} className="hidden md:block font-bold mx-auto text-primary mt-4">
                            View All ➔
                        </button>
                    </section>


                    <section className="w-full py-10">
                        <div className="text-center md:text-start flex justify-between items-end pb-5 px-5 md:px-0">
                            <div>
                                <p className="font-bold text-primary">UPCOMING MOVIES</p>
                                <h2 className="text-3xl md:text-3xl mt-1 text-gray-900">Exciting Movies Coming Soon</h2>
                            </div>

                            {loading ? (
                                <div className="text-center py-10 text-gray-500 font-medium">Loading movies...</div>
                            ) : error ? (
                                <div className="text-center py-10 text-red-500 font-medium">Error: {error}</div>
                            ) : upComing.length === 0 ? (
                                <div className="text-center py-10 text-gray-500 font-medium">No movies found.</div>
                            ) : (
                                <div>

                                    {upComing?.length > 4 && (
                                        <div className="hidden md:flex gap-3">
                                            <button
                                                onClick={() => slider("prev")}
                                                className={`w-10 h-10 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-300 transition-all duration-300 shadow-sm ${!canGoLeft ? "opacity-0 pointer-events-none" : "opacity-100"
                                                    }`}
                                            >
                                                <span className="-scale-x-100 inline-block">➔</span>
                                            </button>

                                            <button
                                                onClick={() => slider("next")}
                                                className={`w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:opacity-90 transition-all duration-300 shadow-sm ${!canGoRight ? "opacity-0 pointer-events-none" : "opacity-100"
                                                    }`}
                                            >
                                                ➔
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>


                        <section
                            ref={sliderRef}
                            onScroll={checkScrollPosition}
                            className="flex w-full overflow-x-auto snap-x snap-mandatory gap-6 pb-6 px-5 md:px-0 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
                            {upComing.map((m, index) => (
                                <div
                                    key={index}
                                    className="w-[calc(100%/4-18px)] min-w-65 md:min-w-0 shrink-0 snap-start"
                                >
                                    <MovieCard
                                        id={m.id}
                                        poster={`${API_URL}${m.poster}`}
                                        title={m.title}
                                        release={m.release_date}
                                        genres={m.genres}
                                    />
                                </div>
                            ))}
                        </section>
                    </section>



                    <section className="bg-blue-600 w-full my-5 h-120 md:h-80 rounded-3xl p-8 text-white text-center shadow-lg relative overflow-hidden">

                        <h2 className="text-2xl md:text-5xl mb-4 mt-10">Subscribe to our newsletter</h2>

                        <div className="flex flex-col md:flex-row md:justify-center gap-3">
                            <InputField className="md:w-60" placeholder="first name"></InputField>
                            <InputField className="md:w-60" placeholder="email address"></InputField>
                            <button className="bg-white text-blue-600 font-bold md:w-60 py-3 rounded-lg mt-2">
                                Subscribe Now
                            </button>
                        </div>

                        <div className="absolute -bottom-30 -right-20 w-50 h-50 border-4 border-white/80 rounded-full"></div>
                    </section>
                </main>
                <Footer></Footer>
            </>
        )
    }

    export default LandingPage;