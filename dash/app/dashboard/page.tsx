"use client";

import React, { useState, useEffect } from "react";
import {
  Thermometer,
  Droplets,
  Leaf,
  TrendingUp,
  RefreshCw,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SensorCard } from "@/components/SensorCard";
import { NPKCard } from "@/components/NPKCard";
import { WaterManagement } from "@/components/WaterManagement";
import { ComparativeAnalytics } from "@/components/ComparativeAnalytics";
import { AlertsPanel } from "@/components/AlertsPanel";

interface SensorReading {
  id: number;
  timestamp: string;
  temperature: number;
  humidity: number;
  soil_moisture: number;
  ph_value: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  water_level: number;
}

export default function DashboardPage() {
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [farmId] = useState(1); // Default farm ID
  const [timeRange, setTimeRange] = useState<"6h" | "24h" | "7d">("24h");

  // Fetch sensor data
  useEffect(() => {
    fetchSensorData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchSensorData, 30000);
    return () => clearInterval(interval);
  }, [farmId, timeRange]);

  const fetchSensorData = async () => {
    try {
      const hoursMap = { "6h": 6, "24h": 24, "7d": 168 };
      const response = await fetch(
        `/api/sensors/reading?farm_id=${farmId}&hours=${
          hoursMap[timeRange]
        }`
      );

      if (response.ok) {
        const data = await response.json();
        setReadings(data.readings || []);
      }
    } catch (error) {
      console.error("Error fetching sensor data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get latest reading
  const latestReading = readings.length > 0 ? readings[readings.length - 1] : null;

  // Determine sensor status based on values
  const getTemperatureStatus = (temp: number) => {
    if (temp >= 22 && temp <= 28) return "optimal";
    if (temp > 28 && temp <= 32) return "warning";
    if (temp > 32) return "critical";
    return "warning";
  };

  const getHumidityStatus = (humidity: number) => {
    if (humidity >= 40 && humidity <= 70) return "optimal";
    if (humidity >= 30 && humidity <= 80) return "warning";
    return "critical";
  };

  const getSoilMoistureStatus = (moisture: number) => {
    if (moisture >= 40 && moisture <= 65) return "optimal";
    if (moisture >= 30 && moisture <= 75) return "warning";
    return "critical";
  };

  const getWaterLevelStatus = (level: number) => {
    if (level >= 400) return "optimal";
    if (level >= 300) return "warning";
    return "critical";
  };

  const getPHStatus = (ph: number) => {
    if (ph >= 6.0 && ph <= 7.5) return "optimal";
    if (ph >= 5.5 && ph <= 8.0) return "warning";
    return "critical";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-cyan-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              KrushiMitra
            </h1>
            <p className="text-gray-600 mt-2">
              Real-time monitoring of farm conditions and automated irrigation
              control
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={fetchSensorData}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading sensor data...</p>
          </div>
        ) : !latestReading ? (
          <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
            <Leaf className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              No sensor data available. Please check your IoT device connection.
            </p>
          </div>
        ) : (
          <>
            {/* Time Range Selector */}
            <div className="mb-6 flex gap-2">
              {(["6h", "24h", "7d"] as const).map((range) => (
                <Button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  variant={timeRange === range ? "default" : "outline"}
                  size="sm"
                >
                  {range === "6h"
                    ? "Last 6 Hours"
                    : range === "24h"
                      ? "Last 24 Hours"
                      : "Last 7 Days"}
                </Button>
              ))}
            </div>

            {/* Main Sensor Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Temperature Card */}
              <SensorCard
                title="Temperature"
                value={latestReading.temperature}
                unit="°C"
                icon={<Thermometer className="w-6 h-6" />}
                status={getTemperatureStatus(latestReading.temperature)}
                range={{ min: 22, max: 28 }}
                trend={
                  readings.length > 1
                    ? readings[readings.length - 1].temperature >
                      readings[readings.length - 2].temperature
                      ? "up"
                      : "down"
                    : "stable"
                }
                lastUpdated={new Date(latestReading.timestamp)}
              />

              {/* Humidity Card */}
              <SensorCard
                title="Humidity"
                value={latestReading.humidity}
                unit="%"
                icon={<Droplets className="w-6 h-6" />}
                status={getHumidityStatus(latestReading.humidity)}
                range={{ min: 40, max: 70 }}
                trend={
                  readings.length > 1
                    ? readings[readings.length - 1].humidity >
                      readings[readings.length - 2].humidity
                      ? "up"
                      : "down"
                    : "stable"
                }
                lastUpdated={new Date(latestReading.timestamp)}
              />

              {/* Soil Moisture Card */}
              <SensorCard
                title="Soil Moisture"
                value={latestReading.soil_moisture}
                unit="%"
                icon={<Leaf className="w-6 h-6" />}
                status={getSoilMoistureStatus(latestReading.soil_moisture)}
                range={{ min: 40, max: 65 }}
                trend={
                  readings.length > 1
                    ? readings[readings.length - 1].soil_moisture >
                      readings[readings.length - 2].soil_moisture
                      ? "up"
                      : "down"
                    : "stable"
                }
                lastUpdated={new Date(latestReading.timestamp)}
              />

              {/* pH Value Card */}
              <SensorCard
                title="Soil pH"
                value={latestReading.ph_value}
                unit=""
                icon={<TrendingUp className="w-6 h-6" />}
                status={getPHStatus(latestReading.ph_value)}
                range={{ min: 6.0, max: 7.5 }}
                lastUpdated={new Date(latestReading.timestamp)}
              />
            </div>

            {/* NPK Analysis */}
            <div className="mb-8">
              <NPKCard
                nitrogen={latestReading.nitrogen}
                phosphorus={latestReading.phosphorus}
                potassium={latestReading.potassium}
              />
            </div>

            {/* Water Management & Alerts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Water Management */}
              <WaterManagement
                farmId={farmId}
                soilMoisture={latestReading.soil_moisture}
                waterLevel={latestReading.water_level}
                pumpStatus="off"
                waterUsedToday={2450}
                lastIrrigationTime={new Date(Date.now() - 2 * 60 * 60 * 1000)}
              />

              {/* Alerts Panel */}
              <AlertsPanel farmId={farmId} />
            </div>

            {/* Comparative Analytics */}
            <div className="mb-8">
              <ComparativeAnalytics
                data={readings.map((r) => ({
                  timestamp: new Date(r.timestamp).toLocaleTimeString(),
                  temperature: r.temperature,
                  humidity: r.humidity,
                  soilMoisture: r.soil_moisture,
                  waterLevel: r.water_level,
                }))}
                timeRange={timeRange}
              />
            </div>

            {/* Footer */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 text-center text-gray-600">
              <p className="text-sm">
                Last updated: {new Date(latestReading.timestamp).toLocaleString()}
              </p>
              <p className="text-xs mt-2 opacity-75">
                Data automatically refreshes every 30 seconds
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
