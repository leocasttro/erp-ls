# 🚀 ERP Dinâmico (Metadata-Driven Engine)

Bem-vindo ao **ERP Engine**, uma plataforma de gestão empresarial construída com uma arquitetura 100% genérica e baseada em metadados (No-Code/Low-Code approach). 

Em vez de criar tabelas e telas físicas para cada módulo (Vendas, RH, Financeiro), este motor lê um arquivo JSON (metadados) no banco de dados e **constrói o banco, os formulários, as grids e os relacionamentos dinamicamente em tempo de execução.**

---

## 🛠️ Tecnologias Utilizadas

* **Backend:** Node.js, NestJS, TypeORM, PostgreSQL (JSONB).
* **Frontend:** React, Vite, TailwindCSS, Lucide Icons.
* **Padrões de Arquitetura:** Clean Architecture, Event-Driven Architecture (EventBus/PubSub), Metadata-driven UI.

---

## ⚙️ Pré-requisitos

* **Node.js:** Versão 20.19+ ou 22.12+ (Exigido pelo Vite).
* **PostgreSQL:** Rodando na porta 5432 (pode ser via Docker).

---

## 🚀 Como Iniciar o Projeto

O projeto está dividido em duas pastas principais: `backend` e `frontend`. Você precisará de **dois terminais** abertos.

### 1. Iniciando o Banco de Dados (PostgreSQL)
Certifique-se de que você tem um banco de dados Postgres rodando com as seguintes credenciais padrão (configuradas no `backend/.env`):
* **Host:** localhost
* **Porta:** 5432
* **Usuário:** postgres
* **Senha:** postgres
* **Banco:** erp-ls

*(Se usar Docker, rode: `docker run --name erp-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=erp-ls -p 5432:5432 -d postgres`)*

### 2. Iniciando o Backend (NestJS)
Abra um terminal na raiz do projeto e execute:
```bash
cd backend
npm install
npm run start:dev
```
O servidor iniciará em `http://localhost:3000`.

### 3. Iniciando o Frontend (React/Vite)
Abra um segundo terminal na raiz do projeto e execute:
```bash
cd frontend
npm install
npm run dev
```
O frontend iniciará em `http://localhost:5173`. Acesse esta URL no seu navegador.

---

## 🧠 Conceitos da Arquitetura (O que você pode fazer?)

### 1. Entidades Dinâmicas (JSONB)
Nenhuma tabela física é criada para módulos de negócios. Tudo é armazenado na tabela genérica `dynamic_records` na coluna de dados `JSONB`. Isso permite adicionar e remover campos instantaneamente sem migrações (Migrations) de banco de dados.

### 2. Sub-Grids (Mestre-Detalhe)
Ao definir um campo do tipo `GRID` nos metadados, o Front-end automaticamente desenha uma tabela editável dentro do formulário. Ideal para itens de Pedido de Venda, dependentes de um Funcionário, etc.

### 3. Auto-Fill (Preenchimento Relacional)
Campos do tipo `REFERENCE` suportam uma diretiva chamada `fillFields`. Exemplo: Ao selecionar um Produto, o motor puxa automaticamente o `preco` do produto e preenche o campo `valor_unit` da tela atual.

### 4. Fórmulas em Tempo Real
Campos com `"isCalculated": true` e `"formulaExpression": "..."` são calculados ao vivo na tela pelo React, reagindo instantaneamente a mudanças em outros campos (Ex: `Total = Qtd * Valor Unitário`).

### 5. Gatilhos de Negócio (EventBus)
O motor central de gravação é "burro". Mas ele emite eventos assíncronos (`record.created`, `record.updated`). Você pode programar módulos especialistas isolados no Backend (Ex: `StockModule`) para ouvir a venda e dar baixa no estoque, mantendo a arquitetura limpa (Clean Architecture).

### 6. Workflow e Trava de Estados
No fluxo de salvamento, o backend valida estados. Se um pedido possuir `status: FATURADO`, o backend rejeita alterações com erro 400 (Bad Request), blindando o ERP contra fraudes.

---

## 🔑 Informações de Acesso Padrão (Ambiente de Teste)
* **Tenant ID (Inquilino Padrão):** `550e8400-e29b-41d4-a716-446655440000` (Enviado via header `x-tenant-id` para suportar Multi-Tenancy nativo).
* **API URL:** `/api/v1`

---
*Desenvolvido para ser o motor No-Code base de sistemas corporativos escaláveis.*
