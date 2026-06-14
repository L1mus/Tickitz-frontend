import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AnalyticsLineChart from '../molecules/AnalyticsLineChart';
import FilterDropdown from '../molecules/FilterDropdown';
import { Button } from '../atoms/Button';
import { fetchMovieOptionsThunk, fetchTicketSalesThunk } from '../../redux/slices/dashboardSlice';

function TicketSalesCard() {
  const dispatch = useDispatch();

  const { labels, values, isLoading, error } = useSelector((state) => state.dashboard.ticketSales);
  const genres = useSelector((state) => state.dashboard.genres);
  const locations = useSelector((state) => state.dashboard.locations);

  const [selectedGenre, setSelectedGenre] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState(0);
  const [activeTitle, setActiveTitle] = useState('All Genres, All Locations');

  const genreOptions = [
    { value: 0, label: 'All Genres' },
    ...genres.map((g) => ({ value: g.id, label: g.name })),
  ];

  const locationOptions = [
    { value: 0, label: 'All Locations' },
    ...locations.map((l) => ({ value: l.id, label: l.name })),
  ];

  useEffect(() => {
    dispatch(fetchMovieOptionsThunk());
    dispatch(fetchTicketSalesThunk({ genreId: 0, locationId: 0 }));
  }, [dispatch]);

  const handleFilter = () => {
    const gId = Number(selectedGenre);
    const lId = Number(selectedLocation);
    const genreLabel = genreOptions.find((g) => g.value === gId)?.label ?? 'All Genres';
    const locationLabel = locationOptions.find((l) => l.value === lId)?.label ?? 'All Locations';
    setActiveTitle(`${genreLabel}, ${locationLabel}`);
    dispatch(fetchTicketSalesThunk({ genreId: gId, locationId: lId }));
  };

  return (
    <div className="rounded-3xl bg-white p-6 md:p-10 shadow-sm">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Ticket Sales</h2>

      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
        <FilterDropdown
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          options={genreOptions}
          className="w-full md:w-56.75"
        />
        <FilterDropdown
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          options={locationOptions}
          className="w-full md:w-41.25"
        />
        <Button
          onClick={handleFilter}
          shape="rectangle"
          color="blue"
          className="w-full md:w-30 rounded-xl px-10 py-3.5 text-sm font-semibold transition-all hover:bg-blue-800 active:scale-98"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Filter'}
        </Button>
      </div>

      {error && (
        <p className="text-sm text-red-500 mb-4">Failed to load data: {error}</p>
      )}

      <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-6">{activeTitle}</h3>

      <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
        <div className="h-75 min-w-125 md:min-w-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              Loading...
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              An error occurred while loading data.
            </div>
          ) : labels.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              There is no data for this filter.
            </div>
          ) : (
            <AnalyticsLineChart
              chartData={values}
              chartLabels={labels}
              labelName="Tickets Sold"
              yPrefix="pcs. "
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default TicketSalesCard;