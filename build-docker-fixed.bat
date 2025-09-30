@echo off
echo Building Alpha Motos CRM with fixed nginx configuration...

REM Login to Docker Hub (if needed)
echo Checking Docker Hub login...
docker info | findstr "Username" >nul
if %errorlevel% neq 0 (
    echo Please login to Docker Hub first:
    echo docker login
    pause
    exit /b 1
)

REM Build the Docker image with fixed nginx config
echo Building image...
docker build -t gustacg/alpha-motos-crm:latest .

REM Verify the build
echo Verifying build...
docker run --rm gustacg/alpha-motos-crm:latest ls -la /usr/share/nginx/html/

REM Tag for Docker Hub
echo Tagging image...
docker tag gustacg/alpha-motos-crm:latest docker.io/gustacg/alpha-motos-crm:latest

REM Push to Docker Hub
echo Pushing to Docker Hub...
docker push docker.io/gustacg/alpha-motos-crm:latest

echo Build completed successfully!
echo Image: docker.io/gustacg/alpha-motos-crm:latest
echo.
echo Next steps:
echo 1. Update the stack in Portainer
echo 2. Force update the service
echo 3. Check logs: docker service logs alpha-motos-crm_alpha-motos-crm
