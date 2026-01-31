# Análise Técnica: Delegação via `runSubagent`

## 1. Contexto da Ferramenta
A ferramenta `runSubagent` (conforme documentação oficial do VS Code) permite que um agente "Host" (Orchestrator) delegue tarefas complexas para agentes "Guest" (Especialistas).

### Assinatura (Conforme Docs)
- Nome da Tool: `runSubagent`
- Prompting: O agente deve ser instruído no prompt (ex: "Run the research agent as a subagent...").

## 2. Análise de Comportamento (Constraints)
1.  **Stateless (Sem Memória):** O subagente nasce e morre na mesma execução. Ele **não** tem acesso ao histórico de conversa do Orchestrator, exceto o que for passado explicitamente no `prompt`.
2.  **Blind Execution (Execução Cega):** O subagente não sabe "quem" o chamou, nem o contexto global do projeto, a menos que informado.
3.  **Single Shot Result:** O retorno é uma única string (relatório, código ou resposta). Não há "bate-papo" de volta com o subagente.

## 3. Estratégia de Aplicação (The Core Plan)

Para aplicar adequadamente nas instruções (`orchestrator.md`), devemos adotar o padrão **"Context Injection"**:

### O Protocolo do Orchestrator
1.  **Gather (Coletar):** O Orchestrator deve primeiro ler `PLAN.md` ou arquivos de código relevantes *antes* de chamar o subagente.
2.  **Inject (Injetar):** No parâmetro `prompt`, o Orchestrator deve incluir:
    *   O objetivo específico ("Analise a segurança deste arquivo...").
    *   O contexto necessário ("...considerando que usamos Next.js App Router").
    *   **Snippet de código ou File Path**: "Leia o arquivo src/auth.ts...".
3.  **Synthesize (Sintetizar):** O Orchestrator recebe o output e decide o próximo passo.

## 4. Plano de Alterações nas Instruções

### A. Correção de Terminologia
- **Arquivo:** `.github/agents/orchestrator.md`
- **Problema:** Referencia "Claude Code's native Agent Tool" (incorreto).
- **Ação:** Substituir por referência explícita à tool `runSubagent`.

### B. Definição do Protocolo de Invocação
Inserir na documentação do Orchestrator a regra de ouro:
> "Never assume the subagent knows the context. Explicitly pass file paths, technology constraints, and snippets in the 'prompt' argument."

### C. Exemplos de Uso
Atualizar a seção "Native Agent Invocation Protocol" para demonstrar a chamada via tool, não via chat natural.

---
**Status:** Pronto para execução.
