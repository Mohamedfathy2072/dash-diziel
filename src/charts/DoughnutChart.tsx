import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import type { DoughnutChartTypes } from "../types/charts";

const DoughnutChart = ({
  half,
  className,
  dataSets,
  labels,
}: DoughnutChartTypes) => {
  ChartJS.register(ArcElement, Tooltip, Legend);
  const { i18n } = useTranslation()

  const data = {
    labels: labels,
    datasets: [
      {
        label: "",
        data: dataSets,
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)", // blue
          "rgba(16, 185, 129, 0.8)", // green
          "rgba(139, 92, 246, 0.8)", // purple
          "rgba(236, 72, 153, 0.8)", // pink
          "rgba(251, 146, 60, 0.8)", // orange
        ],
        borderWidth: 0,
        hoverBorderWidth: 3,
        hoverBorderColor: "#fff",
      },
    ],
  };

  const options = {
    responsive: true,
    cutout: "70%",
    rotation: half ? -90 : i18n.language === "ar" ? 180 : 360,
    circumference: half ? 180 : 360,
    plugins: {
      legend: {
        display: false,
      },
    }
  };

  return <Doughnut className={className} data={data} options={options} />;
};

export default DoughnutChart;
