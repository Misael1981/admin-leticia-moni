# Módulo Financeiro - Contexto

## Stack

- Next.js + TypeScript + Prisma + Neon + shadcn/ui
- Monorepo: 3 apps (admin, patient, landing) + package shared (`@misael1981/physio-database`)

## Modelos principais

- `Patient` — tem `billingMode` (PER_SESSION | ACCUMULATED), `billingDay`, `defaultSessionPrice`
- `Evolution` — consulta clínica. Tem `pricePerSession`, `isReturn`. **Imutável.**
- `ChargeItem` — item de cobrança. 1:1 com Evolution. `chargeId` vincula à Charge.
- `Charge` — fatura. Tem `status` (OPEN | PAID | CANCELED | OVERDUE), `subtotal`, `discount`, `total`, `paidAmount`, `dueDate`, `paidAt`.

## Regras de negócio

- **PER_SESSION:** paciente paga por consulta. `Charge` criada junto com a Evolution (1 item = 1 Charge).
- **ACCUMULATED:** paciente acumula consultas e paga no dia do recebimento. `Charge` criada no fechamento.
- **isReturn:** consulta de retorno = não cobra. `ChargeItem.amount = 0`. **Não cria Charge.**
- **OVERDUE:** derivado (`dueDate < hoje` + não 100% pago). Não persiste no banco.
- **PAID:** derivado (`paidAmount >= total`). Persiste no banco.
- **CANCELED:** ação manual (botão separado). Não é regra de negócio, é erro/ajuste.
- **PARTIAL:** não é status. É `paidAmount > 0 && < total`. O status fica `OPEN`.

## Padrões do projeto

- **`serialize()`** — toda query/action que retorna Prisma pra Client, serializa.
- **Zod** valida só o que o cliente controla. IDs vão direto no submit (fora do schema).
- **`deriveChargeStatus()`** — helper em `helpers/charge-helpers.ts`. Reusado na query e na action.
- **Actions** — 5 passos: Auth → Zod → Busca banco → Valida negócio → Atualiza → Revalida.

## O que ficou pendente

- [ ] Action de cancelamento (`cancelChargeAction`) + modal de confirmação
- [ ] Backfill dos ChargeItems órfãos (sem Charge)
- [ ] Módulo `ACCUMULATED` (fechamento de mês)
- [ ] Tela de relatórios
- [ ] `npm audit` (14 vulnerabilidades, 1 crítica)
