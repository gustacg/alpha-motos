# Contexto do CRM - Sistema de Gestão de Leads

## Visão Geral
Este é um MVP de um CRM focado na gestão de leads para vendas de motocicletas com financiamento próprio (não bancário). O sistema utiliza uma pipeline em formato Kanban com funcionalidades completas de CRUD e gestão de informações detalhadas dos clientes.

## Estrutura do Sistema

### 1. Autenticação
- **Login único e simples** na página inicial
- **Não utiliza Supabase Auth** (para agilizar o MVP)
- Apenas validação básica de credenciais para acesso ao sistema

### 2. Pipeline Kanban
O CRM utiliza uma pipeline com as seguintes etapas (em ordem):
1. **Lead** - Primeiro contato
2. **Qualificado** - Lead validado
3. **Agendamento** - Visita agendada
4. **Não Comparecimento** - Faltou ao agendamento
5. **Contrato** - Contrato em andamento
6. **Cliente** - Venda finalizada
7. **Distrato** - Contrato cancelado
8. **Curioso** - Apenas interesse sem intenção de compra
9. **Descartado** - Lead sem potencial

### 3. Funcionalidades dos Cards
**Visualização nos Cards:**
- Nome do cliente
- Telefone
- Score (pontuação)
- Último interesse registrado

**Interações:**
- **Clique simples**: Abre modal com informações completas
- **Botão direito**: Menu para editar/excluir
- **Arrastar e soltar**: Move entre etapas da pipeline
- **Botão "Adicionar Lead"**: Cria novo lead

### 4. Informações Detalhadas do Cliente (Modal)

#### Dados Pessoais
- **Tipo**: Estágio atual na pipeline
- **Nome**: Nome completo
- **CPF**: Documento
- **Email**: E-mail de contato
- **Telefone**: Número principal
- **Endereço**: Endereço completo
- **Contato de Emergência**: Nome e número

#### Scoring
- **Pontuação**: X/100 (ex: 85/100)
- Representa a qualificação do lead

#### Histórico de Interesses
Lista cronológica com todos os interesses manifestados:
- Data do interesse
- Modelo da moto desejada
- Cor preferida
- Valor de interesse
- Observações específicas

#### Histórico Financeiro
Tentativas de financiamento próprio (não bancário):
- Data da tentativa
- Valor da entrada proposta
- Número de parcelas
- Valor total da moto
- Valor das parcelas
- Status da tentativa

#### Histórico de Processos
Análise de processos judiciais para qualificação:
- **Status**: Qualificado/Não Qualificado
- **Lista de Processos**:
  - Tipo de processo
  - Data do processo
  - Local/Comarca
  - Status atual
  - Observações

### 5. Funcionalidades de Busca e Filtros
- **Campo de busca**: Por nome, telefone ou CPF
- **Filtro por Score**: Range de pontuação
- **Filtro por Interesse**: Último interesse registrado
- **Filtros por etapa da pipeline**

### 6. Operações CRUD
- **Criar**: Botão "Adicionar Lead" (apenas nome e telefone obrigatórios)
- **Ler**: Visualização nos cards e modal detalhado
- **Editar**: Botão direito no card → Editar
- **Excluir**: Botão direito no card → Excluir

## Regras de Negócio

### Campos Obrigatórios
- **Nome**: Obrigatório para criação
- **Telefone**: Obrigatório para criação
- Demais campos são opcionais e preenchidos conforme necessário

### Movimentação na Pipeline
- Leads podem ser movidos entre qualquer etapa via drag & drop
- A movimentação deve atualizar automaticamente o "tipo" nos dados pessoais

### Dados Manuais
- Todas as informações são inseridas manualmente pela equipe
- Não há integrações automáticas com bancos de dados externos
- Foco na simplicidade e rapidez de uso

## Estrutura de Dados Sugerida

### Tabela: leads
```sql
- id (uuid, primary key)
- nome (text, required)
- telefone (text, required)
- email (text, optional)
- cpf (text, optional)
- endereco (text, optional)
- contato_emergencia_nome (text, optional)
- contato_emergencia_telefone (text, optional)
- score (integer, default: 0)
- tipo (text, default: 'lead') -- etapa da pipeline
- created_at (timestamp)
- updated_at (timestamp)
```

### Tabela: interesses
```sql
- id (uuid, primary key)
- lead_id (uuid, foreign key)
- data_interesse (date)
- modelo_moto (text)
- cor_preferida (text)
- valor_interesse (decimal)
- observacoes (text)
- created_at (timestamp)
```

### Tabela: tentativas_financiamento
```sql
- id (uuid, primary key)
- lead_id (uuid, foreign key)
- data_tentativa (date)
- valor_entrada (decimal)
- numero_parcelas (integer)
- valor_total_moto (decimal)
- valor_parcela (decimal)
- status (text)
- created_at (timestamp)
```

### Tabela: processos
```sql
- id (uuid, primary key)
- lead_id (uuid, foreign key)
- tipo_processo (text)
- data_processo (date)
- local_comarca (text)
- status_processo (text)
- observacoes (text)
- created_at (timestamp)
```

## Observações Importantes
- Design já existe, foco na funcionalidade
- Sistema pode ter páginas antigas que devem ser removidas/otimizadas
- Após login, o CRM deve ser a página principal
- Simplicidade é fundamental para adoção pela equipe
- MVP deve ser funcional e completo dentro do escopo definido