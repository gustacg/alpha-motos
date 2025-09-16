# 🚀 Quick Deploy Guide - Alpha Motos CRM

## Resumo Rápido

**Domínio**: `alphamotos.gustacg.com`  
**Docker Image**: `gustacg/alpha-motos-crm:latest`  
**Port**: 80 (interno), HTTPS (externo)

## Checklist de Deploy

### 1. ✅ GitHub Setup
```bash
# Adicionar secrets no GitHub:
# DOCKER_USERNAME: gustacg
# DOCKER_PASSWORD: [token do Docker Hub]
```

### 2. ✅ Arquivos Criados
- [x] `Dockerfile` - Multi-stage build (Node + Nginx)
- [x] `nginx.conf` - SPA routing + security headers
- [x] `.dockerignore` - Otimização do build
- [x] `.github/workflows/docker-build-push.yml` - CI/CD
- [x] `docker-compose.portainer.yml` - Stack do Portainer

### 3. 🚀 Deploy Steps

#### GitHub Actions (Automático)
1. Push para `main` → Build + Push automático
2. Aguardar ~5-10 minutos

#### Portainer (Manual)
1. Stacks > Add Stack
2. Nome: `alpha-motos-crm`
3. Colar conteúdo do `docker-compose.portainer.yml`
4. Deploy

#### DNS
1. Configurar `alphamotos.gustacg.com` → IP do servidor

## Stack YAML para Portainer

```yaml
version: "3.8"
services:
  alpha-motos-crm:
    image: docker.io/gustacg/alpha-motos-crm:latest
    networks:
      - network_swarm_public
    deploy:
      replicas: 1
      restart_policy:
        condition: on-failure
      labels:
        - traefik.enable=true
        - traefik.http.routers.alpha-motos.rule=Host(`alphamotos.gustacg.com`)
        - traefik.http.routers.alpha-motos.entrypoints=websecure
        - traefik.http.routers.alpha-motos.tls.certresolver=letsencryptresolver
        - traefik.http.routers.alpha-motos.service=alpha-motos
        - traefik.http.services.alpha-motos.loadbalancer.server.port=80

networks:
  network_swarm_public:
    external: true
```

## Comandos Úteis

```bash
# Build local
./build-docker.sh

# Ver logs
docker service logs alpha-motos-crm_alpha-motos-crm -f

# Status
docker service ls

# Update manual
docker service update --image gustacg/alpha-motos-crm:latest alpha-motos-crm_alpha-motos-crm
```

## URLs

- 🌐 **Produção**: https://alphamotos.gustacg.com
- 🐳 **Docker Hub**: https://hub.docker.com/r/gustacg/alpha-motos-crm
- 🔧 **Supabase**: https://oyoelocsnouatoogkoyg.supabase.co

---
**Próximos passos**: Configurar secrets no GitHub → Push código → Deploy no Portainer
