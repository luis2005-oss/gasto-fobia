"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

import { useFinance } from "../../context/finance-context";

const COLORS = ["#2563EB", "#22C55E", "#EF4444", "#F59E0B", "#8B5CF6"];

export default function ExpensesChart() {
  const { transactions } = useFinance();

  const dataMap = {};

  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      dataMap[t.category] =
        (dataMap[t.category] || 0) + Math.abs(Number(t.amount));
    });

  const data = Object.entries(dataMap).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
      <h2 className="font-bold mb-6">Gastos por categoría</h2>

      <div className="w-full h-75 min-w-0">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" aspect={2}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500">
            No hay gastos registrados
          </div>
        )}
      </div>
    </div>
  );
}
