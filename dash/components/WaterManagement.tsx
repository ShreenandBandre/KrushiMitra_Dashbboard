import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Droplet, AlertCircle, CheckCircle, Power } from "lucide-react";

interface WaterManagementProps {
  farmId: number;
  soilMoisture: number;
  waterLevel: number;
  pumpStatus: "on" | "off";
  waterUsedToday: number;
  lastIrrigationTime?: Date;
}

export function WaterManagement({
  farmId,
  soilMoisture,
  waterLevel,
  pumpStatus,
  waterUsedToday,
  lastIrrigationTime,
}: WaterManagementProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [pumpControl, setPumpControl] = useState<"on" | "off">(pumpStatus);
  const [message, setMessage] = useState("");

  // Thresholds
  const SOIL_MOISTURE_MIN = 40;
  const SOIL_MOISTURE_OPTIMAL_MAX = 65;
  const WATER_LEVEL_MIN = 300; // Liters

  const handlePumpControl = async (action: "on" | "off") => {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/irrigation/control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farm_id: farmId,
          action: action,
          reason: "manual_override",
          duration_minutes: action === "on" ? 30 : 0,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPumpControl(action);
        setMessage(`Pump turned ${action} successfully`);
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Failed to control pump");
      }
    } catch (error) {
      console.error("Error controlling pump:", error);
      setMessage("Error: Could not reach server");
    } finally {
      setIsLoading(false);
    }
  };

  const getMoistureStatus = () => {
    if (soilMoisture < SOIL_MOISTURE_MIN) return "critical";
    if (soilMoisture > SOIL_MOISTURE_OPTIMAL_MAX) return "warning";
    return "optimal";
  };

  const getWaterLevelStatus = () => {
    if (waterLevel < WATER_LEVEL_MIN) return "critical";
    if (waterLevel < WATER_LEVEL_MIN * 1.5) return "warning";
    return "optimal";
  };

  const moistureStatus = getMoistureStatus();
  const waterStatus = getWaterLevelStatus();

  const statusColors = {
    optimal: "bg-emerald-50 border-emerald-300",
    warning: "bg-amber-50 border-amber-300",
    critical: "bg-rose-50 border-rose-300",
  };

  const statusTextColors = {
    optimal: "text-emerald-700",
    warning: "text-amber-700",
    critical: "text-rose-700",
  };

  const statusIcons = {
    optimal: (
      <CheckCircle className="w-5 h-5 text-emerald-600" />
    ),
    warning: (
      <AlertCircle className="w-5 h-5 text-amber-600" />
    ),
    critical: (
      <AlertCircle className="w-5 h-5 text-rose-600" />
    ),
  };

  return (
    <Card className="p-6 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Droplet className="w-6 h-6 text-blue-600" />
          Water Management
        </h3>
        <p className="text-sm text-gray-600">
          Monitor and control irrigation automatically
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Soil Moisture */}
        <div
          className={`p-4 rounded-lg border-2 transition-all ${
            statusColors[moistureStatus]
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900">Soil Moisture</h4>
            {statusIcons[moistureStatus]}
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {soilMoisture.toFixed(1)}%
          </div>

          {/* Progress bar */}
          <div className="w-full h-3 bg-gray-300 rounded-full overflow-hidden mb-3">
            <div
              className={`h-full transition-all ${
                moistureStatus === "optimal"
                  ? "bg-emerald-500"
                  : moistureStatus === "warning"
                    ? "bg-amber-500"
                    : "bg-rose-500"
              }`}
              style={{ width: `${Math.min(100, soilMoisture)}%` }}
            ></div>
          </div>

          <div className="text-xs text-gray-600">
            <p>Min: {SOIL_MOISTURE_MIN}% | Max: {SOIL_MOISTURE_OPTIMAL_MAX}%</p>
            <p className={`font-medium mt-1 ${statusTextColors[moistureStatus]}`}>
              {moistureStatus === "critical"
                ? "⚠️ Irrigation needed!"
                : moistureStatus === "warning"
                  ? "⚠️ Monitor carefully"
                  : "✓ Optimal"}
            </p>
          </div>
        </div>

        {/* Water Level */}
        <div
          className={`p-4 rounded-lg border-2 transition-all ${
            statusColors[waterStatus]
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900">Water Tank Level</h4>
            {statusIcons[waterStatus]}
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {waterLevel.toFixed(0)} L
          </div>

          {/* Progress bar */}
          <div className="w-full h-3 bg-gray-300 rounded-full overflow-hidden mb-3">
            <div
              className={`h-full transition-all ${
                waterStatus === "optimal"
                  ? "bg-blue-500"
                  : waterStatus === "warning"
                    ? "bg-amber-500"
                    : "bg-rose-500"
              }`}
              style={{ width: `${Math.min(100, (waterLevel / 1000) * 100)}%` }}
            ></div>
          </div>

          <div className="text-xs text-gray-600">
            <p>Min threshold: {WATER_LEVEL_MIN}L</p>
            <p className={`font-medium mt-1 ${statusTextColors[waterStatus]}`}>
              {waterStatus === "critical"
                ? "⚠️ Refill needed!"
                : waterStatus === "warning"
                  ? "⚠️ Running low"
                  : "✓ Adequate"}
            </p>
          </div>
        </div>
      </div>

      {/* Water Usage Today */}
      <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Water Used Today</p>
            <p className="text-2xl font-bold text-gray-900">
              {waterUsedToday.toFixed(0)} L
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Last Irrigation</p>
            <p className="text-sm font-medium text-gray-900">
              {lastIrrigationTime
                ? lastIrrigationTime.toLocaleTimeString()
                : "No recent activity"}
            </p>
          </div>
        </div>
      </div>

      {/* Pump Control */}
      <div className="bg-gray-900 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-white flex items-center gap-2">
            <Power className="w-5 h-5" />
            Pump Control
          </h4>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              pumpControl === "on"
                ? "bg-emerald-500 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            {pumpControl.toUpperCase()}
          </div>
        </div>

        <p className="text-sm text-gray-400 mb-4">
          Manually control the irrigation pump. Auto-mode will override manual
          control if soil moisture drops below minimum.
        </p>

        <div className="flex gap-3">
          <Button
            onClick={() => handlePumpControl("on")}
            disabled={isLoading || pumpControl === "on"}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            {isLoading ? "Processing..." : "Turn On"}
          </Button>
          <Button
            onClick={() => handlePumpControl("off")}
            disabled={isLoading || pumpControl === "off"}
            variant="outline"
            className="flex-1"
          >
            {isLoading ? "Processing..." : "Turn Off"}
          </Button>
        </div>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg text-sm font-medium ${
            message.includes("successfully")
              ? "bg-emerald-100 text-emerald-800"
              : "bg-rose-100 text-rose-800"
          }`}
        >
          {message}
        </div>
      )}
    </Card>
  );
}
