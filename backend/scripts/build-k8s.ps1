Write-Host "Building Docker images..." -ForegroundColor Green

docker build -t gameai/gateway-api:dev -f ./services/SynapseStudio.Gateway/Dockerfile.dev .
docker build -t gameai/project-api:dev -f ./services/SynapseStudio.ProjectService/Dockerfile.dev . 
docker build -t gameai/conversation-api:dev -f ./services/SynapseStudio.ConversationService/Dockerfile.dev .

Write-Host "Images built!" -ForegroundColor Green