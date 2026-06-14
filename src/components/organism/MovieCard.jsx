import { useNavigate } from 'react-router';

function MovieCard({
  id,
  poster,
  title,
  release,
  genres,
  onDetail,
  onBuyTicket,
}) {
  const navigate = useNavigate();

  const format = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(date);
    } catch (error) {
      console.log(error);
      return dateString;
    }
  };

  return (
    <div
      onClick={() => navigate(`/movies/${id}`)}
      className="group flex w-full cursor-pointer flex-col"
    >
      <div className="relative aspect-2/3 w-full overflow-hidden rounded-2xl shadow-md">
        <img
          src={poster.startsWith("https") ? poster : `http://localhost:8080/img/`+ poster}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/60 px-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="w-4/5 rounded-md border border-white bg-transparent py-2 text-center text-sm font-semibold text-white">
            Details
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/movies/${id}`, { state: { scrollToTiket: true } });
            }}
            className="w-4/5 cursor-pointer rounded-md bg-blue-600 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-500"
          >
            Buy Ticket
          </button>
        </div>
      </div>

      <p className="mt-2 line-clamp-2 text-lg font-bold text-gray-900">
        {title}
      </p>
      <p className="text-primary font-bold">{format(release)}</p>

      <div className=" flex flex-wrap gap-2 mt-1">
        {genres?.length === 0 ? (
          <p>Failed to load genre</p>
        ) : (
          genres?.map((g, index) => (
            <span
              key={index}
              className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium whitespace-nowrap text-gray-500"
            >
              {typeof g === 'object' ? g.genre : g}
            </span>
          ))
        )}
      </div>
    </div>
  );
}

export default MovieCard;
