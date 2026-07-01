"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function MonthlyTrendChart({ data }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Tendencia mensual</h2>

        <p className="text-slate-400 text-sm mt-1">
          Comparación de ingresos y gastos
        </p>
      </div>

      <div className="w-full h-70 min-w-0">
        <ResponsiveContainer width="100%" aspect={4.5}>
          <BarChart data={data}>
            <XAxis
              dataKey="month"
              tick={{ fill: "#94A3B8" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fill: "#94A3B8" }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                background: "#0F172A",
                border: "1px solid #1E293B",
                borderRadius: "16px",
              }}
            />

            <Bar
              dataKey="income"
              name="Ingresos"
              fill="#22C55E"
              radius={[10, 10, 0, 0]}
            />

            <Bar
              dataKey="expense"
              name="Gastos"
              fill="#EF4444"
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
