#!/bin/bash

echo "🔍 ===== DEBUG ALPHA MOTOS CRM DEPLOYMENT ====="
echo ""

echo "📊 1. SERVICES STATUS"
echo "===================="
docker service ls | grep alpha-motos
echo ""

echo "📋 2. SERVICE DETAILS"
echo "===================="
docker service inspect alpha-motos-crm_alpha-motos-crm --format '{{json .}}' | jq '.Spec.TaskTemplate.ContainerSpec.Image' 2>/dev/null || docker service inspect alpha-motos-crm_alpha-motos-crm | grep Image
echo ""

echo "📝 3. SERVICE LOGS (LAST 50 LINES)"
echo "=================================="
docker service logs alpha-motos-crm_alpha-motos-crm --tail 50
echo ""

echo "🏷️  4. TRAEFIK LABELS"
echo "===================="
docker service inspect alpha-motos-crm_alpha-motos-crm --format '{{range .Spec.Labels}}{{println .}}{{end}}' 2>/dev/null || docker service inspect alpha-motos-crm_alpha-motos-crm | grep -A 20 Labels
echo ""

echo "🌐 5. NETWORK CONNECTION"
echo "======================="
docker service inspect alpha-motos-crm_alpha-motos-crm --format '{{range .Spec.TaskTemplate.Networks}}{{println .Target}}{{end}}'
echo ""

echo "🔗 6. TRAEFIK STATUS (if accessible)"
echo "=================================="
curl -s http://localhost:8080/api/http/routers | grep alpha-motos || echo "Traefik API not accessible on localhost:8080"
echo ""

echo "🚀 7. CONTAINER STATUS"
echo "====================="
docker ps --filter "label=com.docker.swarm.service.name=alpha-motos-crm_alpha-motos-crm" --format "table {{.ID}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"
echo ""

echo "📋 8. RECENT CONTAINER LOGS"
echo "============================"
CONTAINER_ID=$(docker ps --filter "label=com.docker.swarm.service.name=alpha-motos-crm_alpha-motos-crm" --format "{{.ID}}" | head -n1)
if [ ! -z "$CONTAINER_ID" ]; then
    echo "Container ID: $CONTAINER_ID"
    docker logs $CONTAINER_ID --tail 20
else
    echo "No running container found"
fi
echo ""

echo "🧪 9. CONNECTIVITY TEST"
echo "======================="
echo "Testing HTTP on container..."
CONTAINER_ID=$(docker ps --filter "label=com.docker.swarm.service.name=alpha-motos-crm_alpha-motos-crm" --format "{{.ID}}" | head -n1)
if [ ! -z "$CONTAINER_ID" ]; then
    docker exec $CONTAINER_ID curl -s -I http://localhost:80/ | head -n 3
else
    echo "No running container to test"
fi
echo ""

echo "✅ Debug completed!"
echo "Run this script on your server and share the output."
