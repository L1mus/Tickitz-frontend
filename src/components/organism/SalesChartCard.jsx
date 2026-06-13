import { useState } from 'react';
import AnalyticsLineChart from '../molecules/AnalyticsLineChart';
import FilterDropdown from '../molecules/FilterDropdown';
import { Button } from '../atoms/Button';




function SalesChartCard() {
  const salesDataPool = {
    'Movies Name': [0, 0, 0, 0, 0, 0],
    'Avengers: End Game': [320, 390, 580, 350, 280, 360],
    'Spiderman: Home Coming': [420, 290, 480, 550, 380, 490],
  };

  const movieOptions = [
    { value: 'Movies Name', label: 'Movies Name' },
    { value: 'Avengers: End Game', label: 'Avengers: End Game' },
    { value: 'Spiderman: Home Coming', label: 'Spiderman: Home Coming' },
  ];

  const periodOptions = [
    { value: 'Weekly', label: 'Weekly' },
    { value: 'Monthly', label: 'Monthly' },
  ];

  const [selectedMovie, setSelectedMovie] = useState('Avengers: End Game');
  const [selectedPeriod, setSelectedPeriod] = useState('Weekly');
  const [activeMovie, setActiveMovie] = useState('Avengers: End Game');

  const handleFilter = () => {
    setActiveMovie(selectedMovie);
  };

  const currentData = salesDataPool[activeMovie] || salesDataPool['Movies Name'];

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
          options={periodOptions} 
          className="w-full md:w-41.25" 
        />
        <Button
          onClick={handleFilter}
          shape="rectangle" 
          color="blue" 
          className="w-full md:w-30 rounded-xl px-10 py-3.5 text-sm font-semibold transition-all hover:bg-blue-800 active:scale-98"
        >
          Filter
        </Button>
      </div>

      <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-6">{activeMovie}</h3>

      <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
        <div className="h-75 min-w-125 md:min-w-full">
          <AnalyticsLineChart chartData={currentData} labelName="Sales ($)" />
        </div>
      </div>
    </div>
  );
}

export default SalesChartCard;