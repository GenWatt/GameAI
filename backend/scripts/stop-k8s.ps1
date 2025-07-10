Write-Host "Stopping Kubernetes services..." -ForegroundColor Yellow

kubectl delete deployment gateway-api -n gameai-dev --ignore-not-found=true
kubectl delete deployment project-api -n gameai-dev --ignore-not-found=true
kubectl delete deployment conversation-api -n gameai-dev --ignore-not-found=true

kubectl delete service gateway-api-service -n gameai-dev --ignore-not-found=true
kubectl delete service project-api-service -n gameai-dev --ignore-not-found=true
kubectl delete service conversation-api-service -n gameai-dev --ignore-not-found=true

kubectl delete configmap gameai-config -n gameai-dev --ignore-not-found=true
kubectl delete namespace gameai-dev --ignore-not-found=true

Write-Host "All Kubernetes resources deleted!" -ForegroundColor Green