Write-Host "Deploying to Kubernetes..." -ForegroundColor Green

.\scripts\build-k8s.ps1

kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/project-deployment.yaml
kubectl apply -f k8s/conversation-deployment.yaml
kubectl apply -f k8s/gateway-deployment.yaml

Write-Host "Deployed! Gateway available at http://localhost:30000" -ForegroundColor Cyan