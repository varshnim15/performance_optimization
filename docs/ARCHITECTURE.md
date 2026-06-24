# System Architecture

## Overview

The Performance Optimizer is a microservices-based platform designed to monitor, predict, and optimize performance across enterprise applications and infrastructure.

## Components

### 1. Frontend Service (Next.js)
- **Port**: 3000
- **Purpose**: Real-time monitoring dashboard
- **Technology**: React, Material UI, Recharts, WebSocket
- **Features**:
  - Executive dashboard with KPIs
  - Application, database, network, and infrastructure monitoring tabs
  - Real-time alerts with confidence scores
  - AI-driven insights panel

### 2. Backend Service (Spring Boot)
- **Port**: 8080
- **Purpose**: REST APIs and WebSocket server for metrics collection
- **Technology**: Spring Boot 3, JPA, Redis, JWT
- **Key Endpoints**:
  - GET `/api/metrics/current` - Current system metrics
  - GET `/api/metrics/jmx` - JMX metrics from Tomcat
  - GET `/api/metrics/database` - Database metrics
  - GET `/api/metrics/network` - Network metrics
  - WS `/api/ws/metrics` - WebSocket for real-time updates

### 3. AI Service (FastAPI)
- **Port**: 8001
- **Purpose**: Anomaly detection, predictive analytics, root cause analysis
- **Technology**: Python, FastAPI, scikit-learn, Prophet, XGBoost
- **Key Endpoints**:
  - POST `/detect-anomalies` - Isolation Forest anomaly detection
  - POST `/predict-failure` - Predict failures with XGBoost
  - POST `/analyze-root-cause` - AI root cause analysis
  - POST `/optimize-query` - SQL query optimization
  - WS `/ws/ai-insights` - WebSocket for AI insights

### 4. Databases
- **MySQL** (Port 3306): Primary datastore for metrics, alerts, incidents
- **Redis** (Port 6379): Caching, real-time metrics buffering

### 5. Monitoring Stack
- **Prometheus** (Port 9090): Time-series metrics collection
- **Grafana** (Port 3001): Visualization dashboards
- **AlertManager** (Port 9093): Alert aggregation and routing
- **Node Exporter** (Port 9100): System metrics collection
- **JMX Exporter**: Tomcat metrics collection
- **Blackbox Exporter** (Port 9115): Endpoint availability monitoring

## Data Flow

### Metrics Collection
```
[Tomcat/App] --JMX--> [JMX Exporter] --Scrape--> [Prometheus]
[Node] --Node Exporter--> [Prometheus]
[Backends] --Actuator--> [Prometheus]
```

### Real-Time Updates
```
[Prometheus] --> [Backend Service] --> [Frontend] (WebSocket)
                        |
                    [Redis Cache]
```

### AI Analysis
```
[Metrics] --> [Backend] --> [AI Service] (FastAPI)
                                |
                        [Anomaly Detection]
                        [Prediction Engine]
                        [Root Cause Analysis]
                        [Query Optimizer]
```

## Database Schema

### Key Tables
- `metrics`: Raw metrics data
- `alerts`: Alert history and configurations
- `incidents`: Incident tracking and management
- `audit_logs`: Audit trail for compliance
- `predictions`: Predictive analytics results
- `anomalies`: Detected anomalies

## Security Architecture

- **Authentication**: JWT tokens issued by backend
- **Authorization**: RBAC with role-based access control
- **Encryption**: TLS 1.3 for transport, AES-256 for sensitive data
- **Secrets Management**: Environment variables for sensitive data
- **Audit Logging**: All API actions logged with timestamps and user info

## Deployment Architecture

### Docker Compose (Development)
- Single-machine deployment
- All services in containers
- Shared network for inter-service communication

### Kubernetes (Production)
- Multi-node cluster with high availability
- Horizontal Pod Autoscaling (HPA) for backend and AI service
- StatefulSet for databases
- Persistent volumes for data
- NetworkPolicies for network segmentation

## Scalability

- **Horizontal**: Services scale independently based on CPU/memory metrics
- **Vertical**: Resource limits prevent resource exhaustion
- **Database**: Read replicas for read-heavy workloads
- **Cache**: Redis cluster for distributed caching

## Reliability

- **Health Checks**: Liveness and readiness probes on all services
- **Retry Logic**: Exponential backoff for failed API calls
- **Circuit Breaker**: Prevent cascading failures
- **Dead Letter Queue**: For failed message processing

## Disaster Recovery

- **Backup Strategy**: Daily automated MySQL backups
- **Replication**: MySQL replication for failover
- **Multi-Region**: Support for multi-region deployment
- **RTO/RPO**: < 1 hour RTO, < 15 minutes RPO
