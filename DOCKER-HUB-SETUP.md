# Docker Hub Setup - Alpha Motos CRM

## Configuração Necessária

### 1. **Secrets do GitHub**
Configure os seguintes secrets no GitHub:
- `DOCKER_USERNAME`: Seu usuário do Docker Hub
- `DOCKER_PASSWORD`: Token de acesso do Docker Hub (não a senha)

### 2. **Criar Token no Docker Hub**
1. Acesse: https://hub.docker.com/settings/security
2. Clique em "New Access Token"
3. Nome: `github-actions`
4. Permissões: `Read, Write, Delete`
5. Copie o token gerado

### 3. **Configurar Secrets no GitHub**
1. Vá em: Settings → Secrets and variables → Actions
2. Adicione:
   - `DOCKER_USERNAME`: `gustacg`
   - `DOCKER_PASSWORD`: `seu_token_aqui`

### 4. **Build Manual (Alternativo)**
Se preferir build manual:

```bash
# Login no Docker Hub
docker login

# Build local
docker build -t gustacg/alpha-motos-crm:latest .

# Push
docker push gustacg/alpha-motos-crm:latest
```

## Troubleshooting

### Erro: "push access denied"
- ✅ Verifique se está logado: `docker login`
- ✅ Verifique se o repositório existe no Docker Hub
- ✅ Use token em vez de senha

### Erro: "repository does not exist"
- ✅ Crie o repositório `alpha-motos-crm` no Docker Hub
- ✅ Verifique se o nome está correto: `gustacg/alpha-motos-crm`

### Build GitHub Actions
- ✅ Configure os secrets corretamente
- ✅ Verifique se o workflow está ativo
- ✅ Veja os logs em Actions → Build and Push Docker Image
