# Troubleshooting - Domínio Vazio

## Problema: Domínio não carrega nada (página em branco)

### 🔍 **Diagnóstico Passo a Passo**

#### 1. **Verificar Container**
```bash
# Execute o script de diagnóstico
.\debug-container.bat
```

#### 2. **Verificar Build Local**
```bash
# Teste local primeiro
.\test-local.bat
```

#### 3. **Possíveis Causas**

**A) CSP Muito Restritivo**
- ✅ **Solução**: Usar `nginx-PERMISSIVO.conf`
- ✅ **Aplicado**: Dockerfile atualizado

**B) Arquivos não Copiados**
- ✅ **Verificar**: `docker run --rm gustacg/alpha-motos-crm:latest ls -la /usr/share/nginx/html/`
- ✅ **Deve mostrar**: `index.html`, `assets/`, etc.

**C) Problema no Build**
- ✅ **Verificar**: `npm run build` local
- ✅ **Deve criar**: pasta `dist/` com arquivos

**D) Traefik não Roteando**
- ✅ **Verificar**: Dashboard do Traefik
- ✅ **Verificar**: DNS do domínio

### 🚀 **Soluções Aplicadas**

#### 1. **Nginx Mais Permissivo**
- ✅ CSP relaxado para desenvolvimento
- ✅ Headers de segurança mantidos
- ✅ SPA routing corrigido

#### 2. **Scripts de Diagnóstico**
- ✅ `debug-container.bat` - Diagnóstico completo
- ✅ `test-local.bat` - Teste local

#### 3. **Dockerfile Atualizado**
- ✅ Usa `nginx-PERMISSIVO.conf`
- ✅ Verificação de arquivos
- ✅ Health check

### 📋 **Checklist de Verificação**

#### No Container:
- [ ] `index.html` existe em `/usr/share/nginx/html/`
- [ ] Pasta `assets/` existe
- [ ] Arquivos `.js` e `.css` existem
- [ ] Health check responde: `curl localhost/health`

#### No Traefik:
- [ ] Router configurado corretamente
- [ ] Service apontando para porta 80
- [ ] TLS funcionando
- [ ] Domínio resolvendo

#### No Build:
- [ ] `npm run build` funciona localmente
- [ ] Pasta `dist/` é criada
- [ ] `index.html` tem conteúdo válido

### 🔧 **Comandos de Debug**

```bash
# 1. Verificar container
docker run --rm gustacg/alpha-motos-crm:latest ls -la /usr/share/nginx/html/

# 2. Verificar index.html
docker run --rm gustacg/alpha-motos-crm:latest cat /usr/share/nginx/html/index.html

# 3. Testar health check
docker run --rm gustacg/alpha-motos-crm:latest curl -f http://localhost/health

# 4. Testar página principal
docker run --rm gustacg/alpha-motos-crm:latest curl -I http://localhost/

# 5. Verificar nginx config
docker run --rm gustacg/alpha-motos-crm:latest cat /etc/nginx/conf.d/default.conf
```

### 🎯 **Próximos Passos**

1. **Execute**: `.\debug-container.bat`
2. **Se arquivos estão OK**: Problema no Traefik
3. **Se arquivos estão faltando**: Problema no build
4. **Rebuild**: Use a nova configuração nginx
5. **Teste**: Acesse o domínio novamente

### ⚠️ **Problemas Comuns**

**Página em branco + Console vazio**: CSP bloqueando scripts
**Página em branco + Erro 404**: Arquivos não copiados
**Página em branco + Erro 500**: Problema no nginx config
**Página em branco + Timeout**: Problema no Traefik
