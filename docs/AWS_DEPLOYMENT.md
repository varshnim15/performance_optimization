# AWS Deployment Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   AWS Account                        │
│  ┌────────────────┐  ┌──────────────────────────┐  │
│  │    CloudFront  │  │    VPC (Private/Public)  │  │
│  │   (CDN/WAF)    │  │  ┌────────────────────┐  │  │
│  └────────────────┘  │  │   EKS Cluster      │  │  │
│         │            │  │  ┌──────────────┐  │  │  │
│         └───────────►└──┤  │ Namespaces  │  │  │  │
│                        │  │ - Frontend  │  │  │  │
│                        │  │ - Backend   │  │  │  │
│                        │  │ - AI        │  │  │  │
│                        │  └──────────────┘  │  │  │
│                        │                    │  │  │
│                        │  RDS (MySQL)       │  │  │
│                        │  ElastiCache       │  │  │
│                        │  (Redis)           │  │  │
│                        └────────────────────┘  │  │
└─────────────────────────────────────────────────────┘
```

## Prerequisites

- AWS Account with appropriate permissions
- `aws-cli` configured with credentials
- `eksctl` installed for EKS cluster management
- `kubectl` for Kubernetes management
- Terraform (optional, for infrastructure as code)

## Step 1: Set Up VPC and Networking

```bash
# Create VPC
aws ec2 create-vpc --cidr-block 10.0.0.0/16

# Create Subnets
aws ec2 create-subnet --vpc-id vpc-xxx --cidr-block 10.0.1.0/24 --availability-zone us-east-1a
aws ec2 create-subnet --vpc-id vpc-xxx --cidr-block 10.0.2.0/24 --availability-zone us-east-1b

# Create Internet Gateway
aws ec2 create-internet-gateway
aws ec2 attach-internet-gateway --vpc-id vpc-xxx --internet-gateway-id igw-xxx

# Create Route Table
aws ec2 create-route-table --vpc-id vpc-xxx
aws ec2 create-route --route-table-id rtb-xxx \
  --destination-cidr-block 0.0.0.0/0 \
  --gateway-id igw-xxx
```

## Step 2: Create EKS Cluster

```bash
# Create cluster using eksctl
eksctl create cluster \
  --name perf-optimizer \
  --region us-east-1 \
  --nodes 3 \
  --node-type t3.large \
  --managed

# Update kubeconfig
aws eks update-kubeconfig \
  --name perf-optimizer \
  --region us-east-1
```

## Step 3: Set Up RDS MySQL

```bash
# Create RDS MySQL instance
aws rds create-db-instance \
  --db-instance-identifier perf-optimizer-mysql \
  --db-instance-class db.t3.micro \
  --engine mysql \
  --master-username admin \
  --master-user-password 'YourSecurePassword123!' \
  --allocated-storage 100 \
  --backup-retention-period 7 \
  --multi-az

# Get endpoint
aws rds describe-db-instances \
  --db-instance-identifier perf-optimizer-mysql \
  --query 'DBInstances[0].Endpoint.Address'
```

## Step 4: Set Up ElastiCache Redis

```bash
# Create Redis cluster
aws elasticache create-cache-cluster \
  --cache-cluster-id perf-optimizer-redis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --engine-version 7.0 \
  --num-cache-nodes 1

# Get endpoint
aws elasticache describe-cache-clusters \
  --cache-cluster-id perf-optimizer-redis \
  --show-cache-node-info
```

## Step 5: Create IAM Roles

```bash
# Create IAM role for EKS pods
aws iam create-role \
  --role-name perf-optimizer-pod-role \
  --assume-role-policy-document file://assume-role-policy.json

# Attach policies
aws iam attach-role-policy \
  --role-name perf-optimizer-pod-role \
  --policy-arn arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy

aws iam attach-role-policy \
  --role-name perf-optimizer-pod-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonSNSFullAccess
```

## Step 6: Create Secrets

```bash
# Create namespace
kubectl create namespace perf-optimizer

# Create secrets
kubectl create secret generic app-secrets \
  --from-literal=db-password='YourSecurePassword123!' \
  --from-literal=jwt-secret='your-jwt-secret-here' \
  -n perf-optimizer

# Create image pull secret (if using private registry)
kubectl create secret docker-registry regcred \
  --docker-server=your-registry.com \
  --docker-username=username \
  --docker-password=password \
  -n perf-optimizer
```

## Step 7: Deploy Applications

```bash
# Apply Kubernetes manifests
cd infra/kubernetes

kubectl apply -f namespace.yaml
kubectl apply -f mysql-deployment.yaml
kubectl apply -f backend-deployment.yaml
kubectl apply -f ai-service-deployment.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f monitoring-deployment.yaml

# Wait for services to be ready
kubectl get pods -n perf-optimizer -w
```

## Step 8: Configure Load Balancer

```bash
# Get ALB/NLB created by K8s
kubectl get svc -n perf-optimizer

# For Production: Configure CloudFront
aws cloudfront create-distribution \
  --origin-domain-name perf-optimizer-alb.elb.amazonaws.com \
  --origin-id myorigin
```

## Step 9: Set Up Monitoring

```bash
# Create CloudWatch Log Group
aws logs create-log-group --log-group-name /aws/perf-optimizer

# Enable container insights
aws eks update-cluster-config \
  --name perf-optimizer \
  --logging '{"clusterLogging":[{"enabled":true,"types":["api","audit","authenticator","controllerManager","scheduler"]}]}'

# Create SNS Topic for alerts
aws sns create-topic --name perf-optimizer-alerts

# Create CloudWatch Alarms
aws cloudwatch put-metric-alarm \
  --alarm-name high-cpu-usage \
  --alarm-description "Alert when CPU is high" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 70 \
  --comparison-operator GreaterThanThreshold
```

## Step 10: Configure Auto Scaling

```bash
# Update HPA (already defined in Kubernetes manifests)
kubectl autoscale deployment backend \
  --min=3 \
  --max=10 \
  --cpu-percent=70 \
  -n perf-optimizer
```

## Step 11: Setup Backup and Disaster Recovery

```bash
# Enable RDS automatic backups
aws rds modify-db-instance \
  --db-instance-identifier perf-optimizer-mysql \
  --backup-retention-period 30 \
  --apply-immediately

# Create RDS read replica for failover
aws rds create-db-instance-read-replica \
  --db-instance-identifier perf-optimizer-mysql-replica \
  --source-db-instance-identifier perf-optimizer-mysql \
  --db-instance-class db.t3.micro
```

## Cost Optimization

### Reserved Instances
```bash
aws ec2 purchase-reserved-instances \
  --instance-count 3 \
  --instance-type t3.large \
  --offering-class convertible
```

### Spot Instances (non-critical workloads)
Update backend-deployment.yaml to use spot instances

### S3 Storage Class Transition
Configure S3 lifecycle policies for backup archives

## Monitoring and Logging

### CloudWatch Dashboard
```bash
aws cloudwatch put-dashboard \
  --dashboard-name perf-optimizer \
  --dashboard-body file://dashboard-body.json
```

### CloudTrail (Audit Logging)
```bash
aws cloudtrail create-trail \
  --name perf-optimizer-trail \
  --s3-bucket-name perf-optimizer-logs

aws cloudtrail start-logging --trail-name perf-optimizer-trail
```

## Security Best Practices

1. **Network Security**:
   - Use Security Groups to restrict traffic
   - Enable VPC Flow Logs
   - Use private subnets for databases

2. **Data Encryption**:
   - Enable RDS encryption at rest
   - Use KMS for key management
   - Enable TLS 1.3 for all connections

3. **IAM Security**:
   - Use least privilege principle
   - Enable MFA for all users
   - Rotate access keys regularly

4. **Application Security**:
   - Enable WAF on CloudFront
   - Use API Gateway for rate limiting
   - Enable VPC Endpoints for private access

## Troubleshooting

### Pods Not Scheduling
```bash
kubectl describe pod <pod-name> -n perf-optimizer
kubectl logs <pod-name> -n perf-optimizer
```

### Database Connection Issues
```bash
# Check RDS security group
aws ec2 describe-security-groups --group-ids sg-xxx

# Test connectivity
kubectl run -it --rm debug --image=mysql:8.0 --restart=Never -- \
  mysql -h perf-optimizer-mysql.c123abc.us-east-1.rds.amazonaws.com -u admin -p
```

### High Costs
```bash
# Check resource utilization
kubectl top nodes
kubectl top pods -n perf-optimizer

# Review CloudWatch Insights
aws logs start-query \
  --log-group-name /aws/perf-optimizer \
  --start-time $(date -d '1 hour ago' +%s) \
  --end-time $(date +%s) \
  --query-string 'fields @timestamp, @message | stats count() by @message'
```

## Cleanup

```bash
# Delete EKS cluster
eksctl delete cluster --name perf-optimizer

# Delete RDS instance
aws rds delete-db-instance \
  --db-instance-identifier perf-optimizer-mysql \
  --skip-final-snapshot

# Delete ElastiCache cluster
aws elasticache delete-cache-cluster \
  --cache-cluster-id perf-optimizer-redis

# Delete VPC and related resources
aws ec2 delete-vpc --vpc-id vpc-xxx
```
