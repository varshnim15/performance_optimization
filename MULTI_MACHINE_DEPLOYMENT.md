# Multi-Machine Deployment Summary

Quick reference for deploying Performance Optimizer across multiple laptops/machines.

---

## 3-Step Quick Deploy

### Every Laptop: Install Prerequisites
```bash
# macOS
brew install --cask docker
brew install git docker-compose

# Linux
sudo apt install docker.io docker-compose git
sudo usermod -aG docker $USER

# Windows
# Download Docker Desktop: https://www.docker.com/products/docker-desktop
```

### Every Laptop: Clone & Deploy
```bash
mkdir -p ~/workspace && cd ~/workspace
git clone <repo-url> Performance_Optimization
cd Performance_Optimization
docker-compose build
docker-compose up -d
```

### Access Services
```
Frontend: http://localhost:3000
API:      http://localhost:8080/api
Grafana:  http://localhost:3001 (admin/admin)
```

---

## Scenario 1: Same Laptop (Simplest)

```bash
# Just run:
docker-compose build
docker-compose up -d

# Access:
http://localhost:3000
```

---

## Scenario 2: Multiple Laptops on Same Network

### Laptop A (Main Server):
```bash
# Get IP address
ifconfig | grep inet

# In docker-compose.yml, ensure services listen on all interfaces:
ports:
  - "0.0.0.0:3000:3000"
  - "0.0.0.0:8080:8080"
  - "0.0.0.0:3001:3001"

docker-compose up -d
```

### Laptop B, C, etc (Access Laptop A):
```bash
# Just open browser
http://laptop-a-ip:3000
http://laptop-a-ip:8080/api
http://laptop-a-ip:3001
```

---

## Scenario 3: Each Machine Runs Different Services

### Machine 1 (Database & Backend):
```bash
# docker-compose.yml - run only database services
docker-compose up -d mysql redis backend ai-service
# Note public IP: 192.168.1.100
```

### Machine 2 (Frontend):
```bash
# Edit docker-compose.yml
# Change: NEXT_PUBLIC_API_URL=http://localhost:8080
# To: NEXT_PUBLIC_API_URL=http://192.168.1.100:8080

docker-compose up -d frontend
# Access: http://localhost:3000
```

---

## Scenario 4: Distributed Kubernetes Cluster

### Install Kubernetes (All Machines):
```bash
# macOS
brew install minikube kubectl

# Linux
sudo apt install minikube kubectl

# Windows: Install Docker Desktop + enable Kubernetes
```

### Deploy:
```bash
# On any machine with cluster access
kubectl apply -f infra/kubernetes/namespace.yaml
kubectl apply -f infra/kubernetes/ -n perf-optimizer

# Check status
kubectl get pods -n perf-optimizer
```

---

## Sharing Code Between Machines

### Option 1: GitHub (Best)
```bash
# On each machine
git clone <repo-url> Performance_Optimization
cd Performance_Optimization
docker-compose build && docker-compose up -d

# To update
git pull origin main
docker-compose build
docker-compose up -d
```

### Option 2: Share ZIP File
```bash
# Machine A: Create archive
tar -czf Performance_Optimization.tar.gz Performance_Optimization/
# Share via email, Dropbox, etc.

# Machine B: Extract
tar -xzf Performance_Optimization.tar.gz
cd Performance_Optimization
docker-compose build && docker-compose up -d
```

### Option 3: Push to Docker Registry
```bash
# Machine A: Build and push
docker-compose build
docker tag perf-opt-frontend:latest myregistry/perf-opt-frontend:latest
docker push myregistry/perf-opt-frontend:latest

# Machine B: Pull and run
# Edit docker-compose.yml to use: image: myregistry/perf-opt-frontend:latest
docker-compose pull
docker-compose up -d
```

---

## Common Deployment Patterns

### Pattern A: All Services on One Machine
```
Laptop 1
├── Frontend
├── Backend
├── AI Service
├── MySQL
├── Redis
├── Prometheus
├── Grafana
└── AlertManager
```
**Best for**: Development, testing, demos

### Pattern B: Frontend + Backend Separated
```
Laptop 1                 Laptop 2
├── Frontend       ├── Backend
└── Config         ├── AI Service
                   ├── MySQL
                   ├── Redis
                   └── Monitoring Stack
```
**Best for**: Team development, separate concerns

### Pattern C: Fully Distributed
```
Laptop 1          Laptop 2          Laptop 3
├── Frontend   ├── Backend        ├── Monitoring
              ├── AI Service      ├── MySQL
              ├── Redis           └── Backups
```
**Best for**: Production, high availability

### Pattern D: Kubernetes Cluster
```
Multiple Machines → Kubernetes Cluster
├── Frontend Pod (2 replicas)
├── Backend Pod (3 replicas)
├── AI Service Pod (2 replicas)
├── MySQL StatefulSet
├── Redis Cache
└── Monitoring Stack
```
**Best for**: Enterprise, auto-scaling, orchestration

---

## Network Configuration Examples

### Local Machine Only
```bash
# Accessible only from same computer
http://localhost:3000
```

### Same Network (WiFi/Ethernet)
```bash
# Get your IP
ifconfig | grep "inet " | grep -v 127.0.0.1

# Access from another machine
http://192.168.1.100:3000  # Replace with your IP
```

### Remote Access (VPN/Firewall)
```bash
# Create SSH tunnel
ssh -L 3000:localhost:3000 user@remote-machine

# Access as if local
http://localhost:3000
```

### Public Internet (Not Recommended)
```bash
# Only if you have security (SSL, auth)
# Configure firewall
# Add SSL certificates
# Enable authentication
```

---

## Troubleshooting Across Machines

### Issue: Can't Connect to Backend from Another Machine
```bash
# Machine A (Backend): Check listening on all interfaces
docker exec perf-optimizer-backend netstat -tlnp | grep 8080

# If not found on 0.0.0.0:8080, edit docker-compose.yml:
# Change: "8080:8080"
# To:     "0.0.0.0:8080:8080"

docker-compose restart backend

# Machine B: Try connecting
curl http://machine-a-ip:8080/api/metrics/current
```

### Issue: Firewall Blocking Connection
```bash
# macOS
sudo pfctl -vnf /etc/pf.conf  # Check firewall status

# Linux
sudo ufw allow 3000   # Open port 3000
sudo ufw allow 8080
sudo ufw allow 3001
sudo ufw reload

# Windows
# Windows Defender Firewall → Allow app through → Docker
```

### Issue: DNS Not Resolving
```bash
# Test DNS resolution
nslookup machine-name
ping machine-name

# Use IP address instead
http://192.168.1.100:3000
```

---

## Data Synchronization

### Backup from Machine A, Restore on Machine B
```bash
# Machine A: Backup
docker exec perf-optimizer-mysql mysqldump -u root -proot123 \
  perf_optimizer > backup.sql
# Copy backup.sql to Machine B

# Machine B: Restore
docker-compose up -d  # Start MySQL
docker exec -i perf-optimizer-mysql mysql -u root -proot123 \
  perf_optimizer < backup.sql
```

### Real-Time Sync (via Network)
```bash
# Machine A: Export database
docker exec perf-optimizer-mysql mysqldump -u root -proot123 \
  perf_optimizer | gzip > /tmp/db.sql.gz

# Machine B: SSH in and restore
ssh user@machine-b "docker exec -i perf-optimizer-mysql mysql -u root -proot123 perf_optimizer" \
  < <(gzip -dc /tmp/db.sql.gz)
```

---

## Performance Tips for Multi-Machine Setup

1. **Use Load Balancer** for multiple backend instances
2. **Reduce Replication** on smaller machines
3. **Monitor Network Latency** between machines
4. **Cache Locally** to reduce network calls
5. **Use VPN** for remote connections

---

## Monitoring Multi-Machine Deployment

```bash
# From any machine, check all services
docker-compose ps

# View logs (needs ssh access)
ssh user@machine-a "docker-compose logs backend"

# Monitor resources across machines
# Machine A: docker stats
# Machine B: docker stats
# Compare and optimize
```

---

## Quick Command Reference

| Task | Command |
|------|---------|
| **Get machine IP** | `ifconfig \| grep inet` |
| **Get hostname** | `hostname` |
| **Test connection** | `curl http://ip:port` |
| **Check firewall** | `sudo ufw status` (Linux) |
| **Open firewall port** | `sudo ufw allow 3000` |
| **SSH to machine** | `ssh user@ip` |
| **Copy files** | `scp file user@ip:/path` |
| **Sync data** | `rsync -avz /local user@ip:/remote` |

---

## Deployment Checklist

### Before First Deploy:
- [ ] All laptops have Docker installed
- [ ] All laptops have Git installed
- [ ] Repository is accessible (GitHub, GitLab, etc.)
- [ ] All machines are on same network
- [ ] Firewall allows required ports (3000, 8080, 3001, 9090)

### After Deploy:
- [ ] Frontend accessible from all machines
- [ ] Backend API responding to requests
- [ ] Database synchronized across machines
- [ ] Monitoring dashboard visible
- [ ] Alerts working properly

### For Production:
- [ ] SSL certificates configured
- [ ] Authentication enabled
- [ ] Backups configured
- [ ] Monitoring in place
- [ ] Disaster recovery plan

---

**Quick Start**: Docker install → Git clone → `docker-compose build && docker-compose up -d` → Open http://localhost:3000

**Questions?** Check main documentation or Docker Compose logs: `docker-compose logs`

Last Updated: June 24, 2026
