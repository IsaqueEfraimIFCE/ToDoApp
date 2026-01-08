# ToDoApp - EngSoftware - Arquiteturas de Frontend e Backend
Autores: Yasmim Rodrigues, Miller Monteiro, Isaque Oliveira e Kevin Valentim.

Este repositorio contem tres implementacoes React (MVC, MVP e MVVM) usando um backend local unico com dois modos:
- REST (pull) para atualizacao manual.
- Realtime (push) com SSE para atualizacao automatica.

## Estrutura do repositorio

```
/EngSoftware-trabalho
|-- /apps
|   |-- /mvc
|   |-- /mvp
|   `-- /mvvm
|-- /backend
|-- /evidencias
|-- /relatorio
|-- README.md
```

## Backend local (REST + Realtime)

- Base: Express + SSE.
- REST: `GET /todos`, `POST /todos`, `DELETE /todos/:id`.
- Realtime: `GET /todos/events/stream` (Server-Sent Events).
- Variavel: `VITE_API_URL` (padrao `http://localhost:4000`).

### Backend local (estrutura)

```
backend/local/
  src/
    app.js
    server.js
    routes/
      todos.js
    services/
      todoService.js
    store/
      memoryStore.js
    realtime/
      sseHub.js
    middleware/
      errorHandlers.js
  package.json
  Dockerfile
```

## Como executar (dev)

Cada app fica em `apps/<arquitetura>`:

```bash
cd apps/mvc   # ou apps/mvp, apps/mvvm
cp .env.example .env  # VITE_API_URL=http://localhost:4000
npm install
npm run dev
```

Em outra aba, rode o backend local:

```bash
cd backend/local
npm install
npm start
```

## Docker / Docker Compose

Suba backend + tres frontends:

```bash
cp .env.docker.example .env
# VITE_API_URL=http://localhost:4000

docker compose up --build
```

URLs:
- MVC: http://localhost:4173
- MVP: http://localhost:4174
- MVVM: http://localhost:4175

## Estrutura dos apps

Cada app segue a mesma organizacao:

```
src/
  domain/       -> tipos do dominio (ToDo)
  api/          -> contrato e gateways REST/Realtime + factory
  ui/           -> componentes visuais
  mvc|mvp|mvvm/  -> logica especifica da arquitetura
  App.tsx       -> composicao da View
  main.tsx      -> bootstrap React
```

## Camada de backend (frontend)

- `api/types.ts`: contrato `TodoGateway` e `BackendMode` (`rest` | `realtime`).
- `api/apiClient.ts`: resolve `VITE_API_URL`.
- `api/restTodoGateway.ts`: chamadas HTTP; estado muda no `list()`.
- `api/realtimeTodoGateway.ts`: usa SSE e chama `list()` ao receber eventos.
- `api/todoGatewayFactory.ts`: seleciona gateway por modo.

## MVC / MVP / MVVM

- MVC: `apps/mvc/src/mvc/*` 
- MVP: `apps/mvp/src/mvp/*` 
- MVVM: `apps/mvvm/src/mvvm/*` 


## Evidencias e entrega
- `relatorio/relatorio.md`
- `evidencias/apresentacao.mp4`
- `evidencias/mvcIDE.jpg`
- `evidencias/mvpIDE.jpg`
- `evidencias/mvvmIDE.jpg`
- `evidencias/reativoIDE.jpg`

