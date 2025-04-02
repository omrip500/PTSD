import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DummyChart = () => {
  const data = [
    { label: "Image 1", score: 30 },
    { label: "Image 2", score: 76 },
    { label: "Image 3", score: 60 },
  ];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <XAxis dataKey="label" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="score" fill="#0D47A1" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DummyChart;
