# 🔍 DEBUG: 404 com Container Running

## ✅ **STATUS ATUAL**
- ✅ Container: **Running** (nginx estável)
- ✅ Logs: Sem crash, sem erros
- ✅ Build: Funcionando
- ❌ Domínio: 404 Not Found

## 🕵️ **POSSÍVEIS CAUSAS**

### **1. Let's Encrypt gerando certificado** ⏳
- Tempo: 5-15 minutos para primeira geração
- Status: Traefik pode retornar 404 durante este processo

### **2. Problema roteamento Traefik** 🔀
- Router não encontrando o service
- Conflito de nomes com outros services
- Middleware bloqueando

### **3. DNS ainda propagando** 🌐
- Mudança recente de DNS
- Cache DNS local

---

## 🧪 **TESTES DE DEBUG**

### **Teste 1: Acesso direto ao container**
```bash
# No servidor, testar o container diretamente:
curl -H "Host: alphamotos.gustacg.com" http://127.0.0.1:PORTA_CONTAINER/
```

### **Teste 2: Verificar Traefik routes**
```bash
# Ver routers ativos no Traefik:
curl http://127.0.0.1:8080/api/http/routers | grep alpha-motos
```

### **Teste 3: Status do certificado**  
```bash
# Verificar certificados Let's Encrypt:
docker exec traefik_container ls -la /data/acme.json
```

---

## ⚡ **SOLUÇÕES RÁPIDAS**

### **SOLUÇÃO 1: Aguardar Let's Encrypt** (10-15 min)
- Primeira vez pode demorar
- Let's Encrypt precisa validar domínio
- Aguardar sem fazer mudanças

### **SOLUÇÃO 2: Testar HTTP primeiro**
Adicionar rota HTTP na stack para testar:

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
        
        # HTTPS (principal)
        - traefik.http.routers.alpha-motos.rule=Host(\`alphamotos.gustacg.com\`)
        - traefik.http.routers.alpha-motos.entrypoints=websecure
        - traefik.http.routers.alpha-motos.tls.certresolver=letsencryptresolver
        - traefik.http.routers.alpha-motos.service=alpha-motos
        
        # HTTP (teste temporário)
        - traefik.http.routers.alpha-motos-http.rule=Host(\`alphamotos.gustacg.com\`)
        - traefik.http.routers.alpha-motos-http.entrypoints=web
        - traefik.http.routers.alpha-motos-http.service=alpha-motos
        
        # Service
        - traefik.http.services.alpha-motos.loadbalancer.server.port=80
        - traefik.http.services.alpha-motos.loadbalancer.passHostHeader=true

networks:
  network_swarm_public:
    external: true
    name: network_swarm_public
```

### **SOLUÇÃO 3: Verificar conflitos de nome**
Mudar nome do router para evitar conflitos:

```yaml
# Trocar 'alpha-motos' por 'alphamotos' (sem hífen)
- traefik.http.routers.alphamotos.rule=Host(\`alphamotos.gustacg.com\`)
- traefik.http.routers.alphamotos.entrypoints=websecure
- traefik.http.routers.alphamotos.tls.certresolver=letsencryptresolver
- traefik.http.routers.alphamotos.service=alphamotos
- traefik.http.services.alphamotos.loadbalancer.server.port=80
```

---

## 🎯 **DIAGNÓSTICO RÁPIDO**

Execute no servidor:

```bash
# 1. Verificar se container responde
docker ps | grep alpha-motos
CONTAINER_ID=$(docker ps --format "table {{.ID}}\t{{.Names}}" | grep alpha-motos | cut -d' ' -f1)
docker exec $CONTAINER_ID curl -I http://localhost:80/

# 2. Verificar routers Traefik  
curl -s http://localhost:8080/api/http/routers | grep -A 10 -B 2 alpha-motos

# 3. Testar DNS
nslookup alphamotos.gustacg.com

# 4. Teste HTTP direto
curl -v http://alphamotos.gustacg.com
```

---

## 📞 **NEXT STEPS**

1. **Aguarde 10-15 minutos** (Let's Encrypt)
2. **Teste HTTP**: http://alphamotos.gustacg.com
3. Se HTTP funcionar = problema é só certificado
4. Se HTTP também der 404 = problema no Traefik routing

**Me mande o resultado dos testes para diagnóstico preciso!**
