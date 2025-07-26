#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Monitor and check the status of GameAI production deployment
.DESCRIPTION
    This script provides comprehensive monitoring and status checking for the GameAI production deployment
.PARAMETER Namespace
    Target namespace (default: gameai-prod)
.PARAMETER Watch
    Enable continuous monitoring mode
.PARAMETER Detailed
    Show detailed information
.EXAMPLE
    .\monitor-production.ps1
.EXAMPLE
    .\monitor-production.ps1 -Watch -Detailed
#>

param(
    [string]$Namespace = "gameai-prod",
    [switch]$Watch,
    [switch]$Detailed
)

# Colors for output
$Red = "`e[31m"
$Green = "`e[32m"
$Yellow = "`e[33m"
$Blue = "`e[34m"
$Cyan = "`e[36m"
$Reset = "`e[0m"

function Write-ColorOutput {
    param([string]$Color, [string]$Message)
    Write-Host "${Color}${Message}${Reset}"
}

function Get-DeploymentStatus {
    Write-ColorOutput $Blue "📊 Deployment Status"
    Write-Host "===================="
    
    try {
        $deployments = kubectl get deployments -n $Namespace -o json | ConvertFrom-Json
        
        foreach ($deployment in $deployments.items) {
            $name = $deployment.metadata.name
            $replicas = $deployment.spec.replicas
            $readyReplicas = if ($deployment.status.readyReplicas) { $deployment.status.readyReplicas } else { 0 }
            $availableReplicas = if ($deployment.status.availableReplicas) { $deployment.status.availableReplicas } else { 0 }
            
            $status = if ($readyReplicas -eq $replicas -and $availableReplicas -eq $replicas) {
                "${Green}✅ Ready${Reset}"
            } elseif ($readyReplicas -gt 0) {
                "${Yellow}⚠️  Partial${Reset}"
            } else {
                "${Red}❌ Not Ready${Reset}"
            }
            
            Write-Host "  $name`: $status ($readyReplicas/$replicas ready)"
        }
    }
    catch {
        Write-ColorOutput $Red "❌ Failed to get deployment status: $($_.Exception.Message)"
    }
    Write-Host ""
}

function Get-PodStatus {
    Write-ColorOutput $Blue "🟢 Pod Status"
    Write-Host "=============="
    
    try {
        $pods = kubectl get pods -n $Namespace -o json | ConvertFrom-Json
        
        $statusCounts = @{}
        foreach ($pod in $pods.items) {
            $status = $pod.status.phase
            if ($statusCounts.ContainsKey($status)) {
                $statusCounts[$status]++
            } else {
                $statusCounts[$status] = 1
            }
            
            if ($Detailed) {
                $name = $pod.metadata.name
                $restarts = ($pod.status.containerStatuses | Measure-Object -Property restartCount -Sum).Sum
                $age = $pod.metadata.creationTimestamp
                
                $statusIcon = switch ($status) {
                    "Running" { "${Green}🟢${Reset}" }
                    "Pending" { "${Yellow}🟡${Reset}" }
                    "Failed" { "${Red}🔴${Reset}" }
                    "Succeeded" { "${Green}✅${Reset}" }
                    default { "${Yellow}❓${Reset}" }
                }
                
                Write-Host "  $statusIcon $name - $status (Restarts: $restarts)"
            }
        }
        
        Write-Host "  Summary:"
        foreach ($status in $statusCounts.Keys) {
            $count = $statusCounts[$status]
            $statusIcon = switch ($status) {
                "Running" { "${Green}🟢${Reset}" }
                "Pending" { "${Yellow}🟡${Reset}" }
                "Failed" { "${Red}🔴${Reset}" }
                "Succeeded" { "${Green}✅${Reset}" }
                default { "${Yellow}❓${Reset}" }
            }
            Write-Host "    $statusIcon $status`: $count"
        }
    }
    catch {
        Write-ColorOutput $Red "❌ Failed to get pod status: $($_.Exception.Message)"
    }
    Write-Host ""
}

function Get-ServiceStatus {
    Write-ColorOutput $Blue "🌐 Service Status"
    Write-Host "================="
    
    try {
        $services = kubectl get services -n $Namespace -o json | ConvertFrom-Json
        
        foreach ($service in $services.items) {
            $name = $service.metadata.name
            $type = $service.spec.type
            $clusterIP = $service.spec.clusterIP
            $ports = $service.spec.ports | ForEach-Object { "$($_.port):$($_.targetPort)" }
            
            # Get endpoints
            try {
                $endpoints = kubectl get endpoints $name -n $Namespace -o json | ConvertFrom-Json
                $readyEndpoints = 0
                if ($endpoints.subsets) {
                    foreach ($subset in $endpoints.subsets) {
                        if ($subset.addresses) {
                            $readyEndpoints += $subset.addresses.Count
                        }
                    }
                }
                
                $endpointStatus = if ($readyEndpoints -gt 0) {
                    "${Green}✅ $readyEndpoints endpoints${Reset}"
                } else {
                    "${Red}❌ No endpoints${Reset}"
                }
            }
            catch {
                $endpointStatus = "${Yellow}❓ Unknown${Reset}"
            }
            
            Write-Host "  $name ($type) - $clusterIP - Ports: $($ports -join ', ') - $endpointStatus"
        }
    }
    catch {
        Write-ColorOutput $Red "❌ Failed to get service status: $($_.Exception.Message)"
    }
    Write-Host ""
}

function Get-IngressStatus {
    Write-ColorOutput $Blue "🔗 Ingress Status"
    Write-Host "================="
    
    try {
        $ingresses = kubectl get ingress -n $Namespace -o json | ConvertFrom-Json
        
        if ($ingresses.items.Count -eq 0) {
            Write-Host "  No ingresses found"
        } else {
            foreach ($ingress in $ingresses.items) {
                $name = $ingress.metadata.name
                $hosts = $ingress.spec.rules | ForEach-Object { $_.host }
                $tlsHosts = if ($ingress.spec.tls) { $ingress.spec.tls | ForEach-Object { $_.hosts } } else { @() }
                
                Write-Host "  $name`:"
                Write-Host "    Hosts: $($hosts -join ', ')"
                if ($tlsHosts.Count -gt 0) {
                    Write-Host "    TLS: ${Green}✅ Enabled${Reset} ($($tlsHosts -join ', '))"
                } else {
                    Write-Host "    TLS: ${Red}❌ Not configured${Reset}"
                }
                
                # Check if LoadBalancer IP is assigned
                if ($ingress.status.loadBalancer.ingress) {
                    $ip = $ingress.status.loadBalancer.ingress[0].ip
                    Write-Host "    Load Balancer IP: ${Green}$ip${Reset}"
                } else {
                    Write-Host "    Load Balancer IP: ${Yellow}Pending${Reset}"
                }
            }
        }
    }
    catch {
        Write-ColorOutput $Red "❌ Failed to get ingress status: $($_.Exception.Message)"
    }
    Write-Host ""
}

function Get-ResourceUsage {
    Write-ColorOutput $Blue "📈 Resource Usage"
    Write-Host "=================="
    
    try {
        Write-Host "  CPU and Memory usage by pod:"
        kubectl top pods -n $Namespace --no-headers | ForEach-Object {
            $parts = $_ -split '\s+'
            if ($parts.Count -ge 3) {
                $name = $parts[0]
                $cpu = $parts[1]
                $memory = $parts[2]
                Write-Host "    $name`: CPU: $cpu, Memory: $memory"
            }
        }
    }
    catch {
        Write-ColorOutput $Yellow "⚠️  Resource metrics not available (metrics-server might not be installed)"
    }
    Write-Host ""
}

function Get-RecentEvents {
    Write-ColorOutput $Blue "📋 Recent Events"
    Write-Host "================"
    
    try {
        $events = kubectl get events -n $Namespace --sort-by='.lastTimestamp' -o json | ConvertFrom-Json
        $recentEvents = $events.items | Select-Object -Last 10
        
        foreach ($event in $recentEvents) {
            $type = $event.type
            $reason = $event.reason
            $object = $event.involvedObject.name
            $message = $event.message
            $time = $event.lastTimestamp
            
            $typeIcon = switch ($type) {
                "Normal" { "${Green}ℹ️${Reset}" }
                "Warning" { "${Yellow}⚠️${Reset}" }
                "Error" { "${Red}❌${Reset}" }
                default { "${Blue}📝${Reset}" }
            }
            
            Write-Host "  $typeIcon [$time] $object - $reason`: $message"
        }
    }
    catch {
        Write-ColorOutput $Red "❌ Failed to get events: $($_.Exception.Message)"
    }
    Write-Host ""
}

function Get-CertificateStatus {
    Write-ColorOutput $Blue "🔒 Certificate Status"
    Write-Host "===================="
    
    try {
        # Check for cert-manager certificates
        $certs = kubectl get certificates -n $Namespace -o json 2>$null | ConvertFrom-Json
        
        if ($certs -and $certs.items.Count -gt 0) {
            foreach ($cert in $certs.items) {
                $name = $cert.metadata.name
                $ready = if ($cert.status.conditions) {
                    ($cert.status.conditions | Where-Object { $_.type -eq "Ready" }).status -eq "True"
                } else {
                    $false
                }
                
                $status = if ($ready) {
                    "${Green}✅ Ready${Reset}"
                } else {
                    "${Red}❌ Not Ready${Reset}"
                }
                
                Write-Host "  $name`: $status"
            }
        } else {
            Write-Host "  No certificates found (cert-manager might not be installed)"
        }
    }
    catch {
        Write-Host "  Certificate status not available"
    }
    Write-Host ""
}

function Show-QuickCommands {
    Write-ColorOutput $Cyan "🛠️  Quick Commands"
    Write-Host "=================="
    Write-Host "  View logs:"
    Write-Host "    kubectl logs -f deployment/gateway-api -n $Namespace"
    Write-Host "    kubectl logs -f deployment/conversation-api -n $Namespace"
    Write-Host "    kubectl logs -f deployment/project-api -n $Namespace"
    Write-Host ""
    Write-Host "  Scale deployments:"
    Write-Host "    kubectl scale deployment/gateway-api --replicas=5 -n $Namespace"
    Write-Host ""
    Write-Host "  Restart deployments:"
    Write-Host "    kubectl rollout restart deployment/gateway-api -n $Namespace"
    Write-Host ""
    Write-Host "  Port forward for testing:"
    Write-Host "    kubectl port-forward service/gateway-api 8080:5000 -n $Namespace"
    Write-Host ""
}

function Show-HealthSummary {
    Write-ColorOutput $Green "🏥 Health Summary"
    Write-Host "================="
    
    try {
        # Count healthy vs unhealthy pods
        $pods = kubectl get pods -n $Namespace -o json | ConvertFrom-Json
        $runningPods = ($pods.items | Where-Object { $_.status.phase -eq "Running" }).Count
        $totalPods = $pods.items.Count
        
        # Count ready deployments
        $deployments = kubectl get deployments -n $Namespace -o json | ConvertFrom-Json
        $readyDeployments = 0
        foreach ($deployment in $deployments.items) {
            $replicas = $deployment.spec.replicas
            $readyReplicas = if ($deployment.status.readyReplicas) { $deployment.status.readyReplicas } else { 0 }
            if ($readyReplicas -eq $replicas) {
                $readyDeployments++
            }
        }
        $totalDeployments = $deployments.items.Count
        
        $overallHealth = if ($runningPods -eq $totalPods -and $readyDeployments -eq $totalDeployments) {
            "${Green}🟢 Healthy${Reset}"
        } elseif ($runningPods -gt 0 -and $readyDeployments -gt 0) {
            "${Yellow}🟡 Degraded${Reset}"
        } else {
            "${Red}🔴 Unhealthy${Reset}"
        }
        
        Write-Host "  Overall Status: $overallHealth"
        Write-Host "  Pods: $runningPods/$totalPods running"
        Write-Host "  Deployments: $readyDeployments/$totalDeployments ready"
        
    }
    catch {
        Write-ColorOutput $Red "❌ Failed to calculate health summary: $($_.Exception.Message)"
    }
    Write-Host ""
}

function Monitor-Production {
    do {
        Clear-Host
        Write-ColorOutput $Green "🎯 GameAI Production Monitor"
        Write-Host "Last updated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        Write-Host "Namespace: $Namespace"
        Write-Host "============================================`n"
        
        Show-HealthSummary
        Get-DeploymentStatus
        Get-PodStatus
        Get-ServiceStatus
        Get-IngressStatus
        Get-ResourceUsage
        Get-CertificateStatus
        Get-RecentEvents
        
        if ($Detailed) {
            Show-QuickCommands
        }
        
        if ($Watch) {
            Write-ColorOutput $Blue "Press Ctrl+C to stop monitoring..."
            Start-Sleep -Seconds 30
        }
    } while ($Watch)
}

# Main execution
try {
    # Check if namespace exists
    $namespaceExists = kubectl get namespace $Namespace 2>$null
    if (-not $namespaceExists) {
        Write-ColorOutput $Red "❌ Namespace '$Namespace' does not exist"
        exit 1
    }
    
    Monitor-Production
    
} catch {
    Write-ColorOutput $Red "❌ Monitoring failed: $($_.Exception.Message)"
    exit 1
}
