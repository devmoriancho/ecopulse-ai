"use client";

import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar } from "recharts";

interface SolarChartProps {
  status?: string;
}

export default function SolarChart({ status }: SolarChartProps) {
  const data = [
    { day: "Mon", index: status === "COMPLETED" ? 5.8 : 4.2 },
    { day: "Tue", index: status === "COMPLETED" ? 6.1 : 4.5 },
    { day: "Wed", index: status === "COMPLETED" ? 5.9 : 4.1 },
    { day: "Thu", index: status === "COMPLETED" ? 6.4 : 4.8 },
    { day: "Fri", index: status === "COMPLETED" ? 6.2 : 4.6 },
    { day: "Sat", index: status === "COMPLETED" ? 5.7 : 3.9 },
    { day: "Sun", index: status === "COMPLETED" ? 6.0 : 4.3 },
  ];

  return (
    <div className="w-full h-220px">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis
            dataKey="day"
            stroke="#4B5563"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#4B5563"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <Bar
            dataKey="index"
            fill="#10B981"
            radius={[4, 4, 0, 0]}
            barSize={20}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
