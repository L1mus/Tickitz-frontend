import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AnalyticsLineChart from '../molecules/AnalyticsLineChart';
import FilterDropdown from '../molecules/FilterDropdown';
import { Button } from '../atoms/Button';
import { fetchMovieListThunk, fetchSalesChartThunk } from '../../redux/slices/dashboardSlice';


const PERIOD_OPTIONS = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

function SalesChartCard() {
  const dispatch = useDispatch();

  const { labels, values, isLoading, error } = useSelector((state) => state.dashboard.salesChart);
  const movieList = useSelector((state) => state.dashboard.movieList);

  const [selectedMovie, setSelectedMovie] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');
  const [activeTitle, setActiveTitle] = useState('All Movies — Weekly');

  // Dropdown options dibangun dari movieList (dari Redux)
  const movieOptions = [
    { value: '', label: 'All Movies' },
    ...movieList.map((m) => ({ value: m.title, label: m.title })),
  ];

  // Fetch movie list untuk dropdown & chart awal saat mount
  useEffect(() => {
    dispatch(fetchMovieListThunk());
    dispatch(fetchSalesChartThunk({ filterBy: 'weekly', movieName: '' }));
  }, [dispatch]);

  const handleFilter = () => {
    const movieLabel = selectedMovie || 'All Movies';
    const periodLabel = selectedPeriod === 'weekly' ? 'Weekly' : 'Monthly';
    setActiveTitle(`${movieLabel} — ${periodLabel}`);
    dispatch(fetchSalesChartThunk({ filterBy: selectedPeriod, movieName: selectedMovie }));
  };

  return (
    <div className="rounded-3xl bg-white p-6 md:p-10 mb-10 shadow-sm">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Sales Chart</h2>

      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
        <FilterDropdown
          value={selectedMovie}
          onChange={(e) => setSelectedMovie(e.target.value)}
          options={movieOptions}
          className="w-full md:w-56.75"
        />
        <FilterDropdown
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          options={PERIOD_OPTIONS}
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
        <p className="text-sm text-red-500 mb-4">Gagal memuat data: {error}</p>
      )}

      <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-6">{activeTitle}</h3>

      <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
        <div className="h-75 min-w-125 md:min-w-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              Memuat data...
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              Terjadi kesalahan saat memuat data.
            </div>
          ) : labels.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              Tidak ada data untuk filter ini.
            </div>
          ) : (
            <AnalyticsLineChart
              chartData={values}
              chartLabels={labels}
              labelName="Revenue ($)"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default SalesChartCard;