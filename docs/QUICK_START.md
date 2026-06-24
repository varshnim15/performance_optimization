# Quick Start Guide

## Local Development Setup

### Prerequisites
- Docker & Docker Compose (v20.10+)
- Git
- Java 17+ (for building backend)
- Python 3.10+ (for AI service development)
- Node 16+ (for frontend development)

### Step 1: Clone Repository
```bash
git clone <repo-url>
cd Performance_Optimization
```

### Step 2: Set Up Environment
```bash
# Copy example env files
cp services/backend/.env.example services/backend/.env
cp services/ai_service/.env.example services/ai_service/.env

# Update environment variables as needed
```

### Step 3: Start All Services
```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Check logs
docker-compose logs -f
```

### Step 4: Access Applications

| Service | URL | Credentials |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | - |
| Backend | http://localhost:8080 | - |
| AI Service | http://localhost:8001 | - |
| Prometheus | http://localhost:9090 | - |
| Grafana | http://localhost:3001 | admin / admin |
| AlertManager | http://localhost:9093 | - |

## Backend Development

### Building from Source
```bash
cd services/backend
mvn clean install
mvn spring-boot:run
```

### Running Tests
```bash
mvn test
```

### Building Docker Image
```bash
docker build -t perf-optimizer-backend:latest .
```

## Frontend Development

### Local Development Server
```bash
cd services/frontend
npm install
npm run dev
# Access at http://localhost:3000
```

### Building for Production
```bash
npm run build
npm start
```

## AI Service Development

### Virtual Environment
```bash
cd services/ai_service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Running Local Server
```bash
python main.py
# Access at http://localhost:8001
# Swagger UI at http://localhost:8001/docs
```

## Database Setup

### MySQL
```bash
# Connect to MySQL
docker exec -it perf-optimizer-mysql mysql -u root -p root123 perf_optimizer

# Run initial schema
mysql -u root -p root123 perf_optimizer < scripts/init-db.sql
```

### Redis
```bash
# Connect to Redis
docker exec -it perf-optimizer-redis redis-cli
```

## Monitoring

### Prometheus Queries
```promql
# CPU utilization
node_cpu_seconds_total

# Memory usage
1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)

# Disk usage
1 - (node_filesystem_avail_bytes / node_filesystem_size_bytes)

# Application response time
rate(application_request_duration_sum[5m]) / rate(application_request_count[5m])
```

### Creating a Dashboard in Grafana
1. Go to http://localhost:3001
2. Login with admin/admin
3. Click "+" → "Dashboard"
4. Add panels with Prometheus queries
5. Save dashboard

## Troubleshooting

### Services Won't Start
```bash
# Clean up previous containers
docker-compose down -v

# Rebuild images
docker-compose build --no-cache

# Start again
docker-compose up -d
```

### Database Connection Issues
```bash
# Check MySQL is running
docker ps | grep mysql

# Check database exists
docker exec perf-optimizer-mysql mysql -u root -p root123 -e "SHOW DATABASES;"
```

### AI Service Errors
```bash
# Check AI service logs
docker logs perf-optimizer-ai-service

# Verify it's running
curl http://localhost:8001/health
```

## Next Steps

1. Review ARCHITECTURE.md for system design
2. Check API_REFERENCE.md for available endpoints
3. Configure alerts in AlertManager
4. Integrate with Slack/Teams for notifications
5. Deploy to Kubernetes using manifests in infra/kubernetes/
