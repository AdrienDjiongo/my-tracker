"use client";

import React from "react";
import { ResponsivePie } from "@nivo/pie";
import { useState, useEffect } from "react";

// Sample data for the pie chart

function PieChartOutputs({ dateFilter }) {
  const [data, setData] = useState(null);

  console.log(dateFilter + " is date filter");

  // Get today's date
  const today = new Date();

  // Get the date of today + 1 month
  const nextMonth = new Date(today);
  nextMonth.setMonth(today.getMonth() + 1);

  // Get the date of today - 1 month
  const lastMonth = new Date(today);
  lastMonth.setMonth(today.getMonth() - 1);
  let lm = lastMonth.toISOString().split("T")[0];
  let nm = nextMonth.toISOString().split("T")[0];

  useEffect(() => {
    fetch(
      dateFilter
        ? `https://strong-tranquility-production.up.railway.app/Dashboard/outcomes?${dateFilter}`
        : `https://strong-tranquility-production.up.railway.app/Dashboard/outcomes?afterDate=${lm}&beforeDate=${nm}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data.json");
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
      })
      .catch((error) => console.error("Error:", error));
  }, [dateFilter]);

  return (
    <div className="w-1/3 bg-white m-4 rounded-2xl ">
      <div style={{ height: "300px" }}>
        <p className="text-2xl mx-auto ">OUTPUTS</p>

        {data && data.length > 0 ? (
          <ResponsivePie
            data={data}
            margin={{ top: 40, right: 80, bottom: 40, left: 80 }}
            innerRadius={0.5} // Adjust inner radius to create a donut chart effect
            padAngle={0.7} // Spacing between slices
            cornerRadius={3} // Rounded corners for each slice
            activeOuterRadiusOffset={8}
            borderWidth={1}
            borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
            enableArcLinkLabels={true} // Hide the labels linking to the arcs
            enableArcLabels={true} // Show the labels directly on the arcs
            arcLabel={(e) => `${e.id}: ${e.value}%`} // Format the labels
            arcLabelsRadiusOffset={0.5} // Control the label's distance from the center
            colors={{ scheme: "nivo" }} // Choose a color scheme
          />
        ) : (
          // If data is not available, show a loading message
          <div style={{ height: "300px" }}>
            <p>Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
}
export default PieChartOutputs;
