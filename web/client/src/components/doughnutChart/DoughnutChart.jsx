import React from "react";
import { Doughnut } from "react-chartjs-2";

function DoughnutChart({ chartData, title }) {
  return (
    <div className="chart-container">
      <Doughnut
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: title,
            },
          },
        }}
      />
    </div>
  );
}
export default DoughnutChart;
