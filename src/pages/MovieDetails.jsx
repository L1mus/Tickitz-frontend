import { Button } from "../components/atoms/Button";
import { useState } from "react";

// dummy
const cinemaMockData = [
    {
        id: "1",
        logo: "/src/assets/images/ebv.id-black.svg",
        name: "EBV.id",
        address: "Whatever street no 12, South Purwokerto",
        schedules: [
            { className: "REGULAR", times: ["08:30 AM", "10:30 AM", "10:30 AM"] },
            { className: "GOLD", times: ["08:30 AM", "10:30 AM"] }
        ],
    },
    {
        id: "2",
        logo:"/src/assets/images/hiflix 2.svg",
        name: "Hiflix Cinema",
        address: "Whatever street no 15, North Purwokerto",
        schedules: [
            { className: "REGULAR", times: ["09:00 AM", "11:00 AM"] },
            { className: "PLATINUM S", times: ["09:00 AM", "11:00 AM"] }
        ],
    },
    {
        id: "3",
        logo: "/src/assets/images/CineOne21 2.svg",
        name: "CineOne 21",
        address: "Whatever street no 20, West Purwokerto",
        schedules: [
            { className: "REGULAR", times: ["10:00 AM", "12:00 PM"] },
            { className: "GOLD", times: ["08:30 AM", "10:30 AM"] }

        ],
    },
];

// cinema card
function CinemaCard({ cinema, selectedTime, setSelectedTime, defaultOpen }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden w-full h-fit">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-start justify-between p-5 text-left focus:outline-none"
            >
                <div>
                    <div className="text-xl w-20 font-bold font-serif text-black mb-1">
                        <img src={cinema.logo} alt="cinema" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">{cinema.name}</h3>
                    <p className="text-xs text-gray-400 mt-1 font-medium">{cinema.address}</p>
                </div>

                <div className="mt-1">
                    <svg
                        className={`w-5 h-5 text-gray-700 transition-transform duration-200 ${isOpen ? "" : "rotate-180"}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                </div>
            </button>

            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100 px-5 pb-6" : "grid-rows-[0fr] opacity-0 px-5 pb-0"}`}>
                <div className="overflow-hidden">
                    <hr className="border-gray-100 mb-5" />
                    <div className="space-y-6">
                        {cinema.schedules.map((schedule) => (
                            <div key={schedule.className}>
                                <h4 className="text-sm font-bold text-gray-900 tracking-wide mb-3">
                                    {schedule.className}
                                </h4>

                                <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
                                    {schedule.times.map((time, index) => {
                                        const timeId = `${cinema.id}-${schedule.className}-${index}`;
                                        const isTimeSelected = selectedTime === timeId;

                                        return (
                                            <button
                                                key={timeId}
                                                onClick={() => setSelectedTime(timeId)}
                                                className={`py-2 px-4 text-xs font-semibold rounded-full transition-all duration-150 ${
                                                    isTimeSelected
                                                        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                                }`}
                                            >
                                                {time}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// list cinema function
function CinemaList() {
    const [selectedTime, setSelectedTime] = useState("1-REGULAR-0");

    return (
        <div className="max-w-md md:max-w-6xl mx-auto p-4 flex flex-col md:flex-row md:items-start gap-4 h-auto transition-all duration-300">
            {cinemaMockData.map((cinema) => (
                <CinemaCard 
                    key={cinema.id}
                    cinema={cinema}
                    selectedTime={selectedTime}
                    setSelectedTime={setSelectedTime}
                    defaultOpen={cinema.id === "1"} 
                />
            ))}
        </div>
    );
}

function MovieDetails() {

    // logic state atau fetch harusnya disini
    
    // data dummy 
    const movies = [
        {
            id: "lion-king",
            poster: "/src/assets/images/example.png",
            title: "Lion King",
            release: "December 28, 2020",
            genre: ["Adventure", "Comedy"],
            duration: "2 hrs 13 min",
            director: "Jont Watss",
            cast: ["Tom Holland", "Robert Downey Jr"],
            synopsis: "Thrilled by his experience with the Avengers, Peter returns home, where he lives with his Aunt May, under the watchful eye of his new mentor Tony Stark, Peter tries to fall back into his normal daily routine - distracted by thoughts of proving himself to be more than just your friendly neighborhood Spider-Man - but when the Vulture emerges as a new villain, everything that Peter holds most important will be threatened."
        }]
    return (
        <section className="">
            {movies.map((m, index) => (

                <section key={index} className="relative px-0 w-full h-120 overflow-hidden bg-black">
                    <img className="object-cover w-full h-full object-center" src={m.poster} alt={m.title} />
                    <div className="absolute h-120 inset-0 bg-black/50"></div>
                </section>
            ))}

            {movies.map((m, index) => (
                <section key={index} className="px-5 md:px-20 lg:px-24 -mt-90 z-10 relative">
                    
                    <section className="md:flex md:flex-row">

                    <div>
                    <img className="md:w-80 md:mt-20" src={m.poster} alt={m.title} />
                    </div>

                    {/* movie detail */}
                    <div className="md:mt-95">
                    <p className="text-center text-lg font-bold md:-ml-58 md:text-3xl">{m.title}</p>
                    <div className="flex flex-wrap justify-center md:-ml-50 gap-2 mt-1">
                        <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-500 font-medium whitespace-nowrap">{m.genre[0]}</span>
                        <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-500 font-medium whitespace-nowrap">{m.genre[1]}</span>
                    </div>

                    <section className="flex justify-between mt-5 md:ml-10 md:gap-5">
                        <section>
                            <p className="text-sm text-gray-400">Release date</p>
                            <p className="mb-3">{m.release}</p>
                            <p className="text-sm text-gray-400">Duration</p>
                            <p >{m.duration}</p>
                        </section>
                        <section>
                            <p className="text-sm text-gray-400">Directed by</p>
                            <p className="mb-3">{m.director}</p>
                            <p className="text-sm text-gray-400">Casts</p>
                            <div className="md:flex md:gap-2">
                                <p>{m.cast[0]},</p>
                                <p>{m.cast[1]}</p>
                            </div>
                        </section>
                    </section>
                    </div>
                    </section>

                    <section className="md:mt-2">
                        <p className="text-lg font-bold md:text-2xl">Synopsis</p>
                        <p className="text-gray-400 leading-normal md:text-lg md:w-2/3">{m.synopsis}</p>
                    </section>
                </section>
            ))}

            {/* books filter */}
            <section className="px-5 md:px-20 lg:px-24 text-center mt-4">
                <p className="font-bold text-lg md:hidden">Showtimes and Tickets</p>
                <p className="hidden md:block text-left text-2xl">Book Tickets</p>

                <section className="flex flex-col md:flex-row md:gap-10 gap-2 mt-4">
                    <button className="flex w-full rounded-sm justify-between h-12 p-3 items-center bg-gray-200">
                        <img src="/src/assets/icons/calendar (1) 1.svg" alt="calendar" />
                        <p className="ml-5 mr-auto font-bold text-gray-500">Set a date</p>
                        <img src="/src/assets/icons/Forward.svg" alt="forward" />
                    </button>
                    <button className="flex w-full rounded-sm justify-between h-12 p-3 items-center bg-gray-200">
                        <img src="/src/assets/icons/entypo_location.svg" alt="location" />
                        <p className="ml-5 mr-auto font-bold text-gray-500">Set a city</p>
                        <img src="/src/assets/icons/Forward.svg" alt="forward" />
                    </button>
                    <Button color="blue" className="rounded-sm mt-4 md:mt-0 h-15 md:h-12 md:w-full text-xl">Filter</Button>
                </section>

                <p className="text-gray-400 font-bold my-2">39 Result</p>

            </section>

            {/* list cinema */}
            <section>
                <CinemaList></CinemaList>
            </section>

            {/* pagination */}
            <section className="flex justify-center gap-2 my-2">
                <Button className="border border-gray-300 rounded-md">1</Button>
                <Button className="border border-gray-300 rounded-md">2</Button>
                <Button className="border border-gray-300 rounded-md">3</Button>
                <Button className="border border-gray-300 rounded-md">4</Button>
            </section>

            <Button color="blue" className="hidden md:block m-auto my-5">Book Now</Button>
        </section>
    )
}

export default MovieDetails;