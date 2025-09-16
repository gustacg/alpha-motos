# 🌐 Configuração Cloudflare para Alpha Motos CRM

## ⚡ Configurações Obrigatórias

### 1. 🔒 SSL/TLS Settings
**Caminho**: `SSL/TLS` → `Overview`

```
🔧 Encryption Mode: Full (strict)
```
- ✅ **Full (strict)**: Cloudflare ↔ Origem com SSL válido
- ❌ **Flexible**: Causa problemas de SSL mixed content
- ❌ **Full**: Aceita SSL auto-assinado (não recomendado)

### 2. 🔐 Edge Certificates
**Caminho**: `SSL/TLS` → `Edge Certificates`

```
✅ Always Use HTTPS: ON
✅ HTTP Strict Transport Security (HSTS): ON
✅ Minimum TLS Version: 1.2
✅ Opportunistic Encryption: ON
✅ TLS 1.3: ON
```

### 3. 🎯 DNS Settings
**Caminho**: `DNS` → `Records`

```
Type: A
Name: alphamotos
Content: [IP_DO_SEU_SERVIDOR]
Proxy status: 🟠 Proxied (orange cloud)
TTL: Auto
```

### 4. 🚦 Page Rules (Opcional)
**Caminho**: `Rules` → `Page Rules`

```
URL: alphamotos.gustacg.com/*
Settings:
- Always Use HTTPS: ON
- Browser Cache TTL: 4 hours
- Security Level: Medium
```

## 🔧 Configurações Avançadas

### 5. ⚡ Speed Settings
**Caminho**: `Speed` → `Optimization`

```
✅ Auto Minify: JavaScript, CSS, HTML
✅ Brotli: ON
✅ Early Hints: ON
```

### 6. 🛡️ Security Settings
**Caminho**: `Security` → `Settings`

```
🔧 Security Level: Medium
✅ Bot Fight Mode: ON
❌ Under Attack Mode: OFF (use only when needed)
```

### 7. 🌍 Network Settings
**Caminho**: `Network`

```
✅ HTTP/2: ON
✅ HTTP/3 (with QUIC): ON
✅ 0-RTT Connection Resumption: ON
✅ IPv6 Compatibility: ON
```

## 🚨 Problemas Comuns

### ❌ "NET::ERR_CERT_COMMON_NAME_INVALID"
**Solução**: 
1. SSL mode = `Full (strict)`
2. Aguardar propagação do certificado (até 24h)
3. Limpar cache do browser (Ctrl+Shift+R)

### ❌ "Too Many Redirects"
**Solução**:
1. SSL mode = `Full (strict)` (não Flexible)
2. Verificar se o Traefik tem redirect HTTP→HTTPS
3. Desabilitar `Always Use HTTPS` temporariamente

### ❌ "404 Not Found" com HTTPS OK
**Solução**:
1. Verificar se o container está rodando
2. Testar conexão direta: `http://IP_SERVIDOR`
3. Verificar logs: `docker service logs alpha-motos-crm_alpha-motos-crm`

### ❌ CSS/JS não carregam
**Solução**:
1. Verificar Content-Type headers
2. Desabilitar `Auto Minify` temporariamente
3. Verificar CORS settings

## ✅ Verificação Final

### 1. 🧪 Testes de Conectividade
```bash
# Teste DNS
nslookup alphamotos.gustacg.com

# Teste SSL
curl -I https://alphamotos.gustacg.com

# Teste completo
curl -L https://alphamotos.gustacg.com
```

### 2. 🔍 Ferramentas Online
- **SSL Test**: https://www.ssllabs.com/ssltest/
- **DNS Check**: https://www.whatsmydns.net/
- **Speed Test**: https://gtmetrix.com/

### 3. 📱 Browser DevTools
```
F12 → Network → Reload (Ctrl+Shift+R)
Verificar:
✅ Status 200 para index.html
✅ Assets carregando corretamente
✅ Nenhum erro SSL/Mixed Content
```

## 📞 Troubleshooting

### Se ainda houver problemas:

1. **Pause Cloudflare** (temporariamente):
   - DNS → Record → Click no ☁️ orange → Gray cloud ☁️
   - Teste direto: `https://alphamotos.gustacg.com`

2. **Verificar Origin Server**:
   - Teste: `http://IP_DO_SERVIDOR`
   - Logs: `docker service logs nome-do-service`

3. **Cache Clear**:
   - Cloudflare: `Caching` → `Purge Everything`
   - Browser: Ctrl+Shift+R

---

## ⚡ Quick Fix Commands

```bash
# Forçar SSL Strict
curl -X PATCH "https://api.cloudflare.com/client/v4/zones/ZONE_ID/settings/ssl" \
  -H "X-Auth-Email: YOUR_EMAIL" \
  -H "X-Auth-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  --data '{"value":"strict"}'

# Limpar cache
curl -X POST "https://api.cloudflare.com/client/v4/zones/ZONE_ID/purge_cache" \
  -H "X-Auth-Email: YOUR_EMAIL" \
  -H "X-Auth-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
```

**Domain**: `alphamotos.gustacg.com`  
**Expected Result**: ✅ Green lock + App loading correctly
