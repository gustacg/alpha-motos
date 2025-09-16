@echo off
REM Script para build e push da imagem Docker (Windows)
REM Uso: build-docker.bat [tag]

setlocal enabledelayedexpansion

REM Configurações
set IMAGE_NAME=gustacg/alpha-motos-crm
if "%1"=="" (
    set TAG=latest
) else (
    set TAG=%1
)
set FULL_IMAGE_NAME=%IMAGE_NAME%:%TAG%

echo 🔨 Building Docker image: %FULL_IMAGE_NAME%

REM Build da imagem
docker build -t %FULL_IMAGE_NAME% .

if %ERRORLEVEL% neq 0 (
    echo ❌ Build failed!
    exit /b 1
)

echo ✅ Build completed successfully!

REM Perguntar se deseja fazer push
set /p PUSH="Deseja fazer push para o Docker Hub? (y/N): "

if /i "%PUSH%"=="y" (
    echo 🚀 Pushing to Docker Hub...
    docker push %FULL_IMAGE_NAME%
    
    if !ERRORLEVEL! equ 0 (
        echo ✅ Push completed successfully!
        echo 📦 Image available at: docker.io/%FULL_IMAGE_NAME%
    ) else (
        echo ❌ Push failed!
        exit /b 1
    )
) else (
    echo ℹ️  Image built locally only
)

echo 🔍 Testing image locally...
echo Run: docker run -p 8080:80 %FULL_IMAGE_NAME%

pause
