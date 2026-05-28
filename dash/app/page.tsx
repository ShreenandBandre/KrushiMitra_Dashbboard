"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Leaf,
  Droplet,
  Thermometer,
  Smartphone,
  Database,
  BarChart3,
  ChevronRight,
  Code,
  Zap, 
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-cyan-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Leaf className="w-8 h-8 text-emerald-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              KrushiMitra
            </h1>
          </div>
          <Link href="/dashboard">
            <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
              Go to Dashboard
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Krushi Mitra DashBoard
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Monitor your farm in real-time. Get instant insights on soil
              moisture, temperature, NPK levels, and water management. AI-powered
              recommendations for optimal crop growth.
            </p>
            <div className="flex gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                  <Zap className="w-5 h-5" />
                  View Live Dashboard
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                <Code className="w-5 h-5 mr-2" />
                API Documentation
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6 border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50">
              <Thermometer className="w-8 h-8 text-emerald-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Temperature</h3>
              <p className="text-sm text-gray-600">
                Real-time temperature monitoring with alerts
              </p>
            </Card>
            <Card className="p-6 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
              <Droplet className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">
                Soil Moisture
              </h3>
              <p className="text-sm text-gray-600">
                Automatic irrigation based on moisture levels
              </p>
            </Card>
            <Card className="p-6 border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50">
              <Leaf className="w-8 h-8 text-amber-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">NPK Analysis</h3>
              <p className="text-sm text-gray-600">
                Nitrogen, Phosphorus & Potassium tracking
              </p>
            </Card>
            <Card className="p-6 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
              <BarChart3 className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Analytics</h3>
              <p className="text-sm text-gray-600">
                Comparative trends and AI insights
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-20 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
            Key Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 border-2 border-emerald-200 hover:shadow-lg transition-shadow">
              <Smartphone className="w-8 h-8 text-emerald-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Real-Time Monitoring
              </h3>
              <p className="text-gray-600">
                Get live sensor data from your Raspberry Pi IoT devices with
                auto-refresh every 30 seconds.
              </p>
            </Card>

            <Card className="p-8 border-2 border-blue-200 hover:shadow-lg transition-shadow">
              <Database className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Data Storage & History
              </h3>
              <p className="text-gray-600">
                Complete historical data logging. Query readings from 6 hours to
                7 days for trend analysis.
              </p>
            </Card>

            <Card className="p-8 border-2 border-amber-200 hover:shadow-lg transition-shadow">
              <Zap className="w-8 h-8 text-amber-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Automated Irrigation
              </h3>
              <p className="text-gray-600">
                Automatic pump control based on soil moisture thresholds. Manual
                override available.
              </p>
            </Card>

            <Card className="p-8 border-2 border-cyan-200 hover:shadow-lg transition-shadow">
              <BarChart3 className="w-8 h-8 text-cyan-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Analytics & Insights
              </h3>
              <p className="text-gray-600">
                Beautiful charts comparing temperature, humidity, moisture, and
                water levels over time.
              </p>
            </Card>

            <Card className="p-8 border-2 border-rose-200 hover:shadow-lg transition-shadow">
              <Leaf className="w-8 h-8 text-rose-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Alerts & Notifications
              </h3>
              <p className="text-gray-600">
                Critical, warning, and info alerts for system events. Mark
                alerts as resolved.
              </p>
            </Card>

            <Card className="p-8 border-2 border-purple-200 hover:shadow-lg transition-shadow">
              <Code className="w-8 h-8 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                REST API Endpoints
              </h3>
              <p className="text-gray-600">
                Clean API endpoints for receiving IoT data, controlling pumps,
                and retrieving analytics.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Setup Guide */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-gray-900 mb-12">
          Getting Started
        </h2>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="p-8 border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              1. Connect Your IoT Device
            </h3>
            <p className="text-gray-700 mb-4">
              Your Raspberry Pi needs to send sensor data to this dashboard via
              the REST API.
            </p>
            <div className="bg-gray-900 rounded-lg p-4 text-emerald-400 font-mono text-sm overflow-x-auto mb-4">
              <pre>{`curl -X POST http://your-server/api/sensors/reading \\
  -H "Content-Type: application/json" \\
  -d '{
    "device_id": "sensor_01",
    "farm_id": 1,
    "sensor_type": "DHT22",
    "temperature": 28.5,
    "humidity": 65.2,
    "soil_moisture": 45.3,
    "ph_value": 6.8,
    "nitrogen": 120,
    "phosphorus": 85,
    "potassium": 95,
    "water_level": 450
  }'`}</pre>
            </div>
            <p className="text-sm text-gray-600">
              <strong>Note:</strong> Replace{" "}
              <code className="bg-gray-200 px-1 rounded">
                your-server
              </code>{" "}
              with your actual server URL.
            </p>
          </Card>

          <Card className="p-8 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              2. API Endpoints
            </h3>
            <div className="space-y-3 text-sm">
              <div className="bg-white rounded p-3 border border-blue-200">
                <p className="font-mono text-blue-600 font-semibold">
                  POST /api/sensors/reading
                </p>
                <p className="text-gray-600 text-xs">
                  Receive sensor data from IoT devices
                </p>
              </div>
              <div className="bg-white rounded p-3 border border-blue-200">
                <p className="font-mono text-blue-600 font-semibold">
                  GET /api/sensors/reading
                </p>
                <p className="text-gray-600 text-xs">
                  Get historical readings (farm_id, hours parameters)
                </p>
              </div>
              <div className="bg-white rounded p-3 border border-blue-200">
                <p className="font-mono text-blue-600 font-semibold">
                  POST /api/irrigation/control
                </p>
                <p className="text-gray-600 text-xs">
                  Control pump (on/off action)
                </p>
              </div>
              <div className="bg-white rounded p-3 border border-blue-200">
                <p className="font-mono text-blue-600 font-semibold">
                  GET /api/alerts
                </p>
                <p className="text-gray-600 text-xs">
                  Retrieve system alerts (farm_id, status)
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-8 border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            3. Database Setup
          </h3>
          <p className="text-gray-700 mb-4">
            Run the database migration script to set up all required tables:
          </p>
          <div className="bg-gray-900 rounded-lg p-4 text-emerald-400 font-mono text-sm overflow-x-auto">
            <pre>{`# Execute the migration script
psql -U postgres -d your_database -f scripts/01-init-database.sql

# Or if using Neon/Supabase:
psql "your_connection_string" -f scripts/01-init-database.sql`}</pre>
          </div>
        </Card>

        <Card className="p-8 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            4. Raspberry Pi Integration
          </h3>
          <p className="text-gray-700 mb-4">
            Example Python script to send sensor data from Raspberry Pi:
          </p>
          <div className="bg-gray-900 rounded-lg p-4 text-emerald-400 font-mono text-sm overflow-x-auto mb-4">
            <pre>{`import requests
import json
from datetime import datetime

# Your sensor readings
data = {
    "device_id": "sensor_01",
    "farm_id": 1,
    "sensor_type": "DHT22",
    "temperature": 28.5,
    "humidity": 65.2,
    "soil_moisture": 45.3,
    "ph_value": 6.8,
    "nitrogen": 120,
    "phosphorus": 85,
    "potassium": 95,
    "water_level": 450
}

# Send to dashboard
response = requests.post(
    'http://your-dashboard-url/api/sensors/reading',
    json=data,
    headers={'Content-Type': 'application/json'}
)

print(response.json())`}</pre>
          </div>
          <p className="text-sm text-gray-600">
            Run this script periodically (e.g., every 5 minutes via cron) to
            continuously update the dashboard.
          </p>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="bg-emerald-600 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold mb-4">Ready to Monitor Your Farm?</h2>
          <p className="text-xl text-emerald-100 mb-8">
            Start using the smart agriculture dashboard to optimize your crop
            management and water usage.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="gap-2 bg-white text-emerald-600 hover:bg-emerald-50">
              <Zap className="w-5 h-5" />
              View Dashboard
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Developers</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    API Docs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>
              &copy; 2024 SmartFarm. All rights reserved. | Smart Agriculture
              IoT Dashboard
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
