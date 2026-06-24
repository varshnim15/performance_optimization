# Deploy Performance Optimizer to Another Laptop

This comprehensive guide explains how to deploy the Performance Optimizer platform to another machine/laptop.

## Quick Start (3 Steps)

### Step 1: Install Docker
**macOS**: 
```bash
brew install --cask docker
# Or download from https://www.docker.com/products/docker-desktop
```

**Linux (Ubuntu/Debian)**:
```bash
sudo apt update && sudo apt install -y docker.io docker-compose git
sudo usermod -aG docker $USER
```

**Windows**: 
- Download Docker Desktop: https://www.docker.com/products/docker-desktop
- Run installer and restart

**Verify**:
```bash
docker --version && docker-compose --version
```

### Step 2: Clone Repository

```bash
mkdir -p ~/workspace
cd ~/workspace
git clone <your-repository-url> Performance_Optimization
cd Performance_Optimization
```

### Step 3: Deploy

```bash
# Build images (first run: 5-10 minutes)
docker-compose build

# Start all services
docker-compose up -d

# Wait 30 seconds and check
docker-compose ps

# Access dashboard
# Open http://localhost:3000 in your browser
```

---

## Prerequisites

Before deployment, ensure your laptop has:

| Requirement | Minimum | Recommended |
|------------|---------|-------------|
| **CPU Cores** | 2 | 4+ |
| **RAM** | 8GB | 16GB |
| **Disk Space** | 20GB | 50GB |
| **OS** | Windows 10, macOS 10.15+, Ubuntu 18.04+ | Latest |

---

## Installation by Operating System

### macOS Setup

```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Docker, Docker Compose, and Git
brew install --cask docker
brew install docker-compose git

# Start Docker (first time)
open /Applications/Docker.app

# Verify installation
docker --version
docker-compose --version
git --version
```

**Troubleshooting**:
- If Docker takes long to start, check System Preferences → Security & Privacy
- May need to enter password to allow Docker privilege helper

### Linux Setup (Ubuntu/Debian)

```bash
# Update package manager
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install -y docker.io docker-compose git

# Add your user to docker group (no sudo needed)
sudo usermod -aG docker $USER
newgrp docker

# Verify installation
docker --version
docker-compose --version
```

**Note**: Log out and log back in if docker commands require sudo

### Linux Setup (CentOS/RHEL)

```bash
# Install Docker and Docker Compose
sudo yum install -y docker docker-compose git

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo usermod -aG docker $USER
```

### Windows Setup

**Option A: Docker Desktop (Recommended)**
1. Download: https://www.docker.com/products/docker-desktop
2. Run installer
3. Restart computer
4. Open PowerShell and verify:
   ```powershell
   docker --version
   docker-compose --version
   ```

**Option B: Using Windows Subsystem for Linux (WSL)**
1. Install WSL2: https://docs.microsoft.com/en-us/windows/wsl/install
2. Install Ubuntu from Microsoft Store
3. Install Docker in WSL2:
   ```bash
   sudo apt update
   sudo apt install -y docker.io docker-compose git
   sudo usermod -aG docker $USER
   ```

---

## Deployment Methods

### Method 1: GitHub Clone (Recommended)

```bash
# Clone the repository
git clone <your-repository-url> Performance_Optimization
cd Performance_Optimization

# Verify project structure
ls -la
# Expected files/folders: docker-compose.yml, services/, infra/, docs/, scripts/

# Build Docker images
docker-compose build

# Start all services in background
docker-compose up -d

# Check all services are running
docker-compose ps

# Monitor startup logs
docker-compose logs -f

# (Wait 2-3 minutes for full startup)
```

### Method 2: Manual File Transfer

```bash
# If you have a ZIP or TAR file:
unzip Performance_Optimization.zip
# OR
tar -xzf Performance_Optimization.tar.gz

cd Performance_Optimization

# Proceed with build
docker-compose build
docker-compose up -d
```

### Method 3: Pre-Built Docker Images

If images are published to Docker Hub or private registry:

```bash
# Update docker-compose.yml
# Change:
# services:
#   frontend:
#     build: ./services/frontend
# To:
# services:
#   frontend:
#     image: your-registry/perf-optimizer-frontend:latest

# Pull and start
docker-compose pull
docker-compose up -d
```

---

## Access the Services

Once deployment completes (2-3 minutes), access services:

| Service | URL | Username | Password | Notes |
|---------|-----|----------|----------|-------|
| **Frontend Dashboard** | http://localhost:3000 | N/A | N/A | Main UI |
| **Backend API** | http://localhost:8080/api | N/A | N/A | REST endpoints |
| **AI Service** | http://localhost:8001 | N/A | N/A | FastAPI docs at /docs |
| **Grafana** | http://localhost:3001 | admin | admin | Monitoring dashboards |
| **Prometheus** | http://localhost:9090 | N/A | N/A | Metrics database |
| **AlertManager** | http://localhost:9093 | N/A | N/A | Alert routing |

---

## Verify Deployment

### Check Container Status

```bash
# List all running containers
docker-compose ps

# All should show "Up" status:
# NAME                    STATUS
# perf-opt-frontend       Up (healthy)
# perf-opt-backend        Up (healthy)
# perf-opt-ai-service     Up (healthy)
# perf-opt-mysql          Up (healthy)
# perf-opt-redis          Up (healthy)
# perf-opt-prometheus     Up
# perf-opt-grafana        Up
# perf-opt-alertmanager   Up
# perf-opt-node-exporter  Up
# perf-opt-blackbox       Up
```

### Test Connectivity

```bash
# Test frontend
curl http://localhost:3000 | head -20

# Test backend API
curl http://localhost:8080/api/metrics/current

# Test AI service
curl http://localhost:8001/health

# Test database
docker exec perf-optimizer-mysql mysql -u root -proot123 \
  -e "SELECT VERSION();"

# Test Redis
docker exec perf-optimizer-redis redis-cli ping
# Expected: PONG
```

### View Logs

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend

# Follow in real-time
docker-compose logs -f ai-service

# Last 100 lines
docker-compose logs --tail 100 mysql
```

---

## Configuration for Your Environment

### 1. Change Database Password

**Edit `docker-compose.yml`**:

```yaml
services:
  mysql:
    environment:
      MYSQL_ROOT_PASSWORD: your-secure-password-here
      MYSQL_PASSWORD: app-password-here
```

Then rebuild:
```bash
docker-compose down
docker-compose up -d
```

### 2. Configure Slack/Teams Alerts

**Edit `infra/monitoring/alertmanager.yml`**:

```yaml
global:
  slack_api_url: 'https://hooks.slack.com/services/YOUR/WEBHOOK/URL'

route:
  routes:
    - match:
        severity: critical
      receiver: 'slack'
```

Reload:
```bash
docker-compose restart alertmanager
```

### 3. Network Access (Multi-Machine Setup)

```bash
# Get your machine IP
ifconfig | grep "inet " | grep -v 127.0.0.1  # macOS/Linux
ipconfig  # Windows

# Edit docker-compose.yml environment variables:
NEXT_PUBLIC_API_URL: http://192.168.1.100:8080  # Replace with your IP

# Rebuild frontend
docker-compose build frontend
docker-compose up -d frontend
```

### 4. Custom Metrics Endpoints

**Edit `services/backend/src/main/resources/application.yml`**:

```yaml
metrics:
  jmx:
    enabled: true
    host: your-tomcat-server:9999
  mysql:
    enabled: true
    host: your-mysql-server:3306
```

Rebuild:
```bash
docker-compose build backend
docker-compose up -d backend
```

---

## Troubleshooting Guide

### Problem 1: "docker: command not found"

**Solution**:

macOS:
```bash
# Docker not started
open /Applications/Docker.app

# Or reinstall
brew install --cask docker
```

Linux:
```bash
# Not installed
sudo apt install docker.io docker-compose

# Verify PATH
which docker
```

### Problem 2: "Port already in use"

**Solution**:

```bash
# Find process using port 3000
lsof -i :3000          # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 <PID>

# OR use different ports
# Edit docker-compose.yml:
# "3001:3000"  instead of "3000:3000"
# "8081:8080"  instead of "8080:8080"

docker-compose up -d
```

### Problem 3: Insufficient Memory

**Solution**:

```bash
# Check current limit
docker system df

# macOS/Windows: Docker Desktop
# → Preferences → Resources → Memory
# Set to 12GB minimum

# Linux: Check available RAM
free -h

# Scale down services if needed
# Edit docker-compose.yml, reduce replicas from 3 to 1
docker-compose build
docker-compose up -d
```

### Problem 4: Services Won't Start

**Solution**:

```bash
# Check specific service logs
docker-compose logs backend
docker-compose logs mysql
docker-compose logs ai-service

# Restart service
docker-compose restart backend

# Full restart
docker-compose down
docker restart
# Wait 30 seconds
docker-compose up -d
```

### Problem 5: Database Connection Failed

**Solution**:

```bash
# Reset and reinitialize
docker-compose down -v

# Remove volumes to fresh start
docker volume prune

# Restart
docker-compose up -d

# Wait 60 seconds for MySQL to initialize
sleep 60

# Verify database
docker exec perf-optimizer-mysql mysql -u root -proot123 \
  -e "SHOW DATABASES;"
```

### Problem 6: Can't Connect to Services from Network

**Solution**:

```bash
# Check if services are listening on all interfaces
docker exec perf-optimizer-backend netstat -tlnp | grep 8080

# Edit docker-compose.yml ports:
# "0.0.0.0:8080:8080" instead of "8080:8080"

docker-compose restart backend

# Find your machine IP
hostname -I  # Linux
ifconfig | grep inet  # macOS
ipconfig     # Windows

# Access from another machine
curl http://your-machine-ip:8080/api/metrics/current
```

---

## Data Backup & Restore

### Backup Database

```bash
# Backup MySQL
docker exec perf-optimizer-mysql mysqldump -u root -proot123 \
  perf_optimizer > backup-$(date +%Y%m%d).sql

# Backup volumes
docker run --rm -v perf-optimizer_mysql_data:/data \
  -v $(pwd):/backup alpine tar czf /backup/data-backup.tar.gz /data
```

### Restore Database

```bash
# Restore from SQL backup
docker exec -i perf-optimizer-mysql mysql -u root -proot123 \
  perf_optimizer < backup-20240624.sql

# Verify restored
docker exec perf-optimizer-mysql mysql -u root -proot123 \
  perf_optimizer -e "SELECT COUNT(*) FROM metrics;"
```

---

## Keep Code Synchronized

### Using Git

```bash
# Pull latest changes
git pull origin main

# Check what changed
git diff

# Rebuild if needed
docker-compose build

# Restart services
docker-compose up -d
```

### Manual Updates

```bash
# Stop services
docker-compose down

# Copy updated files manually

# Rebuild and restart
docker-compose build
docker-compose up -d
```

---

## Performance Optimization

### Reduce Resource Usage

```bash
# Edit docker-compose.yml
# 1. Reduce replicas: change 3 to 1
# 2. Disable non-essential services:
#    - alertmanager (optional)
#    - grafana (use Prometheus instead)
#    - blackbox-exporter (optional)

# Rebuild
docker-compose build
docker-compose up -d
```

### Monitor Resource Usage

```bash
# Real-time resource consumption
docker stats

# Specific container
docker stats perf-optimizer-backend

# Save to file
docker stats > resources.txt &
```

---

## Stop and Cleanup

### Stop Services (Keep Data)

```bash
# Stop all services
docker-compose stop

# Restart later
docker-compose start

# Stop specific service
docker-compose stop backend
```

### Remove All (Delete Everything)

```bash
# Stop and remove containers, networks
docker-compose down

# Also remove volumes (deletes data)
docker-compose down -v

# Remove images
docker-compose rm -i

# System cleanup
docker system prune -a
docker volume prune
```

---

## Advanced Deployment

### Kubernetes Deployment (For Multiple Machines)

```bash
# Install minikube
brew install minikube  # macOS
sudo apt install minikube  # Linux

# Start Kubernetes
minikube start --cpus=4 --memory=8192

# Deploy
kubectl apply -f infra/kubernetes/namespace.yaml
kubectl apply -f infra/kubernetes/ -n perf-optimizer

# Check status
kubectl get pods -n perf-optimizer

# Access services
minikube service frontend -n perf-optimizer
```

### Multi-Machine Deployment

**Machine 1 (Database + Backend)**:
```bash
docker-compose up -d mysql redis backend ai-service
```

**Machine 2 (Frontend)**:
```bash
# Edit docker-compose.yml
# NEXT_PUBLIC_API_URL: http://machine1-ip:8080

docker-compose up -d frontend
```

---

## Common Commands Reference

```bash
# Build operations
docker-compose build                  # Build all images
docker-compose build backend          # Build specific service
docker-compose build --no-cache       # Force rebuild

# Start/Stop operations
docker-compose up -d                  # Start all services
docker-compose up -d backend          # Start specific service
docker-compose stop                   # Stop all services
docker-compose start                  # Resume stopped services
docker-compose restart                # Restart all services

# View operations
docker-compose ps                     # List containers and status
docker-compose logs                   # View logs
docker-compose logs -f backend        # Follow logs
docker-compose logs --tail 50 mysql   # Last 50 lines

# Access operations
docker-compose exec backend bash      # SSH into container
docker exec perf-opt-mysql mysql -u root -proot123  # DB access

# Cleanup operations
docker-compose down                   # Stop and remove containers
docker-compose down -v                # Also remove volumes (delete data)
docker system prune -a                # Remove unused images
```

---

## Network Troubleshooting

```bash
# Test service connectivity
docker exec perf-optimizer-backend \
  curl http://perf-optimizer-mysql:3306

# Check network
docker network ls
docker network inspect perf-optimizer_perf-optimizer-network

# Test DNS
docker exec perf-optimizer-backend nslookup mysql

# View container IP
docker inspect perf-optimizer-backend | grep IPAddress
```

---

## Monitoring Deployment

```bash
# Watch startup progress
watch -n 2 'docker-compose ps'

# Monitor logs in real-time
docker-compose logs -f

# Track resource usage
docker stats --no-stream

# Check disk usage
docker system df
```

---

## Deployment Checklist

Before declaring deployment complete:

- [ ] Docker installed and running
- [ ] Can run `docker --version` without errors
- [ ] Repository cloned to local machine
- [ ] All project files present
- [ ] `docker-compose build` completed successfully
- [ ] `docker-compose up -d` started all services
- [ ] All containers showing "Up" status
- [ ] Can access http://localhost:3000
- [ ] Can access http://localhost:8080/api/metrics/current
- [ ] Grafana accessible at http://localhost:3001
- [ ] Database initialized (check logs)
- [ ] Sample metrics visible in dashboard
- [ ] No errors in `docker-compose logs`

---

## Next Steps After Deployment

1. **Explore Dashboard**
   - Open http://localhost:3000
   - Check different monitoring tabs
   - Review sample metrics

2. **Access Administration**
   - Go to http://localhost:3001 (Grafana)
   - Login: admin / admin
   - Explore pre-built dashboards

3. **Configure Alerts**
   - Edit `infra/monitoring/alertmanager.yml`
   - Add Slack/Teams webhooks
   - Restart alertmanager

4. **Connect to Real Data**
   - Configure JMX monitoring for Tomcat
   - Connect to production MySQL servers
   - Add custom metrics

5. **Train ML Models**
   - Collect 30+ days of historical data
   - Fine-tune anomaly detection
   - Calibrate prediction models

---

## Support & Troubleshooting

### View Help Documentation

```bash
# Inside project directory
ls docs/
# Browse:
# - README.md (Overview)
# - QUICK_START.md (Getting started)
# - ARCHITECTURE.md (System design)
# - AWS_DEPLOYMENT.md (Cloud deployment)
```

### Get Service Logs

```bash
# Application logs
docker-compose logs backend
docker-compose logs ai-service

# System logs
docker-compose logs mysql
docker-compose logs redis

# All logs
docker-compose logs | grep ERROR
```

### Check Service Health

```bash
# API health
curl http://localhost:8080/actuator/health

# AI service
curl http://localhost:8001/health

# Database
docker exec perf-optimizer-mysql mysql -u root -proot123 -e "SELECT 1"

# Redis
docker exec perf-optimizer-redis redis-cli PING
```

---

## Final Notes

- **Initial Startup**: First run takes 5-10 minutes for image building and service initialization
- **Data Persistence**: Database data persists in Docker volumes even after containers stop
- **Resource Usage**: Platform requires ~4GB RAM when idle, ~8GB during active monitoring
- **Network**: Services communicate via Docker network; no special network config needed locally
- **Updates**: Pull latest code with `git pull` and rebuild with `docker-compose build`

---

**Last Updated**: June 24, 2026
**Platform**: Production Ready
**Support**: Check documentation in `docs/` folder
