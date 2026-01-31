# Plano de Adoção de Ferramentas (Tool Adoption Plan)

## 1. Inventário de Ferramentas Disponíveis
Identificamos um conjunto de ferramentas poderosas que devem ser distribuídas estrategicamente entre os agentes:

| Namespace | Ferramentas | Descrição |
|-----------|-------------|-----------|
| `execute` | `runInTerminal` | Execução de comandos de shell/sistema. |
| `read` | `readFile`, `listDirectory` | Leitura de contexto do workspace. |
| `edit` | `createFile`, `editFiles` | Manipulação de arquivos. |
| `search` | `textSearch`, `fileSearch` | Busca e navegação no código. |
| `web` | `web_search`, `fetch_url` | Acesso à internet para documentação e pesquisa. |
| `playwright` | `openPage`, `click`, `screenshot`, etc. | Automação de navegador para testes e verificação visual. |
| `agent` | `agent` (ou `runSubagent`) | Delegação de tarefas para subagentes. |
| `todo` | `add`, `list`, `complete` | Gerenciamento de lista de tarefas e checklist. |

## 2. Matriz de Distribuição (Quem recebe o quê?)

### Grupo 1: Gestão & Orquestração
*Agentes:* **Orchestrator, Project Planner, Product Owner, Product Manager**

*   **Tools:** `read`, `search`, `web`, `todo`, `agent` (apenas Orchestrator).
*   **Caso de Uso:**
    *   `todo`: Project Planner cria a lista de tarefas inicial. Orchestrator marca como concluído conforme avança.
    *   `web`: Pesquisa de requisitos e competidores.

### Grupo 2: Desenvolvimento & Execução
*Agentes:* **Frontend, Backend, Mobile, Game, DevOps, Database**

*   **Tools:** `read`, `search`, `edit`, `execute`, `web`.
*   **Caso de Uso:**
    *   `web`: Consulta de documentação de bibliotecas (essencial para evitar alucinações de API).
    *   `execute`: Rodar builds, linters e scripts de migração.

### Grupo 3: Qualidade & Auditoria
*Agentes:* **QA Automation, Tester, Security Auditor, SEO Specialist, Performance Optimizer**

*   **Tools:** `read`, `search`, `edit`, `execute`, `web`, `playwright`, `todo`.
*   **Caso de Uso:**
    *   `playwright`: QA e Tester usam para criar e validar testes E2E reais. Security Auditor usa para varredura dinâmica (DAST light).
    *   `todo`: Checklist de auditoria ou plano de teste.

### Grupo 4: Análise & Legado
*Agentes:* **Explorer, Code Archaeologist, Debugger**

*   **Tools:** `read`, `search`, `web`, `execute`.
*   **Caso de Uso:**
    *   `web`: Pesquisar erros, stack traces e documentação de sistemas legados.

## 3. Plano de Ação (Próximos Passos)

1.  **Atualização de Templates (`packages/cp-toolkit/templates/agents/`)**:
    *   Iterar sobre cada arquivo `.agent.md`.
    *   Expandir o array `tools: [...]` com as novas ferramentas conforme a matriz acima.
    *   **Nota:** `playwright/*` deve ser adicionado explicitamente onde necessário.

2.  **Engenharia de Prompt (Instruções)**:
    *   Adicionar seções "Tool Strategy" nos arquivos markdown.
    *   Ensinar o **QA Engineer** a preferir `playwright` para validar UI.
    *   Ensinar o **Project Planner** a usar `todo` para estruturar o plano.
    *   Ensinar todos os devs a usar `web` antes de inventar código de bibliotecas desconhecidas.

---
**Status:** Plano definido. Aguardando execução.
