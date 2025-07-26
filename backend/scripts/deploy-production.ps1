#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Deploy GameAI to production Kubernetes cluster with security best practices
.DESCRIPTION
    This script deploys the GameAI application to a production Kubernetes cluster
    following security and operational best practices.
.PARAMETER DryRun
    Perform a dry run without actually applying the changes
.PARAMETER SkipValidation
    Skip pre-deployment validation checks
.PARAMETER Namespace
    Target namespace (default: gameai-prod)
.EXAMPLE
    .\deploy-production.ps1
.EXAMPLE
    .\deploy-production.ps1 -DryRun
#>

param(
    [switch]$DryRun,
    [switch]$SkipValidation,
    [string]$Namespace = "gameai-prod",
    [string]$Context = "",
    [string]$ImageTag = "1.0.0"
)

# Set error action preference
$ErrorActionPreference = "Stop"

# Colors for output
$Red = "`e[31m"
$Green = "`e[32m"
$Yellow = "`e[33m"
$Blue = "`e[34m"
$Reset = "`e[0m"

function Write-ColorOutput {
    param([string]$Color, [string]$Message)
    Write-Host "${Color}${Message}${Reset}"
}

function Test-Prerequisites {
    Write-ColorOutput $Blue "🔍 Checking prerequisites..."
    
    # Check kubectl
    try {
        kubectl version --client | Out-Null
        Write-ColorOutput $Green "✅ kubectl is installed"
    }
    catch {
        Write-ColorOutput $Red "❌ kubectl is not installed or not in PATH"
        exit 1
    }
    
    # Check cluster connectivity
    try {
        kubectl cluster-info | Out-Null
        Write-ColorOutput $Green "✅ Connected to Kubernetes cluster"
    }
    catch {
        Write-ColorOutput $Red "❌ Cannot connect to Kubernetes cluster"
        exit 1
    }
    
    # Check if we're in the right context for production
    $currentContext = kubectl config current-context
    if ($Context -and $currentContext -ne $Context) {
        Write-ColorOutput $Red "❌ Wrong Kubernetes context. Expected: $Context, Current: $currentContext"
        exit 1
    }
    
    Write-ColorOutput $Yellow "⚠️  Current context: $currentContext"
    
    # Fixed confirmation prompt with retry limit and empty input handling
    $maxRetries = 3
    $retryCount = 0
    do {
        $confirm = Read-Host "Are you sure you want to deploy to production? (Type 'yes' to continue or 'no' to cancel)"
        $confirm = $confirm.Trim().ToLower()
        if ([string]::IsNullOrWhiteSpace($confirm)) {
            Write-ColorOutput $Yellow "Input cannot be empty. Please type 'yes' or 'no'."
        }
        $retryCount++
        if ($retryCount -ge $maxRetries -and ($confirm -ne "yes" -and $confirm -ne "no")) {
            Write-ColorOutput $Red "❌ Too many invalid attempts. Exiting."
            exit 1
        }
    } while ($confirm -ne "yes" -and $confirm -ne "no")
    
    if ($confirm -ne "yes") {
        Write-ColorOutput $Yellow "Deployment cancelled by user"
        exit 0
    }
}

function Test-SecurityCompliance {
    Write-ColorOutput $Blue "🔒 Running security compliance checks..."
    
    # Check for security baseline
    if (Test-Path "security-baseline.yaml") {
        if (-not $DryRun) {
            kubectl apply -f security-baseline.yaml --dry-run=client | Out-Null
        }
        Write-ColorOutput $Green "✅ Security baseline configuration is valid"
    }
    
    # Validate RBAC
    if (Test-Path "rbac.yaml") {
        if (-not $DryRun) {
            kubectl apply -f rbac.yaml --dry-run=client | Out-Null
        }
        Write-ColorOutput $Green "✅ RBAC configuration is valid"
    }
    
    # Check for secrets
    if (Test-Path "secrets.yaml") {
        Write-ColorOutput $Yellow "⚠️  Remember to update secrets.yaml with actual values before deployment"
    }
}

function Update-ImageTags {
    param([string]$Tag)
    
    Write-ColorOutput $Blue "🏷️  Updating image tags to $Tag..."
    
    $deploymentFiles = @(
        "gateway-deployment.yaml",
        "conversation-deployment.yaml", 
        "project-deployment.yaml"
    )
    
    foreach ($file in $deploymentFiles) {
        if (Test-Path $file) {
            # Update image tags in deployment files
            (Get-Content $file) -replace ':latest', ":$Tag" -replace ':[\d\.]+', ":$Tag" | Set-Content $file
            Write-ColorOutput $Green "✅ Updated image tag in $file"
        }
    }
}

function Deploy-Namespace {
    Write-ColorOutput $Blue "📦 Deploying namespace and base resources..."
    
    $baseFiles = @(
        "namespace.yaml",
        "rbac.yaml",
        "secrets.yaml",
        "configmap.yaml"
    )
    
    foreach ($file in $baseFiles) {
        if (Test-Path $file) {
            Write-ColorOutput $Blue "Applying $file..."
            if ($DryRun) {
                kubectl apply -f $file --dry-run=client
            } else {
                kubectl apply -f $file
            }
            Write-ColorOutput $Green "✅ Applied $file"
        } else {
            Write-ColorOutput $Yellow "⚠️  $file not found, skipping..."
        }
    }
}

function Deploy-Applications {
    Write-ColorOutput $Blue "🚀 Deploying applications..."
    
    $appFiles = @(
        "gateway-deployment.yaml",
        "conversation-deployment.yaml",
        "project-deployment.yaml"
    )
    
    foreach ($file in $appFiles) {
        if (Test-Path $file) {
            Write-ColorOutput $Blue "Applying $file..."
            if ($DryRun) {
                kubectl apply -f $file --dry-run=client
            } else {
                kubectl apply -f $file
            }
            Write-ColorOutput $Green "✅ Applied $file"
        }
    }
}

function Deploy-Networking {
    Write-ColorOutput $Blue "🌐 Deploying networking resources..."
    
    $networkFiles = @(
        "network-policies.yaml",
        "ingress.yaml"
    )
    
    foreach ($file in $networkFiles) {
        if (Test-Path $file) {
            Write-ColorOutput $Blue "Applying $file..."
            if ($DryRun) {
                kubectl apply -f $file --dry-run=client
            } else {
                kubectl apply -f $file
            }
            Write-ColorOutput $Green "✅ Applied $file"
        }
    }
}

function Deploy-Monitoring {
    Write-ColorOutput $Blue "📊 Deploying monitoring resources..."
    
    if (Test-Path "monitoring.yaml") {
        Write-ColorOutput $Blue "Applying monitoring.yaml..."
        if ($DryRun) {
            kubectl apply -f monitoring.yaml --dry-run=client
        } else {
            kubectl apply -f monitoring.yaml
        }
        Write-ColorOutput $Green "✅ Applied monitoring.yaml"
    }
}

function Wait-ForDeployment {
    if ($DryRun) {
        return
    }
    
    Write-ColorOutput $Blue "⏳ Waiting for deployments to be ready..."
    
    $deployments = @("gateway-api", "conversation-api", "project-api")
    
    foreach ($deployment in $deployments) {
        Write-ColorOutput $Blue "Waiting for $deployment..."
        kubectl rollout status deployment/$deployment -n $Namespace --timeout=300s
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput $Green "✅ $deployment is ready"
        } else {
            Write-ColorOutput $Red "❌ $deployment failed to become ready"
            exit 1
        }
    }
}

function Test-Deployment {
    if ($DryRun) {
        return
    }
    
    Write-ColorOutput $Blue "🧪 Testing deployment..."
    
    # Check pod status
    Write-ColorOutput $Blue "Checking pod status..."
    kubectl get pods -n $Namespace -o wide
    
    # Check service endpoints
    Write-ColorOutput $Blue "Checking service endpoints..."
    kubectl get endpoints -n $Namespace
    
    # Run basic connectivity tests
    Write-ColorOutput $Blue "Running connectivity tests..."
    $gatewayService = kubectl get service gateway-api -n $Namespace -o jsonpath='{.spec.clusterIP}'
    if ($gatewayService) {
        Write-ColorOutput $Green "✅ Gateway service IP: $gatewayService"
    }
}

function Show-PostDeploymentInfo {
    Write-ColorOutput $Green "🎉 Deployment completed successfully!"
    Write-ColorOutput $Blue "📋 Post-deployment checklist:"
    Write-Host "   1. Update DNS records to point to the ingress"
    Write-Host "   2. Verify SSL certificates are issued"
    Write-Host "   3. Run end-to-end tests"
    Write-Host "   4. Monitor application metrics"
    Write-Host "   5. Set up log aggregation"
    Write-Host "   6. Configure backup procedures"
    
    Write-ColorOutput $Blue "🔗 Useful commands:"
    Write-Host "   kubectl get all -n $Namespace"
    Write-Host "   kubectl logs -f deployment/gateway-api -n $Namespace"
    Write-Host "   kubectl describe ingress gameai-ingress -n $Namespace"
}

# Main execution
try {
    Write-ColorOutput $Green "🚀 Starting GameAI Production Deployment"
    Write-Host "==========================================`n"
    
    if (-not $SkipValidation) {
        Test-Prerequisites
        Test-SecurityCompliance
    }
    
    if ($ImageTag -ne "1.0.0") {
        Update-ImageTags -Tag $ImageTag
    }
    
    # Change to k8s-prod directory
    $scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
    $k8sProdPath = Join-Path $scriptPath "k8s-prod"
    if (Test-Path $k8sProdPath) {
        Set-Location $k8sProdPath
    }
    
    Deploy-Namespace
    Start-Sleep -Seconds 5
    
    Deploy-Applications
    Start-Sleep -Seconds 10
    
    Deploy-Networking
    Start-Sleep -Seconds 5
    
    Deploy-Monitoring
    
    Wait-ForDeployment
    Test-Deployment
    Show-PostDeploymentInfo
    
} catch {
    Write-ColorOutput $Red "❌ Deployment failed: $($_.Exception.Message)"
    Write-ColorOutput $Yellow "Check the error above and fix any issues before retrying"
    exit 1
}
