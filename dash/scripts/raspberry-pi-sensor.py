#!/usr/bin/env python3
"""
Smart Agriculture IoT Dashboard - Sensor Data Sender
Designed for Raspberry Pi with DHT22, soil moisture, and pH sensors

Install dependencies:
    pip3 install requests Adafruit_DHT board adafruit-circuitpython-ads1x15

Usage:
    python3 raspberry-pi-sensor.py
"""

import requests
import json
import time
import sys
from datetime import datetime
from typing import Dict, Tuple, Optional

# ============================================================================
# CONFIGURATION - MODIFY THESE VALUES
# ============================================================================

# Dashboard URL - Change this to your server URL
DASHBOARD_URL = "http://localhost:3000"  # Example: http://192.168.1.100:3000

# Farm and sensor identification
FARM_ID = 1
DEVICE_ID = "sensor_01"
SENSOR_TYPE = "DHT22"

# Data polling interval (seconds) - 5 minutes = 300 seconds
POLLING_INTERVAL = 300

# GPIO and sensor configuration
DHT_PIN = 4  # GPIO4 for DHT22
SOIL_MOISTURE_ADC_CHANNEL = 0  # ADS1115 channel 0
pH_ADC_CHANNEL = 1  # ADS1115 channel 1
WATER_LEVEL_PIN = 17  # GPIO17 for water level sensor (ultrasonic)

# ============================================================================
# SENSOR READER CLASS
# ============================================================================

class SensorReader:
    """Read sensor data from various sensors connected to Raspberry Pi"""

    def __init__(self):
        """Initialize sensor readers"""
        self.dht_sensor_type = None
        self.dht_pin = DHT_PIN
        self.ads = None
        self.soil_moisture_channel = None
        self.ph_channel = None

        try:
            # Try to import and initialize DHT22 sensor
            try:
                import Adafruit_DHT
                self.dht_sensor_type = Adafruit_DHT.DHT22
                print("✓ DHT22 sensor initialized")
            except ImportError:
                print("⚠ Adafruit_DHT not found, using mock data for DHT22")

            # Try to import and initialize ADS1115 ADC
            try:
                import board
                import adafruit_ads1x15.ads1115 as ADS
                from adafruit_ads1x15.analog_in import AnalogIn

                i2c = board.I2C()
                self.ads = ADS.ADS1115(i2c)
                self.soil_moisture_channel = AnalogIn(
                    self.ads, ADS.P0
                )  # Channel 0
                self.ph_channel = AnalogIn(self.ads, ADS.P1)  # Channel 1
                print("✓ ADS1115 ADC initialized")
            except ImportError:
                print("⚠ ADS1115 library not found, using mock data for analog sensors")
            except Exception as e:
                print(f"⚠ Could not initialize ADS1115: {e}")

            print("✓ Sensor Reader initialized\n")

        except Exception as e:
            print(f"Error during initialization: {e}")

    def read_temperature_humidity(self) -> Tuple[Optional[float], Optional[float]]:
        """
        Read temperature and humidity from DHT22 sensor

        Returns:
            Tuple of (temperature_celsius, humidity_percent)
        """
        try:
            if self.dht_sensor_type is None:
                # Return mock data if sensor not available
                return 25.0 + (hash(time.time()) % 5) - 2.5, 65.0 + (
                    hash(time.time()) % 20
                ) - 10

            import Adafruit_DHT

            humidity, temperature = Adafruit_DHT.read_retry(
                self.dht_sensor_type, self.dht_pin
            )

            if humidity is not None and temperature is not None:
                return temperature, humidity

            print("⚠ Failed to read from DHT22")
            return None, None

        except Exception as e:
            print(f"Error reading DHT22: {e}")
            return None, None

    def read_soil_moisture(self) -> float:
        """
        Read soil moisture from analog sensor (0-3.3V = 0-100%)

        Returns:
            Soil moisture percentage (0-100)
        """
        try:
            if self.soil_moisture_channel is None:
                # Return mock data
                return 50.0 + (hash(time.time()) % 30) - 15

            voltage = self.soil_moisture_channel.voltage
            # Calibration: 0V = 0%, 3.3V = 100%
            moisture_percent = (voltage / 3.3) * 100
            # Clamp between 0-100
            return max(0, min(100, round(moisture_percent, 2)))

        except Exception as e:
            print(f"Error reading soil moisture: {e}")
            return None

    def read_ph_value(self) -> float:
        """
        Read soil pH from analog sensor

        Returns:
            pH value (typically 0-14)
        """
        try:
            if self.ph_channel is None:
                # Return mock data
                return 6.8

            voltage = self.ph_channel.voltage
            # Calibration: typical pH sensor output
            # 0.0V = pH 0, 3.3V = pH 14
            ph_value = (voltage / 3.3) * 14.0
            return round(ph_value, 2)

        except Exception as e:
            print(f"Error reading pH: {e}")
            return None

    def read_water_level(self) -> float:
        """
        Read water tank level (ultrasonic sensor)

        Returns:
            Water level in liters
        """
        try:
            # This is a simplified version
            # For actual implementation, use a specific water level sensor
            # Example: JSN-SR04T ultrasonic sensor

            # Mock data for demonstration
            return 450.0 + (hash(time.time()) % 100) - 50

        except Exception as e:
            print(f"Error reading water level: {e}")
            return None

    def read_npk(self) -> Dict[str, float]:
        """
        Read NPK (Nitrogen, Phosphorus, Potassium) values

        For real implementation, this would typically come from:
        - Soil NPK sensor
        - Laboratory analysis
        - Historical data

        Returns:
            Dictionary with N, P, K values
        """
        try:
            # This would typically come from an NPK sensor like the DFS60
            # For now, returning calculated/mock values

            # In production, these would come from actual sensors
            nitrogen = 110.0 + (hash(time.time()) % 40) - 20
            phosphorus = 80.0 + (hash(time.time()) % 30) - 15
            potassium = 90.0 + (hash(time.time()) % 40) - 20

            return {
                "nitrogen": max(0, round(nitrogen, 1)),
                "phosphorus": max(0, round(phosphorus, 1)),
                "potassium": max(0, round(potassium, 1)),
            }

        except Exception as e:
            print(f"Error reading NPK: {e}")
            return {"nitrogen": 0, "phosphorus": 0, "potassium": 0}

    def read_rainfall(self) -> float:
        """
        Read rainfall data (optional)

        Returns:
            Rainfall in mm
        """
        try:
            # Would typically come from a rain gauge sensor
            # For this example, returning 0 (no rain)
            return 0.0
        except Exception as e:
            print(f"Error reading rainfall: {e}")
            return 0.0


# ============================================================================
# DATA SENDER
# ============================================================================


def send_sensor_data(reader: SensorReader) -> bool:
    """
    Read all sensors and send data to the dashboard

    Args:
        reader: SensorReader instance

    Returns:
        True if successful, False otherwise
    """

    try:
        # Read all sensors
        temperature, humidity = reader.read_temperature_humidity()
        soil_moisture = reader.read_soil_moisture()
        ph_value = reader.read_ph_value()
        water_level = reader.read_water_level()
        npk = reader.read_npk()
        rainfall = reader.read_rainfall()

        # Prepare payload
        payload = {
            "device_id": DEVICE_ID,
            "farm_id": FARM_ID,
            "sensor_type": SENSOR_TYPE,
            "temperature": round(temperature, 2) if temperature is not None else 0,
            "humidity": round(humidity, 2) if humidity is not None else 0,
            "soil_moisture": soil_moisture or 0,
            "ph_value": ph_value or 0,
            "rainfall": rainfall or 0,
            "nitrogen": npk.get("nitrogen", 0),
            "phosphorus": npk.get("phosphorus", 0),
            "potassium": npk.get("potassium", 0),
            "water_level": round(water_level, 2) if water_level is not None else 0,
        }

        # Send to dashboard
        response = requests.post(
            f"{DASHBOARD_URL}/api/sensors/reading",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=10,
        )

        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        if response.status_code == 201:
            print(f"[{timestamp}] ✓ Data sent successfully")
            print(f"  Temperature: {payload['temperature']}°C")
            print(f"  Humidity: {payload['humidity']}%")
            print(f"  Soil Moisture: {payload['soil_moisture']}%")
            print(f"  pH: {payload['ph_value']}")
            print(f"  NPK: N={payload['nitrogen']} P={payload['phosphorus']} K={payload['potassium']}")
            print(f"  Water Level: {payload['water_level']}L\n")
            return True
        else:
            print(f"[{timestamp}] ✗ Error: {response.status_code}")
            print(f"  Response: {response.text}\n")
            return False

    except requests.exceptions.ConnectionError:
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{timestamp}] ✗ Connection Error: Could not connect to {DASHBOARD_URL}")
        print(f"  Make sure the dashboard server is running.\n")
        return False

    except requests.exceptions.Timeout:
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{timestamp}] ✗ Timeout: Server took too long to respond\n")
        return False

    except Exception as e:
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{timestamp}] ✗ Unexpected error: {e}\n")
        return False


# ============================================================================
# MAIN LOOP
# ============================================================================


def main():
    """Main entry point"""

    print("=" * 70)
    print("Smart Agriculture IoT Dashboard - Sensor Data Sender")
    print("=" * 70)
    print(f"Dashboard URL: {DASHBOARD_URL}")
    print(f"Farm ID: {FARM_ID}")
    print(f"Device ID: {DEVICE_ID}")
    print(f"Polling Interval: {POLLING_INTERVAL} seconds ({POLLING_INTERVAL/60:.1f} minutes)")
    print("=" * 70 + "\n")

    reader = SensorReader()

    # Initial message
    print(f"Starting continuous sensor reading...\n")
    print("Press Ctrl+C to stop.\n")

    try:
        while True:
            send_sensor_data(reader)
            time.sleep(POLLING_INTERVAL)

    except KeyboardInterrupt:
        print("\n" + "=" * 70)
        print("Shutting down sensor reader...")
        print("=" * 70)
        sys.exit(0)

    except Exception as e:
        print(f"\nFatal error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
