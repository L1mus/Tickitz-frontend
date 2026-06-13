import { useState } from 'react';

import AnalyticsLineChart from '../molecules/AnalyticsLineChart';

import FilterDropdown from '../molecules/FilterDropdown';
import { Button } from '../atoms/Button';



function TicketSalesCard() {
  const ticketDataPool = {
    'Adventure_Purwokerto': [200, 340, 510, 420, 300, 250],
    'Adventure_Jakarta': [500, 620, 750, 690, 580, 710],
    'Adventure_Bogor': [150, 220, 310, 290, 210, 180],
    'Comedy_Purwokerto': [180, 210, 250, 300, 150, 220],
    'Comedy_Jakarta': [400, 450, 520, 480, 510, 590],
    'Comedy_Bogor': [120, 190, 220, 240, 170, 200],
    'Category_Location': [0, 0, 0, 0, 0, 0],
  };

  const categoryOptions = [
    { value: 'Category', label: 'Category' },
    { value: 'Adventure', label: 'Adventure' },
    { value: 'Comedy', label: 'Comedy' },
  ];

  const locationOptions = [
    { value: 'Location', label: 'Location' },
    { value: 'Purwokerto', label: 'Purwokerto' },
    { value: 'Jakarta', label: 'Jakarta' },
    { value: 'Bogor', label: 'Bogor' },
  ];

  const [selectedCategory, setSelectedCategory] = useState('Adventure');
  const [selectedLocation, setSelectedLocation] = useState('Purwokerto');
  const [activeCategory, setActiveCategory] = useState('Adventure');
  const [activeLocation, setActiveLocation] = useState('Purwokerto');

  const handleFilter = () => {
    setActiveCategory(selectedCategory);
    setActiveLocation(selectedLocation);
  };

  const ticketKey = `${activeCategory}_${activeLocation}`;
  const currentData = ticketDataPool[ticketKey] || ticketDataPool['Category_Location'];

  return (
    <div className="rounded-3xl bg-white p-6 md:p-10 shadow-sm">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Ticket Sales</h2>
      
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
        <FilterDropdown
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)} 
          options={categoryOptions} 
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
        >
          Filter
        </Button>
      </div>

      <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-6">
        {activeCategory}, {activeLocation}
      </h3>

      <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
        <div className="h-75 min-w-125 md:min-w-full">
          <AnalyticsLineChart chartData={currentData} labelName="Tickets Sold" />
        </div>
      </div>
    </div>
  );
}

export default TicketSalesCard;