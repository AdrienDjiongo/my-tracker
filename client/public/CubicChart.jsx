"use client";
// components/CubicChart.js
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import React from "react";

// Register the required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CubicChart = () => {
  const [transactions0, setTransactions0] = useState([]);
  const [transactions1, setTransactions1] = useState([]);

  useEffect(() => {
    // Fetch the JSON file from the public folder
    fetch(`http://localhost:5000/DashboardStats`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data.json");
        }
        return response.json();
      })
      .then((data) => {
        setTransactions0(data[0]);
        setTransactions1(data[1]);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  // Example data
  const data = {
    labels: transactions0.map((t) => t.description).slice(0, 4),
    datasets: [
      {
        label: "Sales",
        data: transactions0.map((t) => t.price).slice(0, 4),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4, // Cubic interpolation
        borderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: "Sales",
        data: transactions1.map((t) => t.price).slice(0, 2),
        borderColor: "rgba(255, 62, 62, 0.6)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4, // Cubic interpolation
        borderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Cubic Interpolation Chart",
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
      <Line
        className="text-[rgba(255,62,62,0.65)]"
        data={data}
        options={options}
      />
    </div>
  );
};

export default CubicChart;
