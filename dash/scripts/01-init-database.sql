-- Create tables for Smart Agriculture IoT Dashboard
-- This script sets up the database schema for storing sensor data

-- Farms table - stores information about each farm
CREATE TABLE IF NOT EXISTS farms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  area_hectares DECIMAL(10, 2),
  farmer_name VARCHAR(255),
  phone_number VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sensors table - stores information about each sensor
CREATE TABLE IF NOT EXISTS sensors (
  id SERIAL PRIMARY KEY,
  farm_id INTEGER REFERENCES farms(id) ON DELETE CASCADE,
  sensor_type VARCHAR(100) NOT NULL, -- DHT22, Soil Moisture, pH, Rain, etc.
  location_description VARCHAR(255),
  device_id VARCHAR(100) UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sensor readings table - stores actual sensor data
CREATE TABLE IF NOT EXISTS sensor_readings (
  id SERIAL PRIMARY KEY,
  sensor_id INTEGER REFERENCES sensors(id) ON DELETE CASCADE,
  temperature DECIMAL(10, 2),
  humidity DECIMAL(10, 2),
  soil_moisture DECIMAL(10, 2),
  ph_value DECIMAL(10, 2),
  rainfall DECIMAL(10, 2),
  nitrogen DECIMAL(10, 2),
  phosphorus DECIMAL(10, 2),
  potassium DECIMAL(10, 2),
  water_level DECIMAL(10, 2),
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Irrigation history table - logs irrigation events
CREATE TABLE IF NOT EXISTS irrigation_events (
  id SERIAL PRIMARY KEY,
  farm_id INTEGER REFERENCES farms(id) ON DELETE CASCADE,
  sensor_id INTEGER REFERENCES sensors(id),
  pump_status VARCHAR(20), -- on, off
  soil_moisture_before DECIMAL(10, 2),
  soil_moisture_after DECIMAL(10, 2),
  duration_minutes INTEGER,
  water_used_liters DECIMAL(15, 2),
  triggered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

-- ML Model predictions table - stores ML model outputs
CREATE TABLE IF NOT EXISTS ml_predictions (
  id SERIAL PRIMARY KEY,
  farm_id INTEGER REFERENCES farms(id) ON DELETE CASCADE,
  sensor_reading_id INTEGER REFERENCES sensor_readings(id),
  prediction_type VARCHAR(100), -- crop_health, irrigation_need, pest_risk, etc.
  confidence_score DECIMAL(5, 4),
  predicted_value VARCHAR(255),
  recommendation VARCHAR(500),
  model_version VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Alerts table - stores system alerts
CREATE TABLE IF NOT EXISTS alerts (
  id SERIAL PRIMARY KEY,
  farm_id INTEGER REFERENCES farms(id) ON DELETE CASCADE,
  alert_type VARCHAR(100), -- critical, warning, info
  title VARCHAR(255) NOT NULL,
  description TEXT,
  is_resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_farms_id ON farms(id);
CREATE INDEX idx_sensors_farm_id ON sensors(farm_id);
CREATE INDEX idx_sensor_readings_sensor_id ON sensor_readings(sensor_id);
CREATE INDEX idx_sensor_readings_recorded_at ON sensor_readings(recorded_at);
CREATE INDEX idx_irrigation_events_farm_id ON irrigation_events(farm_id);
CREATE INDEX idx_ml_predictions_farm_id ON ml_predictions(farm_id);
CREATE INDEX idx_alerts_farm_id ON alerts(farm_id);
CREATE INDEX idx_alerts_is_resolved ON alerts(is_resolved);
