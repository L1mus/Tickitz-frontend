import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Filler);

function calcNiceMax(dataMax) {
  if (!dataMax || dataMax <= 0) return 800;
  const magnitude = Math.pow(10, Math.floor(Math.log10(dataMax)));
  const nice = Math.ceil(dataMax / magnitude) * magnitude;
  return nice;
}

function AnalyticsChart({ chartData, chartLabels, labelName, yPrefix = 'Rp.', chartType = 'line', activeIndex = null }) {
  const labels = chartLabels && chartLabels.length > 0
    ? chartLabels
    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  const dataMax = chartData && chartData.length > 0 ? Math.max(...chartData) : 0;
  const maxValue = calcNiceMax(dataMax);
  const stepSize = maxValue / 4;

  const isBar = chartType === 'bar';

  const barColors = chartData?.map((_, i) => {
    if (Array.isArray(activeIndex)) {
      return activeIndex.length === 0 || activeIndex.includes(i)
        ? '#4E60FF'
        : 'rgba(78, 96, 255, 0.25)';
    }
    return activeIndex === null || activeIndex === i
      ? '#4E60FF'
      : 'rgba(78, 96, 255, 0.25)';
  });

  const data = {
    labels,
    datasets: [
      {
        fill: !isBar,
        label: labelName,
        data: chartData,
        borderColor: '#4E60FF',
        borderWidth: isBar ? 0 : 3,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: isBar ? 0 : 6,
        borderRadius: isBar ? 8 : 0,
        backgroundColor: isBar
          ? barColors
          : (context) => {
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
        // max: 8,    
        // maxRotation: 0,   
        // autoSkip: true,
      },
      y: {
        min: 0,
        max: maxValue,
        ticks: {
          stepSize,
          color: '#9CA3AF',
          callback: (value) => `${yPrefix}${value.toLocaleString('id-ID')}`,
          font: { size: 11 },
        },
        grid: { drawBorder: false },
      },
    },
  };

  return isBar
    ? <Bar data={data} options={options} />
    : <Line data={data} options={options} />;
}

export default AnalyticsChart;