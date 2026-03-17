/**
 * POST /api/irrigation/control
 * Controls irrigation pump (turn on/off)
 * 
 * Expected payload:
 * {
 *   "farm_id": 1,
 *   "action": "on|off",
 *   "duration_minutes": 30,
 *   "reason": "manual_override|auto_trigger"
 * }
 */

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.farm_id || !data.action) {
      return Response.json(
        { error: "Missing required fields: farm_id or action" },
        { status: 400 }
      );
    }

    // Validate action
    if (!["on", "off"].includes(data.action)) {
      return Response.json(
        { error: "Invalid action. Must be 'on' or 'off'" },
        { status: 400 }
      );
    }

    // TODO: Send control command to Raspberry Pi relay module
    // TODO: Log irrigation event to database
    // TODO: Return status confirmation

    const event = {
      id: Math.random(),
      farm_id: data.farm_id,
      action: data.action,
      duration_minutes: data.duration_minutes || null,
      reason: data.reason || "manual",
      timestamp: new Date().toISOString(),
      status: "pending", // waiting for confirmation from device
    };

    console.log("Irrigation control command:", event);

    return Response.json(
      {
        success: true,
        message: `Pump turn ${data.action} command sent`,
        event: event,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing irrigation control:", error);
    return Response.json(
      { error: "Failed to process irrigation control" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/irrigation/status?farm_id=1
 * Gets current irrigation status
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const farmId = searchParams.get("farm_id");

  if (!farmId) {
    return Response.json(
      { error: "farm_id parameter is required" },
      { status: 400 }
    );
  }

  // TODO: Query Raspberry Pi for current relay module status
  // TODO: Get current soil moisture and irrigation history

  const mockStatus = {
    farm_id: farmId,
    pump_status: "off",
    last_active: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    soil_moisture_current: 52.4,
    soil_moisture_threshold: 45,
    water_used_today_liters: 2450,
    irrigation_events_today: 3,
  };

  return Response.json({
    success: true,
    status: mockStatus,
  });
}
