Write-Host "Kubernetes Status:" -ForegroundColor Green
kubectl get pods -n gameai-dev
kubectl get services -n gameai-dev