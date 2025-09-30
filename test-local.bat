@echo off
echo Testando aplicacao localmente...

echo.
echo 1. Buildando aplicacao...
npm run build

echo.
echo 2. Verificando se dist foi criado...
dir dist

echo.
echo 3. Verificando se index.html existe...
type dist\index.html | head -5

echo.
echo 4. Iniciando servidor local para teste...
echo Acesse: http://localhost:3000
echo Pressione Ctrl+C para parar
npx serve dist -p 3000
