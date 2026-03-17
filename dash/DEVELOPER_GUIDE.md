# Developer Execution Guide
## Smart Agriculture IoT Dashboard

This guide will walk you through executing and deploying the Smart Agriculture Dashboard step by step.

---

## Phase 1: Initial Setup (10 minutes)

### Step 1.1: Install Node.js Dependencies
```bash
# Navigate to project directory
cd smart-agriculture-dashboard

# Install dependencies (Choose ONE)
pnpm install
# OR
npm install
# OR
yarn install

# Verify installation
npm list | head -20
```

### Step 1.2: Verify Project Structure
```bash
# Check that all files are in place
ls -la app/
ls -la components/
ls -la scripts/
ls -la api/

# Output should show:
# app/page.tsx
# app/dashboard/page.tsx
# app/api/sensors/reading/route.ts
# app/api/irrigation/control/route.ts
# app/api/alerts/route.ts
# components/SensorCard.tsx
# components/NPKCard.tsx
# components/WaterManagement.tsx
# components/ComparativeAnalytics.tsx
# components/AlertsPanel.tsx
```

---

## Phase 2: Database Setup (15 minutes)

Choose your database platform and follow the corresponding section.

### Option A: Local PostgreSQL ✅ (Recommended for Development)

#### A1: Install PostgreSQL
```bash
# macOS (with Homebrew)
brew install postgresql

# Ubuntu/Debian
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# Windows
# Download from https://www.postgresql.org/download/windows/
```

#### A2: Start PostgreSQL Service
```bash
# macOS
brew services start postgresql

# Ubuntu
sudo service postgresql start

# Windows (should start automatically)
# Or use: pg_ctl -D "C:\Program Files\PostgreSQL\16\data" start
```

#### A3: Create Database and User
```bash
# Login to PostgreSQL
psql -U postgres

# Inside psql:
CREATE DATABASE smart_agriculture;
CREATE USER farm_user WITH PASSWORD 'secure_password_123';
GRANT ALL PRIVILEGES ON DATABASE smart_agriculture TO farm_user;
\q

# Verify connection
psql -U farm_user -d smart_agriculture -h localhost
```

#### A4: Run Migration
```bash
# Execute the SQL migration
psql -U farm_user -d smart_agriculture -h localhost -f scripts/01-init-database.sql

# Verify tables were created
psql -U farm_user -d smart_agriculture -h localhost -c "\dt"

# Output should show:
# farms | table
# sensors | table
# sensor_readings | table
# irrigation_events | table
# ml_predictions | table
# alerts | table
```

### Option B: Supabase (Cloud)

#### B1: Create Supabase Project
1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in project details
4. Create project (wait 2-3 minutes)

#### B2: Get Connection Details
1. Go to Settings → Database → Connection Pooling
2. Copy connection string for Node.js
3. Save to `.env.local`:
```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]/postgres
```

#### B3: Run Migration
```bash
# Get your connection string from Supabase dashboard
psql "postgresql://postgres:[PASSWORD]@[HOST]/postgres" -f scripts/01-init-database.sql

# Or use query editor in Supabase dashboard:
# Copy entire content of scripts/01-init-database.sql
# Paste into SQL editor → Run
```

### Option C: Neon (Cloud Alternative)

#### C1: Create Neon Project
1. Go to https://console.neon.tech
2. Create project
3. Copy connection string

#### C2: Run Migration
```bash
# Get connection string from Neon dashboard
psql "[CONNECTION_STRING]" -f scripts/01-init-database.sql
```

---

## Phase 3: Development Server (5 minutes)

### Step 3.1: Configure Environment
Create `.env.local` file in project root:

```env
# Database (choose based on your setup)
# For local PostgreSQL:
DATABASE_URL=postgresql://farm_user:secure_password_123@localhost:5432/smart_agriculture

# For Supabase/Neon:
# DATABASE_URL=postgresql://user:password@host/database

# Dashboard configuration
NEXT_PUBLIC_API_URL=http://localhost:3000

# Optional: Custom thresholds
NEXT_PUBLIC_SOIL_MOISTURE_MIN=40
NEXT_PUBLIC_SOIL_MOISTURE_MAX=65
NEXT_PUBLIC_TEMP_MIN=22
NEXT_PUBLIC_TEMP_MAX=28
```

### Step 3.2: Start Development Server
```bash
# Start the dev server
pnpm dev
# OR
npm run dev

# Output should show:
# ▲ Next.js 16.1.6
# - Local:        http://localhost:3000
# - Environments: .env.local
# Ready in 2.5s
```

### Step 3.3: Test Dashboard Access
1. Open browser: http://localhost:3000
2. You should see the home page with features
3. Click "Go to Dashboard"
4. You should see: "No sensor data available"
   - This is expected - we haven't sent any data yet

---

## Phase 4: Test API Endpoints (10 minutes)

### Step 4.1: Send Sample Sensor Data

Open a new terminal (keep dev server running):

```bash
# Test 1: Send sensor reading
curl -X POST http://localhost:3000/api/sensors/reading \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "test_sensor_01",
    "farm_id": 1,
    "sensor_type": "DHT22",
    "temperature": 25.5,
    "humidity": 65.0,
    "soil_moisture": 52.3,
    "ph_value": 6.8,
    "rainfall": 0,
    "nitrogen": 120,
    "phosphorus": 85,
    "potassium": 95,
    "water_level": 450
  }'

# Expected response:
# {"success": true, "message": "Sensor reading received successfully", "reading_id": ...}
```

### Step 4.2: Retrieve Sensor Data

```bash
# Test 2: Get historical data
curl "http://localhost:3000/api/sensors/reading?farm_id=1&hours=24"

# Expected response:
# {"success": true, "farm_id": "1", "hours": 24, "count": 24, "readings": [...]}
```

### Step 4.3: Get Irrigation Status

```bash
# Test 3: Check pump status
curl "http://localhost:3000/api/irrigation/status?farm_id=1"

# Expected response:
# {"success": true, "status": {"farm_id": "1", "pump_status": "off", ...}}
```

### Step 4.4: Get Alerts

```bash
# Test 4: Get system alerts
curl "http://localhost:3000/api/alerts?farm_id=1&status=unresolved"

# Expected response:
# {"success": true, "farm_id": "1", "status": "unresolved", "count": 2, "alerts": [...]}
```

### Step 4.5: Verify Dashboard Update
1. Refresh http://localhost:3000/dashboard
2. Sensor cards should now show data
3. Charts should display readings
4. NPK card should update

---

## Phase 5: Raspberry Pi Integration (20 minutes)

### Step 5.1: Copy Script to Raspberry Pi

```bash
# From your development machine, copy the script:
scp scripts/raspberry-pi-sensor.py pi@192.168.1.100:/home/pi/

# Or if you cloned the repo on Pi:
cd smart-agriculture-dashboard
```

### Step 5.2: Install Python Dependencies on Raspberry Pi

```bash
# SSH into Raspberry Pi
ssh pi@192.168.1.100

# Install Python packages
pip3 install requests Adafruit_DHT board adafruit-circuitpython-ads1x15

# Verify installation
pip3 list | grep -E "requests|Adafruit|board"
```

### Step 5.3: Configure the Script

```bash
# Edit the script on Raspberry Pi
nano raspberry-pi-sensor.py

# Change these lines:
# DASHBOARD_URL = "http://192.168.1.50:3000"  # Your dev machine IP
# FARM_ID = 1
# DEVICE_ID = "sensor_01"
# POLLING_INTERVAL = 300  # 5 minutes

# Save: Ctrl+X → Y → Enter
```

### Step 5.4: Test Manual Execution

```bash
# Run the script manually first
python3 raspberry-pi-sensor.py

# Output should show:
# ✓ DHT22 sensor initialized
# ✓ ADS1115 ADC initialized
# ✓ Sensor Reader initialized
#
# [2024-03-17 14:30:45] ✓ Data sent successfully
#   Temperature: 25.3°C
#   Humidity: 62.1%
#   ...

# Press Ctrl+C to stop
```

### Step 5.5: Set Up Automatic Execution (Optional)

Create systemd service:

```bash
# Create service file
sudo nano /etc/systemd/system/sensor-reader.service

# Paste this content:
[Unit]
Description=Smart Agriculture Sensor Reader
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi
ExecStart=/usr/bin/python3 /home/pi/raspberry-pi-sensor.py
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target

# Save: Ctrl+X → Y → Enter

# Enable the service
sudo systemctl enable sensor-reader.service

# Start the service
sudo systemctl start sensor-reader.service

# Check status
sudo systemctl status sensor-reader.service

# View logs
sudo journalctl -u sensor-reader.service -f
```

---

## Phase 6: Testing & Validation (15 minutes)

### Step 6.1: Dashboard Visual Check

Visit http://localhost:3000/dashboard and verify:

- [ ] Sensor cards display real-time values
- [ ] Temperature card shows status (optimal/warning/critical)
- [ ] NPK card shows bar chart
- [ ] Water management card is visible
- [ ] Alerts panel displays alerts
- [ ] Charts show data trends

### Step 6.2: API Functionality Check

For each API endpoint, verify:

```bash
# Sensor data submission (verify in database)
# Command: Already tested above
psql -U farm_user -d smart_agriculture -c "SELECT * FROM sensor_readings ORDER BY recorded_at DESC LIMIT 5;"

# Pump control simulation
curl -X POST http://localhost:3000/api/irrigation/control \
  -H "Content-Type: application/json" \
  -d '{"farm_id": 1, "action": "on", "duration_minutes": 10}'

# Alert retrieval
curl "http://localhost:3000/api/alerts?farm_id=1&status=all" | jq '.'
```

### Step 6.3: Real-Time Data Flow

1. **Send data from Raspberry Pi** (or manually via curl)
2. **Observe dashboard update**
3. **Check timestamp on dashboard**
4. **Verify in database**: 
   ```bash
   psql -U farm_user -d smart_agriculture -c "SELECT temperature, soil_moisture, recorded_at FROM sensor_readings ORDER BY recorded_at DESC LIMIT 1;"
   ```

### Step 6.4: Create Test Alerts

```bash
# Manually insert a test alert
psql -U farm_user -d smart_agriculture << 'EOF'
INSERT INTO alerts (farm_id, alert_type, title, description, is_resolved)
VALUES (1, 'critical', 'Test Critical Alert', 'This is a test alert', false);
EOF

# Verify in dashboard Alerts panel
```

---

## Phase 7: Performance Optimization (10 minutes)

### Step 7.1: Enable Caching

In `.env.local`:
```env
NEXT_PUBLIC_CACHE_ENABLED=true
NEXT_PUBLIC_CACHE_TTL=30
```

### Step 7.2: Build Optimization

```bash
# Create production build
npm run build

# Check bundle size
npm run build
# Look for: "Compiled successfully"

# Run production build
npm start

# Test at http://localhost:3000
```

### Step 7.3: Database Indexing

The migration script already creates indexes. Verify:

```bash
psql -U farm_user -d smart_agriculture -c "\di"

# Should show multiple indexes on key tables
```

---

## Phase 8: Deployment (20 minutes)

### Option A: Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Add environment variables
vercel env add DATABASE_URL "your_database_connection_string"

# View deployment
# Your project will be deployed at: https://your-project.vercel.app
```

### Option B: Deploy to Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Create new project
railway init

# Deploy
railway deploy

# Set variables
railway variables set DATABASE_URL="your_connection_string"
```

### Option C: Deploy to AWS Lambda

```bash
# Install Serverless Framework
npm i -g serverless

# Configure credentials
serverless config credentials --provider aws

# Deploy
serverless deploy

# Note: May require additional configuration for file uploads
```

---

## Phase 9: Monitoring & Maintenance

### Step 9.1: Set Up Monitoring

Monitor these metrics:
- API response times
- Database query performance
- Sensor data arrival frequency
- Alert generation rate

### Step 9.2: Regular Maintenance

Daily:
- Check dashboard for alerts
- Verify sensor data is arriving
- Monitor water usage

Weekly:
- Review database size
- Check error logs
- Backup data (if using cloud, automatic)

Monthly:
- Calibrate sensors
- Update firmware if needed
- Review and optimize alerts

---

## Troubleshooting

### "No sensor data available"

```bash
# Check if data is being sent
curl -X POST http://localhost:3000/api/sensors/reading \
  -H "Content-Type: application/json" \
  -d '{"device_id": "test", "farm_id": 1, "temperature": 25, "humidity": 60, "soil_moisture": 50, "ph_value": 6.8, "nitrogen": 120, "phosphorus": 85, "potassium": 95, "water_level": 450}'

# Check dashboard data
curl "http://localhost:3000/api/sensors/reading?farm_id=1&hours=1"
```

### "Connection refused" to database

```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT version();"

# If not running:
sudo service postgresql start  # Linux
brew services start postgresql  # macOS
```

### Raspberry Pi can't reach dashboard

```bash
# From Raspberry Pi, test connection
curl http://[YOUR_MACHINE_IP]:3000

# Check if dev server is running on your machine
# Check firewall settings
# Ensure correct IP address in script
```

### Sensor data not updating dashboard

```bash
# Check browser console for errors (F12)
# Check network tab for API calls
# Verify API endpoints are working:
curl "http://localhost:3000/api/sensors/reading?farm_id=1&hours=1" | jq '.'
```

---

## Quick Reference Commands

```bash
# Development
pnpm dev              # Start dev server
npm run build        # Build for production
npm start            # Start production server

# Database
psql -U farm_user -d smart_agriculture   # Connect to database
\dt                  # List tables
\d sensor_readings   # Describe table

# Testing APIs
curl -X POST http://localhost:3000/api/sensors/reading \
  -H "Content-Type: application/json" \
  -d '{"device_id": "test", "farm_id": 1, ...}'

# Raspberry Pi
python3 raspberry-pi-sensor.py          # Run sensor script
sudo systemctl restart sensor-reader    # Restart service
journalctl -u sensor-reader -f         # View logs

# Deployment
vercel deploy       # Deploy to Vercel
railway deploy      # Deploy to Railway
```

---

## Success Checklist

- [ ] Dependencies installed
- [ ] Database created and migrated
- [ ] Development server running
- [ ] Home page loads (http://localhost:3000)
- [ ] Dashboard loads (http://localhost:3000/dashboard)
- [ ] Sensor data can be sent via API
- [ ] Data appears in dashboard
- [ ] Raspberry Pi script runs successfully
- [ ] Alerts are generated and displayed
- [ ] Pump control API works
- [ ] Charts display trends
- [ ] Project deployed to cloud platform

---

## Next Steps

1. **Customize thresholds** in components for your crops
2. **Add user authentication** for multi-user access
3. **Integrate with your ML model** for crop predictions
4. **Set up email alerts** for critical conditions
5. **Add mobile app** for remote monitoring
6. **Create admin dashboard** for system management

---

## Support & Resources

- **Documentation**: See README.md and SETUP_GUIDE.md
- **API Reference**: See SETUP_GUIDE.md for endpoint details
- **Issues**: Check troubleshooting section or open GitHub issue
- **Community**: Join agricultural tech communities for best practices

---

**Happy Farming! 🌾**

You now have a fully functional smart agriculture monitoring system!
