@echo off
echo 🔍 ===== DEBUG ALPHA MOTOS CRM DEPLOYMENT =====
echo.

echo 📊 1. SERVICES STATUS
echo ====================
docker service ls | findstr alpha-motos
echo.

echo 📋 2. SERVICE DETAILS
echo ====================
docker service inspect alpha-motos-crm_alpha-motos-crm --format "{{.Spec.TaskTemplate.ContainerSpec.Image}}"
echo.

echo 📝 3. SERVICE LOGS (LAST 50 LINES)
echo ==================================
docker service logs alpha-motos-crm_alpha-motos-crm --tail 50
echo.

echo 🏷️  4. TRAEFIK LABELS
echo ====================
docker service inspect alpha-motos-crm_alpha-motos-crm --format "{{range .Spec.Labels}}{{println .}}{{end}}"
echo.

echo 🌐 5. NETWORK CONNECTION
echo =======================
docker service inspect alpha-motos-crm_alpha-motos-crm --format "{{range .Spec.TaskTemplate.Networks}}{{println .Target}}{{end}}"
echo.

echo 🚀 6. CONTAINER STATUS
echo =====================
docker ps --filter "label=com.docker.swarm.service.name=alpha-motos-crm_alpha-motos-crm" --format "table {{.ID}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"
echo.

echo 📋 7. RECENT CONTAINER LOGS
echo ============================
for /f "tokens=*" %%i in ('docker ps --filter "label=com.docker.swarm.service.name=alpha-motos-crm_alpha-motos-crm" --format "{{.ID}}" ^| findstr /R "^"') do (
    echo Container ID: %%i
    docker logs %%i --tail 20
    goto :found
)
:found

echo.
echo ✅ Debug completed!
echo Run this script on your server and share the output.
pause
