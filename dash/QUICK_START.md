# Quick Start Checklist
## Smart Agriculture IoT Dashboard

Complete these steps in order. Estimated time: 30 minutes.

---

## ✅ Phase 1: Setup (5 min)

```bash
# Step 1: Install dependencies
pnpm install

# Step 2: Verify all files exist
ls app/dashboard/page.tsx
ls components/SensorCard.tsx
ls scripts/01-init-database.sql
ls scripts/raspberry-pi-sensor.py

# Files should exist without error
```

---

## ✅ Phase 2: Database (10 min)

### Quick Setup (Recommended for first-time)

```bash
# Option 1: Use mock data (NO DATABASE NEEDED)
# Just run the dev server - it uses simulated data
pnpm dev

# Then skip to Phase 3

# ---OR---

# Option 2: PostgreSQL (if you have it installed)
# Create database
createdb smart_agriculture

# Run migration
psql -U postgres -d smart_agriculture -f scripts/01-init-database.sql

# Verify
psql -U postgres -d smart_agriculture -c "\dt"
```

### Environment File

Create `.env.local`:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/smart_agriculture
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## ✅ Phase 3: Start Server (2 min)

```bash
# Terminal 1: Start dev server
pnpm dev

# Wait for "Ready in X.Xs"
# You should see:
# ▲ Next.js 16.1.6
# - Local:        http://localhost:3000
```

---

## ✅ Phase 4: Test Dashboard (5 min)

### Browser Test

1. Open http://localhost:3000
2. Click "Go to Dashboard" button
3. Should see dashboard with data

### Send Test Data (Terminal 2)

```bash
# Send sensor reading
curl -X POST http://localhost:3000/api/sensors/reading \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "test_01",
    "farm_id": 1,
    "temperature": 25.5,
    "humidity": 65.0,
    "soil_moisture": 52.0,
    "ph_value": 6.8,
    "nitrogen": 120,
    "phosphorus": 85,
    "potassium": 95,
    "water_level": 450
  }'

# Expected: {"success": true, ...}
```

### Refresh Dashboard

- Refresh http://localhost:3000/dashboard
- Should show your test data in sensor cards

---

## ✅ Phase 5: Raspberry Pi (Optional - 10 min)

### On Your Raspberry Pi

```bash
# 1. Copy sensor script to Pi
scp scripts/raspberry-pi-sensor.py pi@192.168.1.100:/home/pi/

# 2. SSH into Pi
ssh pi@192.168.1.100

# 3. Install Python packages
pip3 install requests

# 4. Edit script with your IP
nano raspberry-pi-sensor.py
# Change: DASHBOARD_URL = "http://YOUR_PC_IP:3000"
# Save: Ctrl+X → Y → Enter

# 5. Test it
python3 raspberry-pi-sensor.py

# Should show: ✓ Data sent successfully
```

---

## 🎯 Success Indicators

- [ ] Dev server running (http://localhost:3000)
- [ ] Home page loads with features
- [ ] Dashboard page loads with cards
- [ ] Can see sensor data on dashboard
- [ ] API endpoint works (curl test passed)
- [ ] Charts show data
- [ ] Alerts panel visible

---

## 📁 Files You'll Use Most

| File | Purpose | When to Edit |
|------|---------|--------------|
| `app/dashboard/page.tsx` | Main dashboard | Add features |
| `app/api/sensors/reading/route.ts` | Sensor data API | Change data format |
| `scripts/raspberry-pi-sensor.py` | IoT script | Configure for your sensors |
| `.env.local` | Configuration | Set database URL |
| `components/*.tsx` | UI components | Customize display |

---

## 🔍 Quick Diagnostics

### Check if dev server is running
```bash
curl http://localhost:3000

# Should return HTML (not error)
```

### Check if API works
```bash
curl "http://localhost:3000/api/sensors/reading?farm_id=1&hours=1"

# Should return JSON
```

### Check database
```bash
psql -U postgres -d smart_agriculture -c "SELECT COUNT(*) FROM sensor_readings;"

# Should return: count
```

---

## 📚 Full Documentation

- **SETUP_GUIDE.md** - Complete setup and API reference
- **DEVELOPER_GUIDE.md** - Step-by-step execution guide
- **README.md** - Project overview and features

---

## 🚀 Next Steps After Getting Started

1. **Connect Real Sensors** → Run raspberry-pi-sensor.py
2. **Customize Thresholds** → Edit component props
3. **Deploy to Cloud** → Use DEVELOPER_GUIDE Phase 8
4. **Add Database** → Follow DEVELOPER_GUIDE Phase 2
5. **Set Up Alerts** → Customize alert thresholds

---

## 💡 Pro Tips

- **Mock Data Mode**: Dev server works without database
- **Fast Testing**: Use curl commands to test APIs
- **Auto-Refresh**: Dashboard auto-refreshes every 30 seconds
- **Logs**: Check browser console (F12) for errors
- **Systemd Service**: Keep Raspberry Pi script running 24/7

---

## ⚠️ Common Issues

| Issue | Fix |
|-------|-----|
| "Port 3000 already in use" | `lsof -i :3000` then `kill -9 PID` |
| "No sensor data" | Send test data with curl command above |
| "Can't connect to database" | Check CONNECTION_URL in .env.local |
| "Raspberry Pi script fails" | Check DASHBOARD_URL matches your IP |

---

## ✨ You're All Set!

Your smart agriculture dashboard is ready to monitor your farm 24/7.

**Dashboard**: http://localhost:3000/dashboard
**Home Page**: http://localhost:3000

Happy farming! 🌾
