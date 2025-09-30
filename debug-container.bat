@echo off
echo Diagnosticando container Alpha Motos CRM...

echo.
echo 1. Verificando se o container esta rodando...
docker ps | findstr alpha-motos

echo.
echo 2. Verificando arquivos dentro do container...
docker run --rm gustacg/alpha-motos-crm:latest ls -la /usr/share/nginx/html/

echo.
echo 3. Verificando se index.html existe...
docker run --rm gustacg/alpha-motos-crm:latest cat /usr/share/nginx/html/index.html | head -10

echo.
echo 4. Verificando configuracao do nginx...
docker run --rm gustacg/alpha-motos-crm:latest cat /etc/nginx/conf.d/default.conf

echo.
echo 5. Testando health check...
docker run --rm gustacg/alpha-motos-crm:latest curl -f http://localhost/health

echo.
echo 6. Testando acesso a pagina principal...
docker run --rm gustacg/alpha-motos-crm:latest curl -I http://localhost/

echo.
echo Diagnostico completo!
pause
