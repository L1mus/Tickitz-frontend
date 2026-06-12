import React from 'react';
import { useNavigate } from 'react-router';

function MovieCard({ id, poster, title, release, genres, onDetail, onBuyTicket }) {
    const navigate = useNavigate();

    const format = (dateString) => {
        if (!dateString) return "";
        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('en-US', {
                day:'numeric',
                month: 'long',
                year: 'numeric'
            }).format(date);
        } catch (error) {
            return dateString;
        }
    };

    return (
        <div onClick={() => navigate(`/movies/${id}`)}
            className="w-full flex flex-col cursor-pointer group">
            <div className="relative aspect-2/3 w-full rounded-2xl overflow-hidden shadow-md">
                <img
                    src={poster}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center gap-4 px-6">

                    <span className="w-4/5 py-2 bg-transparent border border-white text-white rounded-md font-semibold text-center text-sm">
                        Details
                    </span>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/movies/${id}`, { state: { scrollToTiket: true } });
                        }}
                        className="w-4/5 py-2 bg-blue-600 text-white hover:bg-blue-500 cursor-pointer rounded-md font-semibold text-center text-sm transition-colors"
                    >
                        Buy Ticket
                    </button>
                </div>
            </div>

            <p className="font-bold text-lg mt-3 text-gray-900 line-clamp-2">{title}</p>
            <p className="font-bold text-primary my-2">{format(release)}</p>

            <div className="flex flex-wrap gap-2 mt-1">

                {genres?.length === 0 ? (
                    <p>Failed to load genre</p>
                ) : (genres?.map((g, index) => (
                    <span
                        key={index}
                        className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-500 font-medium whitespace-nowrap"
                    >
                        {typeof g === 'object' ? g.genre : g}
                    </span>
                )))}
            </div>
        </div>
    );
}

export default MovieCard;
