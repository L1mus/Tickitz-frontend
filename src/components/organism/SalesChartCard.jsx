import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AnalyticsChart from '../molecules/AnalyticsLineChart';
import FilterDropdown from '../molecules/FilterDropdown';
import { Button } from '../atoms/Button';
import { fetchMovieListThunk, fetchSalesChartThunk } from '../../redux/slices/dashboardSlice';

const PERIOD_OPTIONS = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

function weekLabelToMonthName(label) {
  const match = label.match(/Week\s+(\d+)/i);
  if (!match) return label;

  const weekNum = parseInt(match[1], 10);

  const yearMatch = label.match(/(\d{4})/);
  const year = yearMatch ? parseInt(yearMatch[1], 10) : new Date().getFullYear();

  const simple = new Date(year, 0, 1 + (weekNum - 1) * 7);
  const dayOfWeek = simple.getDay();
  const isoWeekStart = new Date(simple);
  if (dayOfWeek <= 4) {
    isoWeekStart.setDate(simple.getDate() - simple.getDay() + 1);
  } else {
    isoWeekStart.setDate(simple.getDate() + 8 - simple.getDay());
  }

  return isoWeekStart.toLocaleString('en-US', { month: 'short' });
}

function convertWeekLabelsToMonths(labels) {
  const seenMonths = new Set();
  return labels.map((label) => {
    const monthName = weekLabelToMonthName(label);
    if (seenMonths.has(monthName)) {
      return '';
    }
    seenMonths.add(monthName);
    return monthName;
  });
}

function SalesChartCard() {
  const dispatch = useDispatch();

  const { labels, values, isLoading, error } = useSelector((state) => state.dashboard.salesChart);
  const movieList = useSelector((state) => state.dashboard.movieList);

  const [selectedMovie, setSelectedMovie] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');
  const [activeTitle, setActiveTitle] = useState('All Movies — Weekly');
  const [activePeriod, setActivePeriod] = useState('weekly');

  const movieOptions = [
    { value: '', label: 'All Movies' },
    ...movieList.map((m) => ({ value: m.title, label: m.title })),
  ];

  useEffect(() => {
    dispatch(fetchMovieListThunk());
    dispatch(fetchSalesChartThunk({ filterBy: 'weekly', movieName: '' }));
  }, [dispatch]);

  const handleFilter = () => {
    const movieLabel = selectedMovie || 'All Movies';
    const periodLabel = selectedPeriod === 'weekly' ? 'Weekly' : 'Monthly';
    setActiveTitle(`${movieLabel} — ${periodLabel}`);
    setActivePeriod(selectedPeriod);
    dispatch(fetchSalesChartThunk({ filterBy: selectedPeriod, movieName: selectedMovie }));
  };

  const isMonthly = activePeriod === 'monthly';

  const displayLabels = !isMonthly && labels.length > 0
    ? convertWeekLabelsToMonths(labels)
    : labels;

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
            <AnalyticsChart
              chartData={values}
              chartLabels={displayLabels}
              labelName="Revenue (Rp.)"
              yPrefix="Rp."
              chartType={isMonthly ? 'bar' : 'line'}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default SalesChartCard;