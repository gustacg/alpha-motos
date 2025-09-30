@echo off
echo Building and pushing Alpha Motos CRM...

REM Login to Docker Hub (you'll need to enter credentials)
echo Please login to Docker Hub...
docker login

REM Build the Docker image
echo Building image...
docker build -t gustacg/alpha-motos-crm:latest .

REM Verify the build
echo Verifying build...
docker run --rm gustacg/alpha-motos-crm:latest ls -la /usr/share/nginx/html/

REM Push to Docker Hub
echo Pushing to Docker Hub...
docker push gustacg/alpha-motos-crm:latest

echo Build and push completed successfully!
echo Image: gustacg/alpha-motos-crm:latest
echo.
echo Next steps:
echo 1. Update the stack in Portainer with STACK-PORTAINER-FINAL-CORRIGIDA.yml
echo 2. Force update the service
echo 3. Check logs: docker service logs alpha-motos-crm_alpha-motos-crm
