import React from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip
} from "chart.js";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const SkillRadar = ({ skills }) => {
  const playerSkills = skills || {
    pace: 85,
    shooting: 78,
    passing: 82,
    dribbling: 88,
    defending: 45,
    physical: 72
  };

  const data = {
    labels: Object.keys(playerSkills).map((skill) => skill.charAt(0).toUpperCase() + skill.slice(1)),
    datasets: [
      {
        label: "Player Skills",
        data: Object.values(playerSkills),
        backgroundColor: "rgba(34, 197, 94, 0.16)",
        borderColor: "rgba(34, 197, 94, 0.85)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(34, 197, 94, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: { display: false, stepSize: 20 },
        grid: { color: "rgba(255,255,255,0.07)" },
        angleLines: { color: "rgba(255,255,255,0.07)" },
        pointLabels: {
          color: "rgba(255,255,255,0.75)",
          font: { size: 12, family: "Inter", weight: "500" }
        }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleColor: "#fff",
        bodyColor: "#22c55e",
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12
      }
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <Radar data={data} options={options} />
    </div>
  );
};

export default SkillRadar;
