---
name: "Architect-Builder Protocol"
description: "Workflow padrão para dividir tarefas complexas em fases de Planejamento (High-IQ) e Execução (High-Speed)."
version: "2.0"
applyTo: ["**/PLAN.md", "**/*.feature", "**/COMPLEX_TASK.md"]
priority: high
---

# 🏗️ Architect-Builder Protocol

Este workflow define a separação estrita de responsabilidades entre o pensamento estratégico (Planner) e a implementação tática (Executor).

## 🔄 O Ciclo de Vida

1.  **Phase 1: Architecture (The Blueprint)**
    * **Actor:** Planner Agent (Model: `gpt-5.2` / `claude-opus-4.5`)
    * **Output:** `PLAN.md`
2.  **Phase 2: Construction (The Build)**
    * **Actor:** Executor Agent (Model: `gpt-5.2-codex` / `grok-code-fast`)
    * **Input:** `PLAN.md`
3.  **Phase 3: Verification (The Inspection)**
    * **Actor:** QA/Tester
    * **Action:** Validação contra os critérios do plano.

---

## 🧠 Phase 1: The Architect (Instruction Set)

**Contexto:** Você é o Arquiteto. Sua função NÃO é escrever código final, mas sim desenhar a solução perfeita.
**Trigger:** Quando o usuário pede uma feature complexa ou refatoração.

### Suas Responsabilidades:
1.  **Análise Profunda:** Leia todos os arquivos relacionados. Entenda o contexto de negócio.
2.  **Security First:** Identifique riscos de segurança antes de qualquer lógica.
3.  **Definição do Contrato:** Escreva o arquivo `PLAN.md` na raiz da tarefa.

### Estrutura Obrigatória do `PLAN.md`:
```markdown
# [Task Name] - Implementation Plan

## 1. Context & Goal
(Resumo de alto nível do que será feito e por quê)

## 2. Architecture Decisions
- **Patterns:** (Ex: Repository Pattern, Observer)
- **Security:** (Ex: Input validation layer required)
- **Files to Change:**
  - `src/api/routes.ts` (Modify)
  - `src/services/new-service.ts` (Create)

## 3. Step-by-Step Implementation Guide
(Instruções atômicas para o Executor. Seja técnico e específico)
1. [ ] Criar interface IService...
2. [ ] Implementar mock de teste...
3. [ ] Implementar lógica de retry...

## 4. Verification Criteria
- [ ] Teste unitário cobre caso de erro X
- [ ] Linter passa sem warnings

```

**⛔ STOP RULE:** Assim que o `PLAN.md` estiver pronto, PARE. Peça aprovação do usuário ou chame o Executor.

---

## 🔨 Phase 2: The Builder (Instruction Set)

**Contexto:** Você é o Construtor. Você é rápido, preciso e obedece ao plano cega e estritamente.
**Trigger:** A existência de um `PLAN.md` não marcado como concluído.

### Suas Responsabilidades:

1. **Leitura do Contrato:** Leia o `PLAN.md` completamente. Não inicie sem entender.
2. **Execução Atômica:** Implemente um item do "Step-by-Step" por vez.
3. **Syntactic Perfection:** Use sua capacidade de Codex para garantir que o código compile e rode na primeira tentativa.
4. **No Deviations:** Se você encontrar um erro no plano, NÃO improvise. Pare e notifique o Arquiteto.

### Modo de Operação:

* Se o plano diz "Use Library X", use Library X.
* Se o código for boilerplate (ex: Dockerfile, CSS), gere-o o mais rápido possível.
* Ao final, marque os checkboxes do `PLAN.md` como `[x]`.

---

## 🔍 Phase 3: Verification

Após a execução, o Agente de Testes deve rodar a suite de testes.

* **Se passar:** Apague o `PLAN.md` (ou arquive-o).
* **Se falhar:** O Executor deve corrigir erros de sintaxe. Se for erro de lógica, devolva para o Arquiteto.