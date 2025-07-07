param(
    [switch]$Watch
)

dotnet build ./services/Shared/Shared.csproj

if ($Watch) {
    Write-Host "Running in WATCH mode (hot reload)..."

    Start-Process powershell -ArgumentList "-NoExit", "-Command", "dotnet watch --project './services/ProjectService/src/ProjectService.Api/ProjectService.Api.csproj' run"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "dotnet watch --project './services/ConversationService/src/ConversationService.Api/ConversationService.Api.csproj' run"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "dotnet watch --project './services/Gateway/Gateway.csproj' run"
}
else {
    Write-Host "Running in NORMAL mode..."

    Start-Process powershell -ArgumentList "-NoExit", "-Command", "dotnet run --project './services/ProjectService/src/ProjectService.Api/ProjectService.Api.csproj'"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "dotnet run --project './services/ConversationService/src/ConversationService.Api/ConversationService.Api.csproj'"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "dotnet run --project './services/Gateway/Gateway.csproj'"
}

Write-Host "All services started in new PowerShell windows."
Write-Host "Close each window manually or kill processes in Task Manager when done."
