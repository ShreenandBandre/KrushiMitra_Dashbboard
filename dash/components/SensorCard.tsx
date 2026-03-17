import React from "react";
import { Card } from "@/components/ui/card";
import { Info, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";

interface SensorCardProps {
  title: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  status: "optimal" | "warning" | "critical" | "info";
  range?: {
    min: number;
    max: number;
  };
  trend?: "up" | "down" | "stable";
  lastUpdated?: Date;
}

export function SensorCard({
  title,
  value,
  unit,
  icon,
  status,
  range,
  trend,
  lastUpdated,
}: SensorCardProps) {
  // Determine status color based on sensor status
  const statusColors = {
    optimal: "bg-emerald-50 border-emerald-200 text-emerald-900",
    warning: "bg-amber-50 border-amber-200 text-amber-900",
    critical: "bg-rose-50 border-rose-200 text-rose-900",
    info: "bg-blue-50 border-blue-200 text-blue-900",
  };

  const iconColors = {
    optimal: "text-emerald-600",
    warning: "text-amber-600",
    critical: "text-rose-600",
    info: "text-blue-600",
  };

  const statusIcons = {
    optimal: <CheckCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    critical: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  const formatValue = (val: number) => {
    return val.toFixed(1);
  };

  return (
    <Card
      className={`p-6 border-2 transition-all hover:shadow-lg ${statusColors[status]}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <h3 className="text-3xl font-bold mt-2">
            {formatValue(value)}
            <span className="text-lg ml-2 opacity-75">{unit}</span>
          </h3>
        </div>
        <div className={`${iconColors[status]}`}>{icon}</div>
      </div>

      {/* Range indicator */}
      {range && (
        <div className="mb-4">
          <div className="flex justify-between text-xs opacity-75 mb-1">
            <span>Optimal: {range.min}-{range.max}{unit}</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                status === "optimal"
                  ? "bg-emerald-500"
                  : status === "warning"
                    ? "bg-amber-500"
                    : "bg-rose-500"
              }`}
              style={{
                width: `${Math.min(
                  100,
                  (value / Math.max(range.max * 1.2, value)) * 100
                )}%`,
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Footer with status and trend */}
      <div className="flex items-center justify-between text-xs opacity-75">
        <div className="flex items-center gap-1">
          {statusIcons[status]}
          <span className="capitalize">{status}</span>
        </div>
        {trend && (
          <div className="flex items-center gap-1">
            {trend === "up" && <span>📈 Rising</span>}
            {trend === "down" && <span>📉 Falling</span>}
            {trend === "stable" && <span>➡️ Stable</span>}
          </div>
        )}
      </div>

      {lastUpdated && (
        <p className="text-xs opacity-50 mt-2">
          Updated {lastUpdated.toLocaleTimeString()}
        </p>
      )}
    </Card>
  );
}
