"use client";
// components/BarChart.js
import React from "react";

import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = () => {
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

  const data = {
    labels: transactions0.map((t) => t.description).slice(0, 4),
    datasets: [
      {
        label: "Sales",
        data: transactions0.map((t) => t.price).slice(0, 4),
        backgroundColor: "rgba(75, 19, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Saler",
        data: transactions1.map((t) => t.price).slice(0, 4),
        backgroundColor: "rgba(79, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Sales Data",
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;
