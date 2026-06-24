-- Create database if not exists
CREATE DATABASE IF NOT EXISTS perf_optimizer;
USE perf_optimizer;

-- Metrics table
CREATE TABLE IF NOT EXISTS metrics (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  metric_name VARCHAR(255) NOT NULL,
  metric_value DOUBLE,
  metric_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  source VARCHAR(100),
  component VARCHAR(100),
  INDEX idx_metric_timestamp (metric_timestamp),
  INDEX idx_metric_name (metric_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  alert_title VARCHAR(255) NOT NULL,
  alert_message TEXT,
  severity ENUM('info', 'warning', 'critical') DEFAULT 'info',
  status ENUM('active', 'resolved', 'acknowledged') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP NULL,
  confidence DECIMAL(5,2),
  alert_rule VARCHAR(100),
  INDEX idx_created_at (created_at),
  INDEX idx_status (status),
  INDEX idx_severity (severity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Incidents table
CREATE TABLE IF NOT EXISTS incidents (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  incident_title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('open', 'investigating', 'resolved', 'closed') DEFAULT 'open',
  severity ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  root_cause TEXT,
  resolution TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP NULL,
  jira_ticket VARCHAR(50),
  sla_minutes INT,
  mttr_minutes INT,
  INDEX idx_status (status),
  INDEX idx_severity (severity),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Predictions table
CREATE TABLE IF NOT EXISTS predictions (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  prediction_type VARCHAR(100) NOT NULL,
  failure_type VARCHAR(100),
  confidence DECIMAL(5,2),
  eta_minutes INT,
  predicted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actual_failure BOOLEAN,
  verified_at TIMESTAMP NULL,
  recommendations JSON,
  INDEX idx_predicted_at (predicted_at),
  INDEX idx_failure_type (failure_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Anomalies table
CREATE TABLE IF NOT EXISTS anomalies (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  metric_name VARCHAR(255) NOT NULL,
  metric_value DOUBLE,
  anomaly_score DECIMAL(5,2),
  affected_metrics JSON,
  detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  acknowledged BOOLEAN DEFAULT FALSE,
  INDEX idx_detected_at (detected_at),
  INDEX idx_metric_name (metric_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Query optimization suggestions table
CREATE TABLE IF NOT EXISTS query_suggestions (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  original_query TEXT NOT NULL,
  optimized_query TEXT,
  performance_score INT,
  improvement_percentage INT,
  suggested_indexes JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  applied BOOLEAN DEFAULT FALSE,
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  action VARCHAR(100) NOT NULL,
  user_id VARCHAR(100),
  resource_type VARCHAR(100),
  resource_id VARCHAR(100),
  details JSON,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45),
  INDEX idx_timestamp (timestamp),
  INDEX idx_user_id (user_id),
  INDEX idx_action (action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  role ENUM('admin', 'operator', 'viewer') DEFAULT 'viewer',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  INDEX idx_username (username),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Alert configurations table
CREATE TABLE IF NOT EXISTS alert_configs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  alert_rule_name VARCHAR(255) UNIQUE NOT NULL,
  metric_name VARCHAR(255),
  condition VARCHAR(50),
  threshold DOUBLE,
  enabled BOOLEAN DEFAULT TRUE,
  notification_channels JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_alert_rule_name (alert_rule_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Default alert rules
INSERT INTO alert_configs (alert_rule_name, metric_name, condition, threshold, notification_channels)
VALUES
  ('cpu_high', 'cpu', '>', 90, '["slack", "email"]'),
  ('memory_high', 'memory', '>', 90, '["slack", "email"]'),
  ('disk_full', 'disk', '>', 90, '["slack", "teams", "email"]'),
  ('response_time_high', 'responseTime', '>', 1000, '["slack"]'),
  ('error_rate_high', 'errorRate', '>', 5, '["slack", "pagerduty"]'),
  ('db_slow_queries', 'slowQueries', '>', 50, '["slack", "email"]');

-- Create index for better query performance
CREATE INDEX idx_metrics_composite ON metrics (metric_name, metric_timestamp, component);
CREATE INDEX idx_alerts_composite ON alerts (severity, status, created_at);
