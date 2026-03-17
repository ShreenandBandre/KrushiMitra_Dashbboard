import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Info,
  X,
} from "lucide-react";

interface Alert {
  id: number;
  alert_type: "critical" | "warning" | "info";
  title: string;
  description: string;
  is_resolved: boolean;
  created_at: string;
  resolved_at?: string;
}

interface AlertsPanelProps {
  farmId: number;
}

export function AlertsPanel({ farmId }: AlertsPanelProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unresolved">("unresolved");

  useEffect(() => {
    fetchAlerts();
    // Refresh alerts every 30 seconds
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, [farmId, filter]);

  const fetchAlerts = async () => {
    try {
      const response = await fetch(
        `/api/alerts?farm_id=${farmId}&status=${filter}`
      );
      if (response.ok) {
        const data = await response.json();
        setAlerts(data.alerts || []);
      }
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolveAlert = async (alertId: number) => {
    try {
      const response = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alert_id: alertId }),
      });

      if (response.ok) {
        setAlerts(alerts.filter((a) => a.id !== alertId));
      }
    } catch (error) {
      console.error("Error resolving alert:", error);
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="w-5 h-5 text-rose-600" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
    }
  };

  const getAlertStyles = (type: string) => {
    switch (type) {
      case "critical":
        return "bg-rose-50 border-rose-200";
      case "warning":
        return "bg-amber-50 border-amber-200";
      case "info":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    return date.toLocaleDateString();
  };

  return (
    <Card className="p-6 border-2 border-red-200 bg-gradient-to-br from-red-50 to-rose-50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-red-600" />
          System Alerts
        </h3>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={filter === "unresolved" ? "default" : "outline"}
            onClick={() => setFilter("unresolved")}
          >
            Active ({alerts.filter((a) => !a.is_resolved).length})
          </Button>
          <Button
            size="sm"
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            All
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading alerts...</p>
        </div>
      ) : alerts.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
          <p className="text-gray-600">
            {filter === "unresolved"
              ? "No active alerts! Everything looks good."
              : "No alerts recorded yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border-2 transition-all ${getAlertStyles(
                alert.alert_type
              )}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3 flex-1">
                  <div className="mt-0.5">
                    {getAlertIcon(alert.alert_type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900">
                        {alert.title}
                      </h4>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          alert.alert_type === "critical"
                            ? "bg-rose-200 text-rose-900"
                            : alert.alert_type === "warning"
                              ? "bg-amber-200 text-amber-900"
                              : "bg-blue-200 text-blue-900"
                        }`}
                      >
                        {alert.alert_type.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">
                      {alert.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {formatTime(alert.created_at)}
                    </p>
                  </div>
                </div>

                {!alert.is_resolved && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleResolveAlert(alert.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
