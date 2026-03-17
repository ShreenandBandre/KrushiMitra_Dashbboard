/**
 * GET /api/alerts?farm_id=1&status=unresolved
 * Retrieves system alerts for a farm
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const farmId = searchParams.get("farm_id");
  const status = searchParams.get("status") || "all"; // all, unresolved, resolved

  if (!farmId) {
    return Response.json(
      { error: "farm_id parameter is required" },
      { status: 400 }
    );
  }

  // TODO: Query database for alerts based on status filter
  // Simulated response with mock alerts
  const mockAlerts = [
    {
      id: 1,
      farm_id: farmId,
      alert_type: "warning",
      title: "High Temperature Detected",
      description: "Current temperature is 32°C, above optimal range (22-28°C)",
      is_resolved: false,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      resolved_at: null,
    },
    {
      id: 2,
      farm_id: farmId,
      alert_type: "critical",
      title: "Low Soil Moisture",
      description: "Soil moisture at 35%, below threshold of 40%. Irrigation required.",
      is_resolved: false,
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      resolved_at: null,
    },
    {
      id: 3,
      farm_id: farmId,
      alert_type: "info",
      title: "Irrigation Completed",
      description: "Automatic irrigation completed. Soil moisture now at 58%.",
      is_resolved: true,
      created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      resolved_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    },
  ];

  const filtered =
    status === "unresolved"
      ? mockAlerts.filter((a) => !a.is_resolved)
      : status === "resolved"
        ? mockAlerts.filter((a) => a.is_resolved)
        : mockAlerts;

  return Response.json({
    success: true,
    farm_id: farmId,
    status: status,
    count: filtered.length,
    alerts: filtered,
  });
}

/**
 * POST /api/alerts/resolve
 * Marks an alert as resolved
 */
export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.alert_id) {
      return Response.json(
        { error: "alert_id is required" },
        { status: 400 }
      );
    }

    // TODO: Update alert status in database

    return Response.json({
      success: true,
      message: "Alert marked as resolved",
      alert_id: data.alert_id,
    });
  } catch (error) {
    console.error("Error resolving alert:", error);
    return Response.json(
      { error: "Failed to resolve alert" },
      { status: 500 }
    );
  }
}
