@echo off
echo Building Alpha Motos CRM with fixed nginx configuration...

REM Build the Docker image with fixed nginx config
docker build -t gustacg/alpha-motos-crm:latest .

REM Verify the build
echo Verifying build...
docker run --rm gustacg/alpha-motos-crm:latest ls -la /usr/share/nginx/html/

REM Push to Docker Hub
echo Pushing to Docker Hub...
docker push gustacg/alpha-motos-crm:latest

echo Build completed successfully!
echo Image: gustacg/alpha-motos-crm:latest
echo.
echo Next steps:
echo 1. Update the stack in Portainer
echo 2. Force update the service
echo 3. Check logs: docker service logs alpha-motos-crm_alpha-motos-crm
