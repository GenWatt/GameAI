# Deploys Prometheus Operator, cert-manager, and applies k8s manifests using kustomize

Write-Host "Adding Prometheus Community Helm repo..."
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts | Out-Null
helm repo update | Out-Null

if (-not (helm list -n monitoring | Select-String "prometheus-operator")) {
    Write-Host "Installing kube-prometheus-stack (Prometheus Operator)..."
    helm install prometheus-operator prometheus-community/kube-prometheus-stack --namespace monitoring --create-namespace
} else {
    Write-Host "Prometheus Operator already installed. Skipping install."
}

Write-Host "Adding Jetstack Helm repo for cert-manager..."
helm repo add jetstack https://charts.jetstack.io | Out-Null
helm repo update | Out-Null

if (-not (helm list -n cert-manager | Select-String "cert-manager")) {
    Write-Host "Installing cert-manager (with CRDs)..."
    helm install cert-manager jetstack/cert-manager `
      --namespace cert-manager `
      --create-namespace `
      --set installCRDs=true
} else {
    Write-Host "cert-manager already installed. Skipping install."
}

Start-Sleep -Seconds 5

Write-Host "Applying k8s manifests with kustomize..."
kubectl apply -k ./k8s-prod

Write-Host "Deployment complete."