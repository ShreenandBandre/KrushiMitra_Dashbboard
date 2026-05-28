/**
 * POST /api/sensors/reading
 * Receives sensor data from IoT devices (Raspberry Pi)
 * 
 * Expected payload:
 * {
 *   "device_id": "sensor_01",
 *   "farm_id": 1,
 *   "sensor_type": "DHT22",
 *   "temperature": 28.5,
 *   "humidity": 65.2,
 *   "soil_moisture": 45.3,
 *   "ph_value": 6.8,
 *   "rainfall": 0,
 *   "nitrogen": 120,
 *   "phosphorus": 85,
 *   "potassium": 95,
 *   "water_level": 450
 * }
 */ 

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.device_id || !data.farm_id) {
      return Response.json(
        { error: "Missing required fields: device_id or farm_id" },
        { status: 400 }
      );
    }

    // TODO: Replace with actual database call
    // For now, we'll simulate storing the data
    console.log("Received sensor data:", data);

    // Simulated response
    const reading = {
      id: Math.random(),
      ...data,
      received_at: new Date().toISOString(),
    };

    // TODO: Call ML model to get predictions based on this reading
    // TODO: Check if irrigation is needed based on soil_moisture threshold
    // TODO: Store reading in database
    // TODO: Trigger alerts if thresholds are exceeded

    return Response.json(
      {
        success: true,
        message: "Sensor reading received successfully",
        reading_id: reading.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing sensor reading:", error);
    return Response.json(
      { error: "Failed to process sensor reading" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/sensors/reading?farm_id=1&hours=24
 * Retrieves sensor readings for a specific time period
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const farmId = searchParams.get("farm_id");
  const hours = parseInt(searchParams.get("hours") || "24");

  if (!farmId) {
    return Response.json(
      { error: "farm_id parameter is required" },
      { status: 400 }
    );
  }

  // TODO: Query database for readings from the past N hours
  // TODO: Return aggregated and raw sensor data

  // Simulated response with mock data
  const mockReadings = Array.from({ length: 24 }, (_, i) => ({
    id: i + 1,
    farm_id: farmId,
    timestamp: new Date(Date.now() - (24 - i) * 60 * 60 * 1000).toISOString(),
    temperature: 22 + Math.random() * 8,
    humidity: 55 + Math.random() * 20,
    soil_moisture: 40 + Math.random() * 20,
    ph_value: 6.5 + Math.random() * 1,
    nitrogen: 100 + Math.random() * 50,
    phosphorus: 70 + Math.random() * 40,
    potassium: 80 + Math.random() * 40,
    water_level: 400 + Math.random() * 100,
  }));

  return Response.json({
    success: true,
    farm_id: farmId,
    hours,
    count: mockReadings.length,
    readings: mockReadings,
  });
}
