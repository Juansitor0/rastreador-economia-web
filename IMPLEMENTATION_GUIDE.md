# Guia de Implementação - Rastreador de Economia Multi-usuário

## 📋 Visão Geral

Este documento descreve as melhorias implementadas e as próximas etapas para transformar o Rastreador de Economia em uma aplicação profissional, robusta e multi-usuário.

## ✅ Implementações Concluídas

### 1. Arquitetura de Backend (Node.js/Express)

A estrutura do backend foi criada com a seguinte organização:

- **`server/index.ts`**: Arquivo principal do servidor com configuração de rotas e middlewares
- **`server/services/`**: Serviços de lógica de negócio
  - `database.ts`: Gerenciamento de dados em memória (será substituído por banco de dados real)
  - `auth.ts`: Autenticação com JWT e hashing de senhas
- **`server/middleware/`**: Middlewares Express
  - `auth.ts`: Validação de tokens JWT
  - `errorHandler.ts`: Tratamento centralizado de erros
- **`server/routes/`**: Rotas da API
  - `auth.ts`: Endpoints de registro e login
  - `financial.ts`: Endpoints de perfil financeiro e transações
- **`server/schemas/`**: Validação de dados com Zod
  - `auth.ts`: Schemas para registro e login
  - `financial.ts`: Schemas para transações e perfil financeiro

### 2. Autenticação Segura

- **JWT (JSON Web Tokens)**: Implementado para autenticação stateless
- **Hashing de Senhas**: Uso de bcryptjs para armazenar senhas de forma segura
- **Middleware de Autenticação**: Proteção de rotas que requerem autenticação
- **Validação de Entrada**: Schemas Zod para validar dados de entrada

### 3. Separação de Dados por Usuário

Cada usuário tem:
- Um perfil financeiro isolado
- Transações isoladas
- Dados de salário isolados
- Metas isoladas

Todos os dados são armazenados no backend e associados ao `user_id`, garantindo total isolamento entre usuários.

### 4. Hooks React Modernos

- **`useApi.ts`**: Hook genérico para fazer requisições HTTP com autenticação
- **`useSavings.ts`**: Hook para gerenciar dados financeiros (perfil, transações, cálculos)
- **`AuthContextNew.tsx`**: Contexto de autenticação integrado com o backend

### 5. Componentes de Autenticação Melhorados

- **`LoginNew.tsx`**: Página de login/registro com validação robusta e feedback visual

## 🚀 Próximas Etapas

### Fase 1: Integração Frontend-Backend

1. **Atualizar `App.tsx`** para usar o novo `AuthContextNew` em vez do `AuthContext` antigo
2. **Atualizar `Home.tsx`** para usar o hook `useSavings` em vez de `useLocalStorage`
3. **Atualizar componentes de transações** para consumir dados do backend
4. **Remover dependência de `localStorage`** para dados financeiros (manter apenas para preferências locais)

### Fase 2: Integração com API da Tabela FIPE

1. **Criar endpoint proxy** no backend (`server/routes/fipe.ts`) para consumir a API da Tabela FIPE
2. **Implementar cache** de respostas da FIPE para otimizar desempenho
3. **Criar componentes** de seleção em cascata (Marca → Modelo → Ano → Preço)
4. **Integrar preço da FIPE** como meta automática

### Fase 3: Motor de Cálculos Financeiros

1. **Refatorar `InstallmentCalculator.tsx`** para incluir três abas:
   - **Compra à Vista**: Projeção baseada em média de depósitos
   - **Financiamento**: Cálculo com juros compostos (Tabela Price)
   - **Consórcio**: Simulação com taxa de administração

2. **Implementar funções de cálculo** no backend (`server/services/calculator.ts`)

### Fase 4: Custo Real de Aquisição

1. **Adicionar campos** para custos periféricos:
   - Emplacamento e transferência (DETRAN)
   - Seguro inicial
   - Equipamentos essenciais (capacete, jaqueta, cadeado)

2. **Criar modal** para seleção de custos adicionais

### Fase 5: Polimento Visual e Segurança

1. **Modo Privado**: Botão para ocultar saldos e transações
2. **Formatação de Moeda**: Garantir formatação correta em toda a aplicação
3. **Backup e Portabilidade**: Funcionalidades de exportar/importar dados
4. **Responsividade**: Testar em dispositivos móveis

### Fase 6: Banco de Dados Real

1. **Substituir in-memory database** por PostgreSQL ou MySQL
2. **Criar migrations** para estrutura de tabelas
3. **Implementar connection pooling**
4. **Adicionar índices** para otimizar queries

## 📊 Estrutura de Dados

### Tabela `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela `financial_profiles`
```sql
CREATE TABLE financial_profiles (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  target_amount DECIMAL(12, 2),
  initial_balance DECIMAL(12, 2),
  monthly_deposit_may DECIMAL(12, 2),
  monthly_deposit_sep DECIMAL(12, 2),
  base_salary DECIMAL(12, 2),
  thirteenth_month DECIMAL(12, 2),
  ppr DECIMAL(12, 2),
  bonuses DECIMAL(12, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela `transactions`
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  financial_profile_id UUID NOT NULL REFERENCES financial_profiles(id),
  description VARCHAR(255),
  amount DECIMAL(12, 2) NOT NULL,
  type ENUM('deposit', 'withdrawal') NOT NULL,
  date DATE NOT NULL,
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔒 Segurança

- **HTTPS**: Usar em produção
- **CORS**: Configurado para aceitar requisições do frontend
- **JWT Secret**: Mudar em produção via variável de ambiente
- **Rate Limiting**: Implementar em produção
- **Validação de Input**: Todos os inputs são validados com Zod
- **Sanitização**: Implementar sanitização adicional se necessário

## 🧪 Testes

Recomenda-se implementar:
- Testes unitários para serviços de autenticação e cálculos
- Testes de integração para rotas da API
- Testes E2E para fluxos completos de usuário

## 📝 Variáveis de Ambiente

### Frontend (`.env`)
```
VITE_API_URL=http://localhost:3001/api
```

### Backend (`.env`)
```
JWT_SECRET=your-secret-key-change-in-production
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/rastreador_economia
```

## 🚢 Deploy

1. **Frontend**: Deploy em Vercel, Netlify ou similar
2. **Backend**: Deploy em Heroku, Railway, Render ou similar
3. **Banco de Dados**: Usar serviço gerenciado (AWS RDS, Railway, Supabase, etc.)

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação da API em `/api/docs` (se Swagger for implementado).

---

**Última atualização**: 02/06/2026
