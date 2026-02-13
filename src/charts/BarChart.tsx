import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
  type ChartOptions,
} from "chart.js";

import { Bar } from "react-chartjs-2";
import { useTranslation } from "react-i18next";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const BarChart = ({
  dataSets,
  labels,
}: {
  dataSets: number[];
  labels: string[];
}) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const data = {
    labels: labels,
    datasets: [
      {
        data: dataSets,
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(236, 72, 153, 0.8)",
          "rgba(251, 146, 60, 0.8)",
        ],
        borderRadius: 12,
        barThickness: 45,
        borderSkipped: false,
        hoverBackgroundColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(139, 92, 246, 1)",
          "rgba(236, 72, 153, 1)",
          "rgba(251, 146, 60, 1)",
        ],
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        position: isRTL ? "right" : "left",
        grace: 0,
        beginAtZero: true,
      },
      x: {
        reverse: isRTL,
      },
    },
  };
  return <Bar data={data} options={options} />;
};

export default BarChart;
