# Deployment Guide

## Overview
This guide covers deploying the Performance Optimizer across different environments.

## Local Development (Docker Compose)

```bash
# Setup
docker-compose up -d

# Verify
docker-compose ps
docker-compose logs -f

# Cleanup
docker-compose down -v
```

**Time to Deploy**: ~3-5 minutes
**Resources Required**: 8GB RAM, 10GB disk

## Kubernetes Deployment (Staging/Production)

### Prerequisites
- Kubernetes 1.28+ cluster
- kubectl configured
- Docker images pushed to registry

### Deployment Steps

```bash
# 1. Create namespace
kubectl apply -f infra/kubernetes/namespace.yaml

# 2. Create secrets
kubectl create secret generic app-secrets \
  --from-literal=db-password=YOUR_PASSWORD \
  -n perf-optimizer

# 3. Deploy services (order matters)
kubectl apply -f infra/kubernetes/mysql-deployment.yaml
sleep 30

kubectl apply -f infra/kubernetes/backend-deployment.yaml
kubectl apply -f infra/kubernetes/ai-service-deployment.yaml
kubectl apply -f infra/kubernetes/frontend-deployment.yaml
kubectl apply -f infra/kubernetes/monitoring-deployment.yaml

# 4. Verify deployment
kubectl get pods -n perf-optimizer
kubectl get svc -n perf-optimizer

# 5. Access services
kubectl port-forward svc/frontend 3000:3000 -n perf-optimizer
kubectl port-forward svc/grafana 3001:3000 -n perf-optimizer
```

**Time to Deploy**: ~15-20 minutes
**Recommended Cluster Size**: 3 nodes (t3.large or larger)

## AWS EKS Deployment

See [AWS_DEPLOYMENT.md](docs/AWS_DEPLOYMENT.md) for comprehensive AWS guide.

```bash
# Quick start
eksctl create cluster --name perf-optimizer --nodes 3 --node-type t3.large
aws eks update-kubeconfig --name perf-optimizer
kubectl apply -f infra/kubernetes/
```

## Production Checklist

- [ ] Update all environment variables and secrets
- [ ] Configure database backups (daily)
- [ ] Set up monitoring and alerting
- [ ] Configure authentication (SSO/LDAP)
- [ ] Enable encryption at rest and in transit
- [ ] Setup audit logging
- [ ] Configure auto-scaling policies
- [ ] Setup disaster recovery procedure
- [ ] Configure load balancer and CDN
- [ ] Performance test with expected load
- [ ] Document runbooks and playbooks
- [ ] Setup on-call rotation

## Scaling Considerations

### Database Scaling
- Use read replicas for read-heavy workloads
- Enable query caching with Redis
- Implement connection pooling
- Monitor slow query log

### Application Scaling
- Enable HPA with CPU/memory metrics
- Use load balancer for distributing traffic
- Implement circuit breakers
- Cache frequently accessed data

### Monitoring Scaling
- Setup long-term metrics retention (S3/Glacier)
- Implement metrics sampling for cost optimization
- Use log aggregation (ELK/Splunk)

## Troubleshooting Deployment

### Pods Not Starting
```bash
kubectl describe pod <pod-name> -n perf-optimizer
kubectl logs <pod-name> -n perf-optimizer
```

### Database Connection Issues
```bash
# Check connectivity
kubectl run -it --rm debug --image=mysql -- mysql -h mysql -u root -p
```

### Memory/CPU Issues
```bash
kubectl top nodes
kubectl top pods -n perf-optimizer
```

## Rollback Procedure

```bash
# View rollout history
kubectl rollout history deployment/backend -n perf-optimizer

# Rollback to previous version
kubectl rollout undo deployment/backend -n perf-optimizer

# Rollback to specific revision
kubectl rollout undo deployment/backend --to-revision=2 -n perf-optimizer
```

## Health Checks

```bash
# Check all services
kubectl get pods -n perf-optimizer

# Check service endpoints
kubectl get endpoints -n perf-optimizer

# Check persistent volumes
kubectl get pv,pvc -n perf-optimizer

# Check resource usage
kubectl top nodes
kubectl top pods -n perf-optimizer

# Check events
kubectl get events -n perf-optimizer --sort-by='.lastTimestamp'
```

## Performance Optimization

1. **Database**:
   - Enable query caching
   - Create appropriate indexes
   - Use connection pooling

2. **Application**:
   - Enable compression
   - Implement caching layers
   - Use async processing

3. **Frontend**:
   - Enable code splitting
   - Use CDN for assets
   - Implement lazy loading

4. **Infrastructure**:
   - Right-size instances
   - Use spot instances for non-critical workloads
   - Enable auto-scaling

## Cost Optimization

- Use reserved instances for predictable workloads
- Implement spot instances for flexible workloads
- Monitor and right-size resources
- Use S3 storage classes appropriately
- Implement resource quotas and limits
