# CLAUDE.md

Este arquivo fornece orientações ao Claude Code (claude.ai/code) ao trabalhar com o código deste repositório.

## Comandos

```bash
npm start        # Inicia o servidor de desenvolvimento (http://localhost:3000/rmestetica)
npm run build    # Build de produção
npm test         # Executa os testes (modo interativo com watch)
npm test -- --watchAll=false  # Executa os testes uma única vez
```

## Arquitetura

Este é um SPA React 18 (Create React App) para o **RMEstética** — sistema de gestão de salão de beleza. A aplicação é servida sob o basename `/rmestetica`.

### Autenticação e Estado

Não há biblioteca de estado global (sem Redux/Context). O estado de autenticação vive inteiramente no `localStorage`:
- `TokenRm` — token JWT, enviado como header `Authorization: bearer <token>` em todas as chamadas à API
- `NomeRm` — nome de exibição do usuário logado
- `TipoRm` — nível de permissão (`1` = admin, demais = funcionário/cliente)
- `EstabelecimentoRm` — ID do estabelecimento selecionado (admin pode alternar entre estabelecimentos)

Todas as chamadas à API passam por `src/Utils/api.js`, uma instância axios apontando para `http://127.0.0.1:3333`. Cada requisição autenticada deve passar `{ headers: { Authorization: token } }` manualmente — não há interceptor axios configurado.

### Rotas

Dois níveis de acesso:
- **Rotas públicas** (`/`, `/agendamentos`, `/login`, `/register-user`, `/register-estabelecimento`) — sem autenticação
- **Rotas protegidas** (`/home/*`) — componente de layout `Home` envolve todas as páginas autenticadas via `<Outlet />`

Após o login: `nivel_permissao_id == 1` → `/home`, caso contrário → `/agendamentos`.

### Layout

`src/Pages/Home/index.js` é o shell autenticado: sidebar Ant Design recolhível + header com seletor de estabelecimento (apenas admin). Todas as páginas internas renderizam via `<Outlet />` na área de conteúdo.

### Estrutura das Páginas

Cada página em `src/Pages/` segue tipicamente este padrão:
- `index.js` — página principal com `Table` do Ant Design, controles de filtro e um gatilho de modal
- `components/Register.js` (ou similar) — componente de formulário renderizado dentro de um `Modal` do Ant Design para operações de criação/edição

As páginas chamam `carregarDados()` dentro do `useEffect` para buscar dados na montagem e após o fechamento do modal.

### Principais Bibliotecas

- **Ant Design (antd 5)** — UI principal: `Table`, `Modal`, `Form`, `Select`, `DatePicker`, `notification`, etc. Cor da marca: `#A9335D`
- **react-router-dom v6** — roteamento
- **axios** — cliente HTTP via `src/Utils/api.js`
- **sweetalert2** — usado em algumas páginas para diálogos de confirmação
- **chart.js / react-chartjs-2 / react-google-charts** — gráficos do Dashboard
- **@fullcalendar/react** — visualização de calendário (usado nos agendamentos)
- **cep-promise** — consulta de CEP para formulários de endereço

### Utilitários

`src/Utils/mascaras.js` exporta funções de máscara de input: `cpfMask`, `cepMask`, `moneyMask` — aplicadas via handlers `onChange` nos campos de entrada.
