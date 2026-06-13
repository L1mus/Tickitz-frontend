
import Header from '../components/organism/Header';
import SalesChartCard from '../components/organism/SalesChartCard';
import TicketSalesCard from '../components/organism/TicketSalesCard';


function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />

      <main className="mx-auto px-4 py-6 md:px-20 md:py-10">
        
        {/* Section 1: Sales Chart */}
        <SalesChartCard />

        {/* Section 2: Ticket Sales */}
        <TicketSalesCard />

      </main>

      {/* Global Custom Scrollbar Style untuk Area Table/Chart Mobile */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #F3F4F6;
          border-radius: 999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #D1D5DB;
          border-radius: 999px;
        }
      `}} />
    </div>
  );
}

export default Dashboard;