# GameAI Production Kubernetes Deployment

This directory contains production-ready Kubernetes configurations for the GameAI microservices application, following industry best practices for security, reliability, and observability.

## 🚀 Quick Start

### Prerequisites

- Kubernetes cluster (v1.25+)
- kubectl configured with production cluster access
- cert-manager installed (for TLS certificates)
- NGINX Ingress Controller
- Prometheus/Grafana (optional, for monitoring)

### Deployment

1. **Review and update secrets:**
   ```powershell
   # Edit secrets.yaml with your actual base64-encoded secrets
   notepad secrets.yaml
   ```

2. **Update configuration:**
   ```powershell
   # Update domains in ingress.yaml
   # Update email in ingress.yaml for Let's Encrypt
   # Review resource limits in deployment files
   ```

3. **Deploy to production:**
   ```powershell
   .\scripts\deploy-production.ps1
   ```

4. **Monitor deployment:**
   ```powershell
   .\scripts\monitor-production.ps1 -Watch -Detailed
   ```

## 📁 File Structure

```
k8s-prod/
├── namespace.yaml              # Namespace with resource quotas and limits
├── secrets.yaml               # Application secrets (update before deployment)
├── configmap.yaml             # Application configuration
├── rbac.yaml                  # Service account and RBAC permissions
├── gateway-deployment.yaml    # API Gateway deployment with HPA and PDB
├── conversation-deployment.yaml # Conversation service deployment
├── project-deployment.yaml   # Project service deployment
- ├── postgres.yaml            # PostgreSQL deployment configuration
- ├── rabbitmq.yaml            # RabbitMQ deployment configuration
├── ingress.yaml              # Ingress with TLS, security headers, and rate limiting
├── network-policies.yaml     # Network security policies
├── monitoring.yaml           # Prometheus monitoring configuration
└── security-baseline.yaml    # Security compliance testing
```

## 🔒 Security Features

### Pod Security Standards
- **Non-root execution**: All containers run as non-root user (UID 1001)
- **Read-only filesystem**: Containers use read-only root filesystem
- **No privilege escalation**: `allowPrivilegeEscalation: false`
- **Dropped capabilities**: All Linux capabilities dropped
- **Seccomp profile**: Runtime default seccomp profile enforced

### Network Security
- **Network policies**: Restricted ingress/egress traffic
- **TLS termination**: HTTPS with Let's Encrypt certificates
- **Security headers**: HSTS, CSP, X-Frame-Options, etc.
- **Rate limiting**: 100 requests per minute per IP

### RBAC
- **Minimal permissions**: Service accounts with least-privilege access
- **No token mounting**: `automountServiceAccountToken: false`
- **Namespace isolation**: Resources isolated to production namespace

### Secrets Management
- **Kubernetes secrets**: Sensitive data stored in secrets
- **Registry credentials**: Private registry authentication
- **Environment separation**: Production-specific configuration

## 🏗️ Architecture Overview

```
Internet
    ↓
[Load Balancer]
    ↓
[NGINX Ingress] ← TLS termination, rate limiting, security headers
    ↓
[API Gateway] ← Authentication, routing, monitoring
    ↓
[Microservices] ← Conversation API, Project API
    ↓
[Databases] ← External databases (not included)
```

## 📊 Monitoring & Observability

### Health Checks
- **Liveness probes**: Detect and restart unhealthy containers
- **Readiness probes**: Control traffic routing to healthy pods
- **Startup probes**: Handle slow-starting applications

### Metrics
- **Prometheus metrics**: Application and infrastructure metrics
- **Service monitors**: Automatic metric discovery
- **Alert rules**: Production-ready alerting

### Logging
- **Structured logging**: JSON log format
- **Log aggregation**: ELK/Fluentd integration ready
- **Application insights**: Distributed tracing support

## 🔧 Resource Management

### Resource Allocation
```yaml
requests:
  cpu: "200m"
  memory: "256Mi"
  ephemeral-storage: "1Gi"
limits:
  cpu: "1000m"
  memory: "512Mi"
  ephemeral-storage: "2Gi"
```

### Auto-scaling
- **HPA**: CPU and memory-based horizontal scaling (3-10 replicas)
- **PDB**: Ensure minimum availability during updates
- **Rolling updates**: Zero-downtime deployments

### Storage
- **Ephemeral storage**: Temporary files in emptyDir volumes
- **Read-only filesystem**: Enhanced security posture
- **Size limits**: Prevent disk space exhaustion

## 🚦 Deployment Strategy

### Rolling Updates
- **Max unavailable**: 1 pod
- **Max surge**: 1 pod
- **Graceful termination**: 30-second grace period

### Anti-affinity
- **Pod anti-affinity**: Distribute pods across nodes
- **Topology spread**: Even distribution across zones

## 📋 Pre-deployment Checklist

- [ ] Update secrets in `secrets.yaml`
- [ ] Configure domains in `ingress.yaml`
- [ ] Set email for Let's Encrypt in `ingress.yaml`
- [ ] Review resource limits for your cluster
- [ ] Ensure cert-manager is installed
- [ ] Verify NGINX Ingress Controller is running
- [ ] Configure external database connections
- [ ] Set up monitoring infrastructure
- [ ] Configure backup procedures
- [ ] Test disaster recovery procedures

## 🔍 Troubleshooting

### Common Commands
```powershell
# Check deployment status
kubectl get all -n gameai-prod

# View pod logs
kubectl logs -f deployment/gateway-api -n gameai-prod

# Describe failed pods
kubectl describe pod -l app.kubernetes.io/name=gateway-api -n gameai-prod

# Check ingress status
kubectl describe ingress gameai-ingress -n gameai-prod

# View events
kubectl get events -n gameai-prod --sort-by='.lastTimestamp'

# Check certificate status
kubectl get certificates -n gameai-prod

# Test network policies
kubectl exec -it test-pod -n gameai-prod -- nc -v service-name port
```

### Health Check Endpoints
- Gateway API: `http://gateway-api:5000/health`
- Conversation API: `http://conversation-api:5002/health`
- Project API: `http://project-api:5001/health`

### Log Analysis
```powershell
# Search for errors in logs
kubectl logs deployment/gateway-api -n gameai-prod | Select-String "ERROR"

# Follow logs for all services
kubectl logs -f deployment/gateway-api -n gameai-prod &
kubectl logs -f deployment/conversation-api -n gameai-prod &
kubectl logs -f deployment/project-api -n gameai-prod
```

## 🔄 Maintenance

### Regular Tasks
- Monitor resource usage and adjust limits
- Review security alerts and update images
- Test backup and restore procedures
- Update TLS certificates (automated with cert-manager)
- Review and rotate secrets

### Scaling
```powershell
# Manual scaling
kubectl scale deployment/gateway-api --replicas=5 -n gameai-prod

# Check HPA status
kubectl get hpa -n gameai-prod

# Update HPA targets
kubectl patch hpa gateway-api-hpa -n gameai-prod -p '{"spec":{"maxReplicas":15}}'
```

### Updates
```powershell
# Rolling update with new image
kubectl set image deployment/gateway-api gateway-api=genwatt/gateway-api:v1.1.0 -n gameai-prod

# Check rollout status
kubectl rollout status deployment/gateway-api -n gameai-prod

# Rollback if needed
kubectl rollout undo deployment/gateway-api -n gameai-prod
```

## 📞 Support

For production issues:
1. Check the monitoring dashboards
2. Review recent events and logs
3. Verify resource availability
4. Check external dependencies
5. Escalate to on-call engineer if needed

## 🔐 Security Compliance

This deployment follows:
- CIS Kubernetes Benchmark
- NIST Cybersecurity Framework
- OWASP Top 10
- Pod Security Standards (Restricted)
- Network segmentation best practices

## 📈 Performance Optimization

- JIT compilation optimized for production
- Connection pooling and keep-alive
- Gzip compression enabled
- Resource limits prevent noisy neighbors
- Topology-aware scheduling
- Efficient health check intervals

---

**⚠️ Important**: This is a production environment. All changes should go through proper change management procedures and be tested in staging first.
