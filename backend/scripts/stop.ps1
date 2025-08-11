# Stops and deletes all Kubernetes resources and Helm releases for the project

Write-Host "Uninstalling Prometheus Operator (kube-prometheus-stack)..."
helm uninstall prometheus-operator -n monitoring

Write-Host "Uninstalling cert-manager..."
helm uninstall cert-manager -n cert-manager

Write-Host "Deleting k8s resources in gameai-prod namespace..."
kubectl delete namespace gameai-prod --ignore-not-found

Write-Host "Deleting monitoring namespace..."
kubectl delete namespace monitoring --ignore-not-found

Write-Host "Deleting cert-manager namespace..."
kubectl delete namespace cert-manager --ignore-not-found

Write-Host "All clusters and resources have been stopped and deleted."