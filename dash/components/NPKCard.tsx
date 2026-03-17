import React from "react";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface NPKCardProps {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  optimalRanges?: {
    nitrogen: { min: number; max: number };
    phosphorus: { min: number; max: number };
    potassium: { min: number; max: number };
  };
}

export function NPKCard({
  nitrogen,
  phosphorus,
  potassium,
  optimalRanges = {
    nitrogen: { min: 100, max: 150 },
    phosphorus: { min: 60, max: 100 },
    potassium: { min: 80, max: 120 },
  },
}: NPKCardProps) {
  const data = [
    {
      name: "N (Nitrogen)",
      value: nitrogen,
      optimal: optimalRanges.nitrogen.max,
      fill: "#10b981",
    },
    {
      name: "P (Phosphorus)",
      value: phosphorus,
      optimal: optimalRanges.phosphorus.max,
      fill: "#f59e0b",
    },
    {
      name: "K (Potassium)",
      value: potassium,
      optimal: optimalRanges.potassium.max,
      fill: "#8b5cf6",
    },
  ];

  const getStatus = (
    value: number,
    range: { min: number; max: number }
  ) => {
    if (value >= range.min && value <= range.max) return "optimal";
    if (value < range.min) return "deficient";
    return "excess";
  };

  const statuses = {
    nitrogen: getStatus(nitrogen, optimalRanges.nitrogen),
    phosphorus: getStatus(phosphorus, optimalRanges.phosphorus),
    potassium: getStatus(potassium, optimalRanges.potassium),
  };

  const getStatusBadge = (status: string) => {
    const badgeClasses = {
      optimal: "bg-emerald-100 text-emerald-800",
      deficient: "bg-rose-100 text-rose-800",
      excess: "bg-amber-100 text-amber-800",
    };
    return badgeClasses[status as keyof typeof badgeClasses] || "";
  };

  return (
    <Card className="p-6 border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">NPK Analysis</h3>
        <p className="text-sm text-gray-600">
          Nitrogen, Phosphorus & Potassium levels in your soil
        </p>
      </div>

      {/* Chart */}
      <div className="mb-6 -mx-6 px-6">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #4b5563",
                borderRadius: "8px",
              }}
              formatter={(value: number) => value.toFixed(1)}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Status indicators */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-green-200">
          <div className="text-sm font-medium text-gray-600 mb-2">Nitrogen</div>
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {nitrogen.toFixed(1)}
          </div>
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadge(
              statuses.nitrogen
            )}`}
          >
            {statuses.nitrogen.charAt(0).toUpperCase() +
              statuses.nitrogen.slice(1)}
          </span>
          <p className="text-xs text-gray-500 mt-2">
            Optimal: {optimalRanges.nitrogen.min}-{optimalRanges.nitrogen.max}
          </p>
        </div>

        <div className="bg-white rounded-lg p-4 border border-amber-200">
          <div className="text-sm font-medium text-gray-600 mb-2">
            Phosphorus
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {phosphorus.toFixed(1)}
          </div>
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadge(
              statuses.phosphorus
            )}`}
          >
            {statuses.phosphorus.charAt(0).toUpperCase() +
              statuses.phosphorus.slice(1)}
          </span>
          <p className="text-xs text-gray-500 mt-2">
            Optimal: {optimalRanges.phosphorus.min}-
            {optimalRanges.phosphorus.max}
          </p>
        </div>

        <div className="bg-white rounded-lg p-4 border border-purple-200">
          <div className="text-sm font-medium text-gray-600 mb-2">Potassium</div>
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {potassium.toFixed(1)}
          </div>
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadge(
              statuses.potassium
            )}`}
          >
            {statuses.potassium.charAt(0).toUpperCase() +
              statuses.potassium.slice(1)}
          </span>
          <p className="text-xs text-gray-500 mt-2">
            Optimal: {optimalRanges.potassium.min}-
            {optimalRanges.potassium.max}
          </p>
        </div>
      </div>
    </Card>
  );
}
