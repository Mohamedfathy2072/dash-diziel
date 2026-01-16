import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  type ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useTranslation } from "react-i18next";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Dataset {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
  pointBackgroundColor: string;
  pointBorderColor: string;
}

interface MultiLineChartProps {
  labels: string[];
  datasets: Dataset[];
  title?: string;
}

const MultiLineChart = ({ labels, datasets, title }: MultiLineChartProps) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const data = {
    labels: labels,
    datasets: datasets.map((dataset) => ({
      ...dataset,
      fill: false,
      pointRadius: 6,
      pointHoverRadius: 8,
      tension: 0.4,
    })),
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: datasets.length > 1,
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
            weight: 500,
          },
        },
      },
      title: {
        display: !!title,
        text: title || "",
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        grid: {
          color: "rgba(200, 200, 200, 0.1)",
        },
        position: isRTL ? 'right' : 'left',
        ticks: {
          callback: function(value) {
            return '$' + value;
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        reverse: isRTL,
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default MultiLineChart;
