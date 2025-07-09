param(
    [switch]$Watch
)

# Define project paths
$sharedProject = "./services/SynapseStudio.Shared/SynapseStudio.Shared.csproj"
$projectServiceApi = "./services/SynapseStudio.ProjectService/src/SynapseStudio.ProjectService.Api/SynapseStudio.ProjectService.Api.csproj"
$conversationServiceApi = "./services/SynapseStudio.ConversationService/src/SynapseStudio.ConversationService.Api/SynapseStudio.ConversationService.Api.csproj"
$gateway = "./services/SynapseStudio.Gateway/SynapseStudio.Gateway.csproj"

dotnet build $sharedProject

if ($Watch) {
    Write-Host "Running in WATCH mode (hot reload)..."

    Start-Process powershell -ArgumentList "-NoExit", "-Command", "dotnet watch --project '$projectServiceApi' run"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "dotnet watch --project '$conversationServiceApi' run"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "dotnet watch --project '$gateway' run"
}
else {
    Write-Host "Running in NORMAL mode..."

    Start-Process powershell -ArgumentList "-NoExit", "-Command", "dotnet run --project '$projectServiceApi'"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "dotnet run --project '$conversationServiceApi'"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "dotnet run --project '$gateway'"
}

Write-Host "All services started in new PowerShell windows."
Write-Host "Close each window manually or kill processes in Task Manager when done."
