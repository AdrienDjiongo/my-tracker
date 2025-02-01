"use client";
import { useState } from "react";
import { Line } from "react-chartjs-2";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Sample Data (can be from your API or database)
const allInputs = [
  { date: "2025-01-02", amount: 2000 },
  { date: "2025-01-10", amount: 1500 },
  { date: "2025-01-20", amount: 3000 },
  { date: "2025-01-30", amount: 2500 },
  { date: "2025-02-20", amount: 3000 },
  { date: "2025-02-30", amount: 2500 },
  { date: "2025-04-02", amount: 2000 },
  { date: "2025-04-10", amount: 1500 },
  { date: "2025-04-20", amount: 3000 },
];

const allOutputs = [
  { date: "2025-01-05", amount: 1000 },
  { date: "2025-01-15", amount: 1200 },
];

// Helper function to filter transactions by date range
const filterDataByDateRange = (startDate, endDate, allData) => {
  return allData.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate >= startDate && itemDate <= endDate;
  });
};

// Helper function to get unique dates from the filtered input and output data
const getUniqueDates = (inputs, outputs) => {
  const inputDates = inputs.map((input) => input.date);
  const outputDates = outputs.map((output) => output.date);
  return Array.from(new Set([...inputDates, ...outputDates])).sort();
};

export default function ExpenseDashboard() {
  const [startDate, setStartDate] = useState(new Date("2025-01-01"));
  const [endDate, setEndDate] = useState(new Date("2025-03-01"));

  // Filter the data based on the selected date range
  const filteredInputs = filterDataByDateRange(startDate, endDate, allInputs);
  const filteredOutputs = filterDataByDateRange(startDate, endDate, allOutputs);

  // Get the unique dates that have transactions
  const allDates = getUniqueDates(filteredInputs, filteredOutputs);

  // Prepare the data for the chart
  const inputData = allDates.map((date) => {
    const input = filteredInputs.find((item) => item.date === date);
    return input ? input.amount : null; // Use null for missing input on this date
  });

  const outputData = allDates.map((date) => {
    const output = filteredOutputs.find((item) => item.date === date);
    return output ? output.amount : null; // Use null for missing output on this date
  });

  const data = {
    labels: allDates,
    datasets: [
      {
        label: "Income (Inputs)",
        data: inputData,
        borderColor: "green",
        backgroundColor: "rgba(0, 255, 0, 0.2)",
        fill: true,
        tension: 0.4,
        spanGaps: true, // Ensure the curve is continuous even when there are null values
      },
      {
        label: "Expenses (Outputs)",
        data: outputData,
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.2)",
        fill: true,
        tension: 0.4,
        spanGaps: true, // Ensure the curve is continuous even when there are null values
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `$${tooltipItem.raw.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function (value) {
            return `$${value.toLocaleString()}`;
          },
        },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Line data={data} options={options} />
    </div>
  );
}
