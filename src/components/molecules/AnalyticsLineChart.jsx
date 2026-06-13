
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

function AnalyticsLineChart({ chartData, labelName }) {
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label: labelName,
        data: chartData,
        borderColor: '#4E60FF',
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(78, 96, 255, 0.35)');
          gradient.addColorStop(1, 'rgba(78, 96, 255, 0.00)');
          return gradient;
        },
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#4E60FF',
        titleColor: '#fff',
        bodyColor: '#fff',
        displayColors: false,
        padding: 10,
        cornerRadius: 6,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#9CA3AF', font: { size: 11 } },
      },
      y: {
        min: 0,
        max: 800,
        ticks: {
          stepSize: 200,
          color: '#9CA3AF',
          callback: (value) => '$' + value,
          font: { size: 11 },
        },
        grid: { drawBorder: false },
      },
    },
  };

  return <Line data={data} options={options} />;
}

export default AnalyticsLineChart;