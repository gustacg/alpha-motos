# 🚀 Guia de Deploy - Alpha Motos CRM

## 📋 Visão Geral

Este documento descreve o processo completo para fazer deploy do sistema Alpha Motos CRM usando Docker, GitHub Actions, Docker Hub e Portainer com Traefik.

## 🏗️ Arquitetura

- **Frontend**: React + Vite + TypeScript
- **UI**: Shadcn/UI + Tailwind CSS
- **Backend**: Supabase (Database + Auth)
- **Deploy**: Docker + Portainer + Traefik
- **CI/CD**: GitHub Actions
- **Registry**: Docker Hub

## 🔧 Configurações Necessárias

### 1. Dependências do Projeto

```json
{
  "supabase": "^2.57.4",
  "react": "^18.3.1",
  "vite": "^5.4.19",
  "typescript": "^5.8.3"
}
```

### 2. Configuração do Supabase

**URL**: `https://oyoelocsnouatoogkoyg.supabase.co`
**Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95b2Vsb2Nzbm91YXRvb2drb3lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NjMyOTEsImV4cCI6MjA3MzUzOTI5MX0.5sZ6_Hr9HWDXOAnPQ8NxwLaNp_V7ctWmsW1-CXAnGuo`

### 3. Variáveis de Ambiente

O projeto não usa variáveis de ambiente sensíveis, pois as configurações do Supabase estão hardcoded no cliente (chave pública apenas).

## 🐳 Docker Setup

### Dockerfile
- **Build stage**: Node.js 18 Alpine
- **Production stage**: Nginx Alpine
- **Port**: 80
- **Features**: Gzip, Security Headers, SPA Routing

### Comandos Docker Locais

```bash
# Build da imagem
docker build -t gustacg/alpha-motos-crm:latest .

# Executar localmente
docker run -p 8080:80 gustacg/alpha-motos-crm:latest

# Push para Docker Hub
docker push gustacg/alpha-motos-crm:latest
```

## 🤖 GitHub Actions

### Setup no GitHub

1. **Secrets necessários**:
   - `DOCKER_USERNAME`: gustacg
   - `DOCKER_PASSWORD`: [Token do Docker Hub]

2. **Trigger**:
   - Push para `main` ou `master`
   - Manual dispatch
   - Pull requests (apenas build, sem push)

3. **Output**:
   - Imagem: `docker.io/gustacg/alpha-motos-crm:latest`
   - Multi-platform: linux/amd64, linux/arm64

## 🐳 Portainer Deploy

### Stack Configuration

**Nome da Stack**: `alpha-motos-crm`

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
        - traefik.http.routers.alpha-motos.rule=Host(\`alphamotos.gustacg.com\`)
        - traefik.http.routers.alpha-motos.entrypoints=websecure
        - traefik.http.routers.alpha-motos.tls.certresolver=letsencryptresolver
        - traefik.http.routers.alpha-motos.service=alpha-motos
        - traefik.http.services.alpha-motos.loadbalancer.server.port=80

networks:
  network_swarm_public:
    external: true
```

## 🚀 Processo de Deploy

### Passo 1: Preparação do GitHub

```bash
# 1. Conectar ao GitHub (se ainda não conectou)
git remote add origin https://github.com/SEU-USUARIO/alpha-motos-crm.git

# 2. Fazer commit dos arquivos de configuração
git add .
git commit -m "feat: adicionar configurações de deploy"
git push origin main
```

### Passo 2: Configurar Secrets no GitHub

1. Acesse: `Settings > Secrets and variables > Actions`
2. Adicione:
   - `DOCKER_USERNAME`: gustacg
   - `DOCKER_PASSWORD`: [Seu token do Docker Hub]

### Passo 3: Deploy Automático

1. O GitHub Actions será acionado automaticamente
2. A imagem será buildada e enviada para o Docker Hub
3. Aguarde a conclusão (~5-10 minutos)

### Passo 4: Deploy no Portainer

1. Acesse seu Portainer
2. Vá em **Stacks**
3. Clique em **Add Stack**
4. Nome: `alpha-motos-crm`
5. Cole o conteúdo do arquivo `docker-compose.portainer.yml`
6. Clique em **Deploy the stack**

### Passo 5: Verificar DNS

Certifique-se de que o DNS `alphamotos.gustacg.com` está apontando para seu servidor.

## 🔍 Verificação e Monitoramento

### URLs para Teste

- **Produção**: https://alphamotos.gustacg.com
- **Health Check**: https://alphamotos.gustacg.com/robots.txt

### Comandos de Debug

```bash
# Ver logs do container
docker service logs alpha-motos-crm_alpha-motos-crm -f

# Status dos services
docker service ls

# Inspecionar o service
docker service inspect alpha-motos-crm_alpha-motos-crm
```

### Nginx Status Codes
- **200**: Aplicação funcionando
- **404**: Página não encontrada (normal para SPA)
- **502**: Container não está respondendo
- **503**: Service indisponível

## 🔄 Updates e Rollbacks

### Update da Aplicação

```bash
# 1. Fazer alterações no código
# 2. Commit e push
git add .
git commit -m "feat: nova funcionalidade"
git push origin main

# 3. Aguardar build automático
# 4. Redeploy no Portainer (pull nova imagem)
```

### Rollback Manual

```bash
# 1. No Portainer, editar a stack
# 2. Mudar a tag da imagem para versão anterior
# 3. Redeploy

# Ou via Docker CLI:
docker service update --image gustacg/alpha-motos-crm:SHA-ANTERIOR alpha-motos-crm_alpha-motos-crm
```

## 🛡️ Segurança

### Headers Implementados
- X-Frame-Options: SAMEORIGIN
- X-XSS-Protection: 1; mode=block
- X-Content-Type-Options: nosniff
- Content-Security-Policy configurado para Supabase

### HTTPS
- SSL automático via Let's Encrypt (Traefik)
- Redirect automático HTTP → HTTPS
- HSTS habilitado

## 🐛 Troubleshooting

### Problemas Comuns

1. **502 Bad Gateway**
   - Container não está executando
   - Porta incorreta no Traefik
   - Verificar: `docker service ls`

2. **SSL Certificate Error**
   - DNS não está propagado
   - Let's Encrypt rate limit
   - Verificar logs do Traefik

3. **Build Failed no GitHub**
   - Secrets do Docker Hub incorretos
   - Dockerfile com erro de sintaxe
   - Dependências com vulnerabilidades

4. **Supabase Connection Error**
   - URL/Key do Supabase incorretos
   - CORS não configurado
   - RLS policies restritivas

### Logs Importantes

```bash
# GitHub Actions
# Acesse: Actions tab no repositório

# Portainer
# Stacks > alpha-motos-crm > Logs

# Docker CLI
docker service logs alpha-motos-crm_alpha-motos-crm
```

## 📞 Suporte

Para problemas com:
- **GitHub Actions**: Verificar workflow file e secrets
- **Docker Build**: Verificar Dockerfile e dependências
- **Portainer**: Verificar stack configuration e networks
- **Traefik**: Verificar labels e DNS
- **Supabase**: Verificar console do Supabase e RLS policies

---

**Última atualização**: $(date)
**Domínio**: alphamotos.gustacg.com
**Imagem Docker**: docker.io/gustacg/alpha-motos-crm:latest
