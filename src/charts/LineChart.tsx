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
import type { LineChartTypes } from "../types/charts";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ labels, dataPoints }: LineChartTypes) => {
  const { i18n } = useTranslation()
  const isRTL = i18n.language === "ar"

  const data = {
    labels: labels,
    datasets: [
      {
        label: "",
        data: dataPoints,
        fill: false,
        borderColor: "rgba(206, 200, 248, 1)",
        pointBackgroundColor: "rgba(154, 137, 255, 1)",
        pointBorderColor: "rgba(154, 137, 255, 1)",
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.4,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        text: "Monthly Revenue",
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

export default LineChart;
