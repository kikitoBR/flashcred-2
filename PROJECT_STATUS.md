# Status do Projeto FlashCred

## Estrutura do Projeto

O projeto foi reorganizado em uma arquitetura monorepo:

### `/client` (Frontend React)
- Contém toda a interface do usuário.
- **Configuração**: `vite.config.ts`.
- **API**: `src/services/api.ts` conecta com o backend.
- **Páginas**: `src/pages/Clients.tsx` (nova estrutura modular).
- **Contexto**: `src/context/AppContext.tsx` gerencia o estado global.

### `/server` (Backend Node.js/Express)
- **API Central**: Gerencia todas as requisições.
- **Banco de Dados**: Conecta ao MySQL (`src/database.ts`).
- **Multi-Tenant**: `src/middleware/tenant.ts` isola dados por subdomínio.
- **RPA**: `src/rpa/orchestrator.ts` centraliza a lógica dos robôs.
- **Arquivos Estáticos**: Serve o frontend compilado em produção.

## Banco de Dados
- Conectado ao Hostinger (`srv1194.hstgr.io`).
- Tabelas criadas: `tenants`, `users`, `clients`, `vehicles`, `bank_credentials`.

## Como Rodar

### Modo Desenvolvimento
Rodar terminais separados:
1. `cd client && npm run dev`
2. `cd server && npm run dev`

### Modo Produção (Hospedagem)
1. Build do Frontend: `cd client && npm run build`
2. Copiar dist: (Automático se configurado script, ou manual para `server/public`)
3. Iniciar Server: `cd server && npm start`
