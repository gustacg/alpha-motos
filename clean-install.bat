@echo off
echo ====================================
echo  Limpeza e Reinstalacao do NPM
echo ====================================

echo.
echo 1. Limpando cache do NPM...
call npm cache clean --force

echo.
echo 2. Removendo node_modules...
if exist "node_modules" (
    rmdir /s /q "node_modules"
    echo node_modules removido com sucesso
) else (
    echo node_modules nao encontrado
)

echo.
echo 3. Removendo package-lock.json...
if exist "package-lock.json" (
    del "package-lock.json"
    echo package-lock.json removido com sucesso
) else (
    echo package-lock.json nao encontrado
)

echo.
echo 4. Reinstalando dependencias...
call npm install

echo.
echo ====================================
echo  Processo concluido!
echo ====================================
echo.
echo Se ainda houver erros, tente:
echo npm install --legacy-peer-deps
echo.
pause
