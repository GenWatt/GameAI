param(
    [ValidateSet("start", "stop", "restart", "status", "logs")]
    [string]$Action = "status",
    [ValidateSet("gateway", "project", "conversation", "all")]
    [string]$Service = "all"
)

switch ($Action) {
    "start" {
        Write-Host "Starting Kubernetes services..." -ForegroundColor Green
        .\scripts\deploy-k8s.ps1
    }
    
    "stop" {
        Write-Host "Stopping Kubernetes services..." -ForegroundColor Yellow
        .\scripts\stop-k8s.ps1
    }
    
    "restart" {
        Write-Host "Restarting Kubernetes services..." -ForegroundColor Yellow
        .\scripts\stop-k8s.ps1
        Start-Sleep -Seconds 5
        .\scripts\deploy-k8s.ps1
    }
    
    "status" {
        Write-Host "Kubernetes Status:" -ForegroundColor Green
        kubectl get pods -n gameai-dev
        kubectl get services -n gameai-dev
        kubectl get deployments -n gameai-dev
    }
    
    "logs" {
        if ($Service -eq "all") {
            Write-Host "Choose a specific service for logs: gateway, project, or conversation" -ForegroundColor Yellow
        } else {
            $deploymentName = "$Service-api"
            Write-Host "Showing logs for $Service service..." -ForegroundColor Green
            kubectl logs -f deployment/$deploymentName -n gameai-dev
        }
    }
}