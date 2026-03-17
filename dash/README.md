# 🌾 Smart Agriculture IoT Dashboard

A complete real-time monitoring and automation system for smart farming. Monitor soil conditions, control irrigation, and get AI-powered insights all from one beautiful dashboard.

![Smart Agriculture Dashboard](https://img.shields.io/badge/Next.js-16-black?style=flat-square) ![React](https://img.shields.io/badge/React-19-blue?style=flat-square) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-336791?style=flat-square) ![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## ✨ Features

### 📊 Real-Time Monitoring
- **Temperature & Humidity** - DHT22 sensor integration
- **Soil Moisture** - Continuous moisture level tracking
- **NPK Analysis** - Nitrogen, Phosphorus, Potassium levels
- **Water Level** - Tank capacity monitoring
- **pH Monitoring** - Soil acidity/alkalinity tracking

### 🤖 Automated Controls
- **Smart Irrigation** - Automatic pump control based on soil moisture
- **Manual Override** - Take control when needed
- **Irrigation History** - Complete audit log of all pump operations
- **Threshold Management** - Customizable alert thresholds

### 📈 Analytics & Insights
- **Comparative Trends** - 6-hour, 24-hour, and 7-day trends
- **Temperature & Humidity Charts** - Visual trend analysis
- **Soil Moisture Trends** - Water level over time
- **AI Recommendations** - Intelligent suggestions based on conditions
- **Performance Metrics** - Historical data analysis

### 🚨 Alert System
- **Critical Alerts** - Immediate action required
- **Warning Alerts** - Monitor and prepare
- **Info Alerts** - System updates and completions
- **Alert Management** - Mark alerts as resolved

### 🔌 API Endpoints
- **Sensor Data Input** - Receive readings from IoT devices
- **Historical Data** - Query past readings
- **Pump Control** - Remote irrigation management
- **Alert System** - System notifications and events

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 12+ (or Supabase/Neon)
- Raspberry Pi (optional, for IoT integration)

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd smart-agriculture-dashboard

# 2. Install dependencies
pnpm install
# or
npm install

# 3. Set up database
psql -U postgres -d smart_agriculture -f scripts/01-init-database.sql

# 4. Start development server
pnpm dev
# or
npm run dev
```

Visit `http://localhost:3000` in your browser.

## 📚 Documentation

### Setup & Configuration
See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for:
- Database setup instructions
- API endpoint reference
- Raspberry Pi integration
- Security considerations
- Deployment options

### File Structure
```
smart-agriculture-dashboard/
├── app/
│   ├── page.tsx                    # Home page with features & setup guide
│   ├── dashboard/
│   │   └── page.tsx               # Main monitoring dashboard
│   └── api/
│       ├── sensors/
│       │   └── reading/route.ts    # Sensor data API
│       ├── irrigation/
│       │   └── control/route.ts    # Pump control API
│       └── alerts/
│           └── route.ts            # Alerts management API
├── components/
│   ├── SensorCard.tsx              # Sensor display component
│   ├── NPKCard.tsx                 # NPK analysis card
│   ├── WaterManagement.tsx         # Irrigation control card
│   ├── ComparativeAnalytics.tsx    # Trends & analytics
│   └── AlertsPanel.tsx             # System alerts display
├── scripts/
│   ├── 01-init-database.sql        # Database migration
│   └── raspberry-pi-sensor.py      # Pi sensor data sender
├── SETUP_GUIDE.md                  # Complete setup documentation
└── README.md                        # This file
```

## 🌾 Raspberry Pi Integration

### Install on Raspberry Pi

```bash
# SSH into your Raspberry Pi
ssh pi@your-raspberry-pi-ip

# Clone repository
git clone <repository-url>
cd smart-agriculture-dashboard

# Install Python dependencies
pip3 install -r requirements.txt

# Edit the script with your server URL
nano scripts/raspberry-pi-sensor.py
# Change: DASHBOARD_URL = "http://your-server-ip:3000"

# Run the sensor script
python3 scripts/raspberry-pi-sensor.py

# To run in background as a service:
sudo nano /etc/systemd/system/sensor-reader.service
# (See SETUP_GUIDE.md for service configuration)
```

### Supported Sensors

| Sensor | Type | Purpose | Pin |
|--------|------|---------|-----|
| DHT22 | Temperature/Humidity | Environmental data | GPIO 4 |
| Soil Moisture | Analog | Soil water content | ADC Ch. 0 |
| pH Sensor | Analog | Soil acidity | ADC Ch. 1 |
| Water Level | Ultrasonic | Tank level | GPIO 17 |
| Relay Module | Digital | Pump control | GPIO 27 |

## 🔌 API Examples

### Send Sensor Data
```bash
curl -X POST http://localhost:3000/api/sensors/reading \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "sensor_01",
    "farm_id": 1,
    "temperature": 28.5,
    "humidity": 65.2,
    "soil_moisture": 45.3,
    "ph_value": 6.8,
    "nitrogen": 120,
    "phosphorus": 85,
    "potassium": 95,
    "water_level": 450
  }'
```

### Get Historical Data
```bash
curl "http://localhost:3000/api/sensors/reading?farm_id=1&hours=24"
```

### Control Irrigation Pump
```bash
curl -X POST http://localhost:3000/api/irrigation/control \
  -H "Content-Type: application/json" \
  -d '{
    "farm_id": 1,
    "action": "on",
    "duration_minutes": 30,
    "reason": "manual_override"
  }'
```

### Get System Alerts
```bash
curl "http://localhost:3000/api/alerts?farm_id=1&status=unresolved"
```

## 🎨 Dashboard Components

### Sensor Cards
Display real-time sensor values with:
- Current reading and unit
- Status indicator (optimal/warning/critical)
- Optimal range visualization
- Trend indicator (↑/↓/→)
- Last update timestamp

### NPK Card
Analyze soil nutrients with:
- Bar chart comparison
- Individual status badges
- Optimal range indicators
- Deficiency/excess warnings

### Water Management
Control irrigation with:
- Soil moisture progress
- Water tank level display
- Pump control buttons
- Daily water usage tracking
- Automatic irrigation status

### Comparative Analytics
View trends with:
- Temperature & humidity chart
- Soil moisture & water level trends
- Statistical summaries
- AI-powered recommendations
- Condition-based insights

## 🔐 Security Features

### Production Recommendations

1. **Authentication**
   - Implement JWT tokens
   - Add API key validation
   - Protect sensitive endpoints

2. **Data Protection**
   - Use HTTPS only
   - Enable CORS restrictions
   - Validate all inputs

3. **Database Security**
   - Use connection pooling
   - Enable Row Level Security (RLS)
   - Regular backups

4. **Rate Limiting**
   - Prevent brute force attacks
   - Limit API requests
   - Protect against DOS

## 🧪 Testing

### Manual Testing

1. **Dashboard View**
   - Navigate to `/dashboard`
   - Check real-time data display
   - Verify charts and analytics

2. **API Testing**
   - Use cURL or Postman
   - Test sensor data submission
   - Verify data retrieval
   - Test pump controls

3. **IoT Integration**
   - Run sensor script on Raspberry Pi
   - Verify data arrival in dashboard
   - Check alert triggering

## 📊 Data Models

### Sensor Reading
```typescript
{
  id: number
  farm_id: number
  timestamp: string
  temperature: number        // °C
  humidity: number          // %
  soil_moisture: number     // %
  ph_value: number          // 0-14
  nitrogen: number          // ppm
  phosphorus: number        // ppm
  potassium: number         // ppm
  water_level: number       // liters
}
```

### Irrigation Event
```typescript
{
  id: number
  farm_id: number
  pump_status: "on" | "off"
  soil_moisture_before: number
  soil_moisture_after: number
  duration_minutes: number
  water_used_liters: number
  triggered_at: string
  completed_at: string
}
```

### Alert
```typescript
{
  id: number
  farm_id: number
  alert_type: "critical" | "warning" | "info"
  title: string
  description: string
  is_resolved: boolean
  created_at: string
  resolved_at?: string
}
```

## 🐛 Troubleshooting

### Common Issues

**Dashboard shows "No sensor data"**
- Verify API endpoints are accessible
- Check if Raspberry Pi is sending data
- Review browser console for errors

**Pump not responding**
- Verify relay module connections
- Check GPIO pin configuration
- Test relay independently

**Database connection error**
- Confirm database server is running
- Check connection credentials
- Verify network connectivity

**Sensor readings are incorrect**
- Calibrate sensors
- Check ADC settings
- Test sensors with multimeter

## 🚀 Deployment

### Deploy to Vercel
```bash
vercel
vercel env add DATABASE_URL
vercel deploy
```

### Deploy to Other Platforms
Compatible with:
- Netlify
- Railway
- Render
- AWS Lambda
- Google Cloud Run

## 📝 Environment Variables

```env
# Dashboard
NEXT_PUBLIC_API_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/smart_agriculture

# Optional Thresholds
NEXT_PUBLIC_SOIL_MOISTURE_MIN=40
NEXT_PUBLIC_SOIL_MOISTURE_MAX=65
NEXT_PUBLIC_TEMP_MIN=22
NEXT_PUBLIC_TEMP_MAX=28
```

## 📞 Support

For help:
1. Check [SETUP_GUIDE.md](./SETUP_GUIDE.md)
2. Review API documentation
3. Check browser developer console
4. Review Raspberry Pi logs

## 📄 License

MIT License - Feel free to use for personal and commercial projects.

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/) - React framework
- [Recharts](https://recharts.org/) - Data visualization
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Radix UI](https://www.radix-ui.com/) - UI components
- [shadcn/ui](https://ui.shadcn.com/) - Component library

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📧 Contact

For questions or feedback, please open an issue or contact the development team.

---

**Happy Farming! 🌾**

Made with ❤️ for sustainable agriculture
