# Smart Agriculture IoT Dashboard - Complete Setup Guide

## 📋 Project Overview

This is a complete smart agriculture monitoring system with:
- **Frontend Dashboard**: Real-time sensor data visualization
- **Backend API**: Endpoints for IoT device integration
- **Database**: PostgreSQL schema for storing sensor readings
- **Automated Controls**: Irrigation pump control and alerts
- **Analytics**: Comparative trends and AI-powered insights

---

## 🚀 Quick Start (5 minutes)

### 1. Install Dependencies
```bash
pnpm install
# or
npm install
```

### 2. Start Development Server
```bash
pnpm dev
# or
npm run dev
```

Visit: `http://localhost:3000`

### 3. View Dashboard
Navigate to: `http://localhost:3000/dashboard`

---

## 🗄️ Database Setup

### Prerequisites
- PostgreSQL 12+ installed
- Access to a database server (local or remote)

### Option A: Local PostgreSQL

```bash
# Create a new database
createdb smart_agriculture

# Run migration script
psql -U postgres -d smart_agriculture -f scripts/01-init-database.sql

# Verify tables were created
psql -U postgres -d smart_agriculture -c "\dt"
```

### Option B: Cloud Databases (Neon, Supabase, AWS RDS)

For cloud services, get your connection string and run:

```bash
# Neon example
psql "postgresql://user:password@ep-xxxxx.neon.tech/smart_agriculture" \
  -f scripts/01-init-database.sql

# Supabase example
psql "postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres" \
  -f scripts/01-init-database.sql
```

### Database Schema

The migration creates these tables:

```
├── farms               # Farm metadata
├── sensors            # Sensor device information
├── sensor_readings    # Historical sensor data
├── irrigation_events  # Pump control history
├── ml_predictions     # ML model outputs
├── alerts             # System alerts
```

---

## 🔌 API Endpoints Reference

### 1. **POST /api/sensors/reading** - Submit Sensor Data
Send real-time sensor readings from your IoT device.

**Request:**
```bash
curl -X POST http://localhost:3000/api/sensors/reading \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "sensor_01",
    "farm_id": 1,
    "sensor_type": "DHT22",
    "temperature": 28.5,
    "humidity": 65.2,
    "soil_moisture": 45.3,
    "ph_value": 6.8,
    "rainfall": 0,
    "nitrogen": 120,
    "phosphorus": 85,
    "potassium": 95,
    "water_level": 450
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Sensor reading received successfully",
  "reading_id": 12345
}
```

**Parameters:**
- `device_id` (string, required): Unique sensor identifier
- `farm_id` (integer, required): Farm ID
- `sensor_type` (string): Type of sensor (DHT22, pH, etc.)
- `temperature` (decimal): Temperature in °C
- `humidity` (decimal): Humidity in %
- `soil_moisture` (decimal): Soil moisture in %
- `ph_value` (decimal): Soil pH
- `nitrogen`, `phosphorus`, `potassium` (decimal): NPK values
- `water_level` (decimal): Water tank level in liters

---

### 2. **GET /api/sensors/reading** - Get Historical Data
Retrieve sensor readings for a specific time period.

**Request:**
```bash
curl "http://localhost:3000/api/sensors/reading?farm_id=1&hours=24"
```

**Response:**
```json
{
  "success": true,
  "farm_id": "1",
  "hours": 24,
  "count": 24,
  "readings": [
    {
      "id": 1,
      "farm_id": 1,
      "timestamp": "2024-03-17T10:00:00Z",
      "temperature": 28.5,
      "humidity": 65.2,
      "soil_moisture": 45.3,
      ...
    }
  ]
}
```

**Query Parameters:**
- `farm_id` (integer, required): Farm ID
- `hours` (integer, default: 24): How many hours back to fetch (6, 24, 168)

---

### 3. **POST /api/irrigation/control** - Control Pump
Turn irrigation pump on or off.

**Request:**
```bash
curl -X POST http://localhost:3000/api/irrigation/control \
  -H "Content-Type: application/json" \
  -d '{
    "farm_id": 1,
    "action": "on",
    "duration_minutes": 30,
    "reason": "auto_trigger"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Pump turn on command sent",
  "event": {
    "id": 999,
    "farm_id": 1,
    "action": "on",
    "duration_minutes": 30,
    "timestamp": "2024-03-17T10:30:00Z",
    "status": "pending"
  }
}
```

**Parameters:**
- `farm_id` (integer, required): Farm ID
- `action` (string, required): "on" or "off"
- `duration_minutes` (integer): How long to run (for "on" action)
- `reason` (string): "manual_override" or "auto_trigger"

---

### 4. **GET /api/irrigation/status** - Get Pump Status
Check current irrigation status.

**Request:**
```bash
curl "http://localhost:3000/api/irrigation/status?farm_id=1"
```

**Response:**
```json
{
  "success": true,
  "status": {
    "farm_id": "1",
    "pump_status": "off",
    "soil_moisture_current": 52.4,
    "soil_moisture_threshold": 45,
    "water_used_today_liters": 2450,
    "irrigation_events_today": 3
  }
}
```

---

### 5. **GET /api/alerts** - Get System Alerts
Retrieve system alerts for a farm.

**Request:**
```bash
curl "http://localhost:3000/api/alerts?farm_id=1&status=unresolved"
```

**Response:**
```json
{
  "success": true,
  "farm_id": "1",
  "status": "unresolved",
  "count": 2,
  "alerts": [
    {
      "id": 1,
      "farm_id": 1,
      "alert_type": "critical",
      "title": "Low Soil Moisture",
      "description": "Soil moisture at 35%, below threshold of 40%.",
      "is_resolved": false,
      "created_at": "2024-03-17T10:15:00Z"
    }
  ]
}
```

**Query Parameters:**
- `farm_id` (integer, required): Farm ID
- `status` (string): "all", "unresolved", or "resolved"

---

### 6. **POST /api/alerts/resolve** - Resolve Alert
Mark an alert as resolved.

**Request:**
```bash
curl -X POST http://localhost:3000/api/alerts \
  -H "Content-Type: application/json" \
  -d '{
    "alert_id": 1
  }'
```

---

## 🌾 Raspberry Pi Integration

### Python Script for Sensor Data Submission

Save as `send_sensor_data.py`:

```python
#!/usr/bin/env python3
import requests
import json
import time
from datetime import datetime
import Adafruit_DHT  # DHT22 sensor library
import board
import adafruit_ads1x15.ads1115 as ADS
from adafruit_ads1x15.analog_in import AnalogIn
import RPi.GPIO as GPIO

# Configuration
DASHBOARD_URL = "http://your-dashboard-url"  # Change this to your server
FARM_ID = 1
DEVICE_ID = "sensor_01"
POLLING_INTERVAL = 300  # 5 minutes

# Sensor pins
DHT_PIN = 4  # GPIO pin for DHT22
SOIL_MOISTURE_PIN = 0  # ADS1115 channel 0

class SensorReader:
    def __init__(self):
        # DHT22 setup
        self.dht_sensor = Adafruit_DHT.DHT22
        
        # ADS1115 setup (analog to digital converter for soil moisture)
        i2c = board.I2C()
        ads = ADS.ADS1115(i2c)
        self.soil_moisture_channel = AnalogIn(ads, ADS.P0)
    
    def read_temperature_humidity(self):
        """Read temperature and humidity from DHT22"""
        humidity, temperature = Adafruit_DHT.read_retry(
            self.dht_sensor, DHT_PIN
        )
        
        if humidity is not None and temperature is not None:
            return temperature, humidity
        return None, None
    
    def read_soil_moisture(self):
        """Read soil moisture from analog sensor"""
        # Convert voltage to percentage (0-100%)
        voltage = self.soil_moisture_channel.voltage
        moisture_percent = (voltage / 3.3) * 100
        return max(0, min(100, moisture_percent))
    
    def read_water_level(self):
        """Read water level from tank sensor"""
        # This depends on your specific sensor
        # Example: using an ultrasonic sensor
        # Return water level in liters
        return 450.0  # Placeholder
    
    def read_npk(self):
        """Read NPK values from soil sensor"""
        # This would typically come from a specialized NPK sensor
        # For now, returning sample data
        return {
            "nitrogen": 120,
            "phosphorus": 85,
            "potassium": 95
        }
    
    def read_ph(self):
        """Read soil pH"""
        # Connect a pH sensor to ADC channel
        # For now, returning sample data
        return 6.8

def send_sensor_data(reader):
    """Send all sensor data to dashboard"""
    
    # Read all sensors
    temperature, humidity = reader.read_temperature_humidity()
    soil_moisture = reader.read_soil_moisture()
    water_level = reader.read_water_level()
    npk = reader.read_npk()
    ph_value = reader.read_ph()
    
    # Prepare payload
    payload = {
        "device_id": DEVICE_ID,
        "farm_id": FARM_ID,
        "sensor_type": "DHT22",
        "temperature": round(temperature, 2) if temperature else 0,
        "humidity": round(humidity, 2) if humidity else 0,
        "soil_moisture": round(soil_moisture, 2),
        "ph_value": round(ph_value, 2),
        "rainfall": 0,  # Optional: add rain sensor
        "nitrogen": npk["nitrogen"],
        "phosphorus": npk["phosphorus"],
        "potassium": npk["potassium"],
        "water_level": round(water_level, 2)
    }
    
    # Send to dashboard
    try:
        response = requests.post(
            f"{DASHBOARD_URL}/api/sensors/reading",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if response.status_code == 201:
            print(f"[{datetime.now()}] ✓ Data sent successfully")
            print(f"  Temperature: {payload['temperature']}°C")
            print(f"  Humidity: {payload['humidity']}%")
            print(f"  Soil Moisture: {payload['soil_moisture']}%")
        else:
            print(f"[{datetime.now()}] ✗ Error: {response.status_code}")
            print(response.text)
    
    except requests.exceptions.RequestException as e:
        print(f"[{datetime.now()}] ✗ Connection error: {e}")

def main():
    """Main loop"""
    print("Starting Smart Agriculture Sensor Reader...")
    print(f"Dashboard URL: {DASHBOARD_URL}")
    print(f"Farm ID: {FARM_ID}")
    print(f"Polling interval: {POLLING_INTERVAL}s\n")
    
    reader = SensorReader()
    
    try:
        while True:
            send_sensor_data(reader)
            time.sleep(POLLING_INTERVAL)
    
    except KeyboardInterrupt:
        print("\nShutting down...")
        GPIO.cleanup()

if __name__ == "__main__":
    main()
```

### Installation on Raspberry Pi

```bash
# Install dependencies
sudo apt-get update
sudo apt-get install python3-pip python3-board

# Install Python packages
pip3 install requests Adafruit_DHT adafruit-circuitpython-ads1x15

# Make script executable
chmod +x send_sensor_data.py

# Run the script
python3 send_sensor_data.py

# Or run as a service (systemd)
sudo nano /etc/systemd/system/sensor-reader.service
```

### Systemd Service File

Create `/etc/systemd/system/sensor-reader.service`:

```ini
[Unit]
Description=Smart Agriculture Sensor Reader
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/smart-agriculture
ExecStart=/usr/bin/python3 /home/pi/smart-agriculture/send_sensor_data.py
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable sensor-reader.service
sudo systemctl start sensor-reader.service
sudo systemctl status sensor-reader.service
```

---

## 📊 Dashboard Features

### Main Dashboard (`/dashboard`)

**Real-time Sensor Cards:**
- Temperature monitoring (22-28°C optimal)
- Humidity tracking (40-70% optimal)
- Soil moisture (40-65% optimal)
- Soil pH (6.0-7.5 optimal)

**NPK Card:**
- Nitrogen levels and status
- Phosphorus levels and status
- Potassium levels and status
- Visual bar chart comparison

**Water Management:**
- Soil moisture progress indicator
- Water tank level monitoring
- Pump control (On/Off buttons)
- Water usage statistics
- Last irrigation time

**Alerts Panel:**
- Critical, warning, and info alerts
- Alert filtering and resolution
- Real-time alert updates

**Comparative Analytics:**
- 6-hour, 24-hour, and 7-day trends
- Temperature & humidity trends
- Soil moisture & water level comparison
- AI-powered insights and recommendations

---

## 🛠️ Configuration

### Environment Variables

Create `.env.local`:

```env
# Dashboard configuration
NEXT_PUBLIC_API_URL=http://localhost:3000

# Database (optional - if connecting directly)
DATABASE_URL=postgresql://user:password@localhost:5432/smart_agriculture

# Thresholds (optional customization)
NEXT_PUBLIC_SOIL_MOISTURE_MIN=40
NEXT_PUBLIC_SOIL_MOISTURE_MAX=65
NEXT_PUBLIC_TEMP_MIN=22
NEXT_PUBLIC_TEMP_MAX=28
```

---

## 🔒 Security Considerations

### For Production Deployment:

1. **API Authentication**
   - Add API keys for device authentication
   - Implement JWT tokens for dashboard access

2. **HTTPS Only**
   - Deploy with SSL certificates
   - Use environment-based URLs

3. **Database Security**
   - Use connection pooling
   - Enable Row Level Security (RLS) on Supabase
   - Regular backups

4. **Rate Limiting**
   - Implement rate limiting on API endpoints
   - Prevent spam/DOS attacks

5. **Validation**
   - Validate all incoming sensor data
   - Sanitize user inputs
   - Check data ranges

---

## 📱 API Response Examples

### Healthy System
```json
{
  "temperature": 25.3,
  "humidity": 62.1,
  "soil_moisture": 52.4,
  "ph_value": 6.8,
  "water_level": 450,
  "nitrogen": 120,
  "phosphorus": 85,
  "potassium": 95
}
```

### Requires Irrigation
```json
{
  "soil_moisture": 35.2,  // Below 40% threshold
  "alert": "Low soil moisture - irrigation recommended"
}
```

---

## 🐛 Troubleshooting

### Dashboard shows "No sensor data"
- Check if API endpoints are accessible
- Verify Raspberry Pi is sending data
- Check browser console for errors

### Pump not responding to commands
- Verify relay module GPIO pins
- Check power supply to relay
- Test relay independently

### Database connection errors
- Verify connection string
- Check database credentials
- Ensure database server is running

### Sensor readings are wrong
- Check sensor calibration
- Verify ADC settings
- Test sensors with multimeter

---

## 📚 File Structure

```
├── app/
│   ├── page.tsx                 # Home page
│   ├── dashboard/
│   │   └── page.tsx            # Main dashboard
│   └── api/
│       ├── sensors/
│       │   └── reading/route.ts # Sensor data API
│       ├── irrigation/
│       │   └── control/route.ts # Pump control API
│       └── alerts/
│           └── route.ts         # Alerts API
├── components/
│   ├── SensorCard.tsx           # Sensor display card
│   ├── NPKCard.tsx              # NPK analysis card
│   ├── WaterManagement.tsx      # Water/irrigation card
│   ├── ComparativeAnalytics.tsx # Trends & analytics
│   └── AlertsPanel.tsx          # Alerts display
├── scripts/
│   └── 01-init-database.sql     # Database migration
└── SETUP_GUIDE.md               # This file
```

---

## 🚀 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
vercel env add DATABASE_URL
```

### Deploy to Other Platforms

The code is compatible with:
- Netlify
- Railway
- Render
- AWS Lambda
- Google Cloud Run

Just ensure Node.js 18+ is installed.

---

## 📞 Support

For issues and questions:
1. Check the Troubleshooting section
2. Review API documentation above
3. Check browser console for errors
4. Verify Raspberry Pi logs

---

## 📄 License

This project is provided as-is for smart agriculture applications.

---

**Last Updated:** March 2024
**Version:** 1.0.0
