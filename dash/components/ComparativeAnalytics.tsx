import React from "react";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Bar,
} from "recharts";

interface AnalyticsData {
  timestamp: string;
  temperature: number;
  humidity: number;
  soilMoisture: number;
  waterLevel: number;
}

interface ComparativeAnalyticsProps {
  data: AnalyticsData[];
  timeRange: "6h" | "24h" | "7d";
}

export function ComparativeAnalytics({
  data,
  timeRange,
}: ComparativeAnalyticsProps) {
  // Chart 1: Temperature & Humidity trend
  const tempHumidityChart = (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="timestamp"
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1f2937",
            border: "1px solid #4b5563",
            borderRadius: "8px",
          }}
        />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="temperature"
          stroke="#ef4444"
          name="Temperature (°C)"
          dot={false}
          strokeWidth={2}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="humidity"
          stroke="#3b82f6"
          name="Humidity (%)"
          dot={false}
          strokeWidth={2}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );

  // Chart 2: Soil Moisture & Water Level comparison
  const moistureWaterChart = (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="timestamp"
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1f2937",
            border: "1px solid #4b5563",
            borderRadius: "8px",
          }}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="soilMoisture"
          stroke="#10b981"
          fill="#d1fae5"
          name="Soil Moisture (%)"
          opacity={0.7}
        />
        <Area
          type="monotone"
          dataKey="waterLevel"
          stroke="#06b6d4"
          fill="#cffafe"
          name="Water Level (L)"
          opacity={0.6}
        />
      </AreaChart>
    </ResponsiveContainer>
  );

  // Calculate statistics
  const stats = {
    avgTemp:
      (data.reduce((sum, d) => sum + d.temperature, 0) / data.length).toFixed(
        1
      ),
    maxTemp: Math.max(...data.map((d) => d.temperature)).toFixed(1),
    minTemp: Math.min(...data.map((d) => d.temperature)).toFixed(1),
    avgMoisture:
      (data.reduce((sum, d) => sum + d.soilMoisture, 0) / data.length).toFixed(
        1
      ),
    maxMoisture: Math.max(...data.map((d) => d.soilMoisture)).toFixed(1),
    minMoisture: Math.min(...data.map((d) => d.soilMoisture)).toFixed(1),
    avgHumidity:
      (data.reduce((sum, d) => sum + d.humidity, 0) / data.length).toFixed(1),
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <Card className="p-6 border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Comparative Analytics ({timeRange})
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-red-200">
            <p className="text-xs text-gray-600 font-medium">Avg Temperature</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {stats.avgTemp}°C
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {stats.minTemp}°C - {stats.maxTemp}°C
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <p className="text-xs text-gray-600 font-medium">Avg Humidity</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {stats.avgHumidity}%
            </p>
            <p className="text-xs text-gray-500 mt-2">Relative humidity</p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-emerald-200">
            <p className="text-xs text-gray-600 font-medium">
              Avg Soil Moisture
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {stats.avgMoisture}%
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {stats.minMoisture}% - {stats.maxMoisture}%
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-cyan-200">
            <p className="text-xs text-gray-600 font-medium">Data Points</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {data.length}
            </p>
            <p className="text-xs text-gray-500 mt-2">Readings collected</p>
          </div>
        </div>
      </Card>

      {/* Temperature & Humidity Chart */}
      <Card className="p-6 border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
        <h4 className="text-lg font-bold text-gray-900 mb-4">
          Temperature & Humidity Trends
        </h4>
        {tempHumidityChart}
      </Card>

      {/* Soil Moisture & Water Level Chart */}
      <Card className="p-6 border-2 border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50">
        <h4 className="text-lg font-bold text-gray-900 mb-4">
          Soil Moisture & Water Level Trends
        </h4>
        {moistureWaterChart}
      </Card>

      {/* Insights */}
      <Card className="p-6 border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50">
        <h4 className="text-lg font-bold text-gray-900 mb-4">AI Insights</h4>

        <div className="space-y-3">
          {parseFloat(stats.avgTemp) > 28 && (
            <div className="p-3 bg-rose-100 border-l-4 border-rose-500 rounded text-rose-900 text-sm">
              🌡️ <strong>High Temperature Alert:</strong> Average temperature
              is {stats.avgTemp}°C. Consider additional watering or shade
              measures.
            </div>
          )}

          {parseFloat(stats.avgMoisture) < 40 && (
            <div className="p-3 bg-amber-100 border-l-4 border-amber-500 rounded text-amber-900 text-sm">
              💧 <strong>Low Moisture Warning:</strong> Soil moisture averaging
              {stats.avgMoisture}%. Irrigation recommended.
            </div>
          )}

          {parseFloat(stats.avgMoisture) > 70 && (
            <div className="p-3 bg-blue-100 border-l-4 border-blue-500 rounded text-blue-900 text-sm">
              💧 <strong>High Moisture Caution:</strong> Soil moisture is{" "}
              {stats.avgMoisture}%. Risk of waterlogging. Reduce irrigation.
            </div>
          )}

          {parseFloat(stats.avgHumidity) < 30 && (
            <div className="p-3 bg-rose-100 border-l-4 border-rose-500 rounded text-rose-900 text-sm">
              🌫️ <strong>Low Humidity Alert:</strong> Average humidity is{" "}
              {stats.avgHumidity}%. This may stress plants. Increase irrigation
              frequency.
            </div>
          )}

          {parseFloat(stats.avgHumidity) > 80 && (
            <div className="p-3 bg-yellow-100 border-l-4 border-yellow-500 rounded text-yellow-900 text-sm">
              🌫️ <strong>High Humidity Warning:</strong> Average humidity is{" "}
              {stats.avgHumidity}%. Risk of fungal diseases. Ensure good air
              circulation.
            </div>
          )}

          {parseFloat(stats.avgTemp) <= 28 &&
            parseFloat(stats.avgMoisture) >= 40 &&
            parseFloat(stats.avgMoisture) <= 70 &&
            parseFloat(stats.avgHumidity) >= 30 &&
            parseFloat(stats.avgHumidity) <= 80 && (
              <div className="p-3 bg-emerald-100 border-l-4 border-emerald-500 rounded text-emerald-900 text-sm">
                ✅ <strong>Optimal Conditions:</strong> All parameters are within
                optimal ranges. Crops should thrive with current conditions.
              </div>
            )}
        </div>
      </Card>
    </div>
  );
}
