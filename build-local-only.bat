@echo off
echo Building Alpha Motos CRM with fixed nginx configuration...

REM Build the Docker image with fixed nginx config
docker build -t gustacg/alpha-motos-crm:latest .

REM Verify the build
echo Verifying build...
docker run --rm gustacg/alpha-motos-crm:latest ls -la /usr/share/nginx/html/

echo Build completed successfully!
echo Image: gustacg/alpha-motos-crm:latest
echo.
echo Next steps:
echo 1. Login to Docker Hub: docker login
echo 2. Push manually: docker push gustacg/alpha-motos-crm:latest
echo 3. Update the stack in Portainer
echo 4. Force update the service
