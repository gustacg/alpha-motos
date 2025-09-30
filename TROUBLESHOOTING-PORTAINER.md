# Troubleshooting - Stack Portainer Alpha Motos CRM

## Problemas Identificados na Stack Original

### 1. **Configuração do Traefik Incorreta**
- ❌ **Problema**: Nomes de routers conflitantes
- ❌ **Problema**: Falta de redirecionamento HTTP→HTTPS
- ❌ **Problema**: Configuração de TLS inadequada

### 2. **Configuração de Deploy Incompleta**
- ❌ **Problema**: Falta de restart policies adequadas
- ❌ **Problema**: Ausência de health checks
- ❌ **Problema**: Sem configuração de rollback

## Soluções Implementadas

### Stack Corrigida (`STACK-PORTAINER-CORRIGIDA.yml`)
✅ **Configuração Traefik Correta**:
- Routers com nomes únicos e não conflitantes
- Redirecionamento HTTP→HTTPS configurado
- TLS com certresolver adequado
- Headers de segurança implementados

✅ **Deploy Robusto**:
- Restart policy com delay e max_attempts
- Update config com rollback
- Health checks configurados

### Stack Robusta (`STACK-PORTAINER-ROBUSTA.yml`)
✅ **Recursos Adicionais**:
- Rate limiting configurado
- Health checks no load balancer
- Placement constraints
- Prioridades de router definidas

## Como Aplicar a Correção

### 1. **Backup da Stack Atual**
```bash
# No Portainer, exporte a stack atual antes de fazer mudanças
```

### 2. **Aplicar Nova Stack**
1. Acesse Portainer → Stacks
2. Edite a stack `alpha-motos-crm`
3. Substitua o conteúdo pela stack corrigida
4. Clique em "Update the stack"

### 3. **Verificar Deploy**
```bash
# Verificar se o serviço está rodando
docker service ls | grep alpha-motos

# Verificar logs
docker service logs alpha-motos-crm_alpha-motos-crm

# Verificar health check
curl -f http://localhost/health
```

## Diagnóstico de Problemas

### Se o serviço não inicia:
1. **Verificar logs**: `docker service logs alpha-motos-crm_alpha-motos-crm`
2. **Verificar rede**: `docker network ls | grep network_swarm_public`
3. **Verificar imagem**: `docker image inspect docker.io/gustacg/alpha-motos-crm:latest`

### Se o domínio não responde:
1. **Verificar Traefik**: Acesse dashboard do Traefik
2. **Verificar DNS**: `nslookup crm.grupoalphamotos.com`
3. **Verificar certificado**: `curl -I https://crm.grupoalphamotos.com`

### Se há erro 404:
1. **Verificar nginx**: Logs do container nginx
2. **Verificar build**: Se os arquivos foram copiados corretamente
3. **Verificar SPA routing**: Configuração do nginx para React Router

## Comandos de Debug

```bash
# Verificar status do serviço
docker service ps alpha-motos-crm_alpha-motos-crm

# Verificar logs em tempo real
docker service logs -f alpha-motos-crm_alpha-motos-crm

# Verificar rede
docker network inspect network_swarm_public

# Testar conectividade interna
docker exec -it $(docker ps -q -f name=alpha-motos) curl localhost/health
```

## Configurações Importantes

### Traefik Labels Explicados:
- `traefik.enable=true`: Habilita o Traefik para este serviço
- `traefik.http.routers.*.rule`: Define qual domínio atende
- `traefik.http.routers.*.entrypoints`: Define porta (web=80, websecure=443)
- `traefik.http.routers.*.tls.certresolver`: Configura certificado SSL
- `traefik.http.services.*.loadbalancer.server.port`: Porta do container
- `traefik.http.services.*.loadbalancer.passHostHeader`: Preserva header Host

### Health Checks:
- **Container**: `HEALTHCHECK` no Dockerfile
- **Traefik**: `loadbalancer.healthcheck.path=/health`
- **Nginx**: Endpoint `/health` configurado

## Próximos Passos

1. **Aplicar stack corrigida**
2. **Verificar logs de deploy**
3. **Testar acesso ao domínio**
4. **Configurar monitoramento** (opcional)
5. **Implementar backup automático** (opcional)
