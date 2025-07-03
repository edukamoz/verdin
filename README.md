# Verdin - Gestor Financeiro Pessoal 💸

![Deploy Frontend](https://github.com/edukamoz/verdin/actions/workflows/deploy-pages.yml/badge.svg)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

> Status: Concluído ✔️

**Verdin** é uma aplicação Full Stack de gestão financeira pessoal, projetada para ajudar usuários a terem uma visão clara e controle total sobre suas receitas e despesas. O objetivo é fornecer uma ferramenta limpa, rápida e intuitiva, construída com tecnologias modernas e boas práticas de desenvolvimento, incluindo autenticação segura e uma API bem documentada.

---

### 📚 Índice

- [Demo ao Vivo](#-demo-ao-vivo)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Endpoints da API](#-endpoints-da-api)
- [Como Rodar Localmente](#-como-rodar-localmente)
- [Autor](#-autor)

---

### 🚀 Demo ao Vivo

- **Aplicação Frontend:** **[https://edukamoz.github.io/verdin/](https://edukamoz.github.io/verdin/)**
- **Documentação da API (Swagger):** **[https://verdin-api.onrender.com/api-docs](https://verdin-api.onrender.com/api-docs)**

---

### ✨ Funcionalidades

- ✅ **Autenticação de Usuários:** Sistema completo de Cadastro e Login com tokens JWT para segurança.
- ✅ **CRUD de Transações:** Crie, visualize e delete suas transações financeiras.
- ✅ **Painel Financeiro:** Resumo automático de receitas, despesas e saldo total.
- ✅ **API RESTful Segura:** Endpoints protegidos que garantem que cada usuário só acesse seus próprios dados.
- ✅ **Deploy Automatizado:** Pipeline de CI/CD com GitHub Actions para o frontend.

---

### 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando o que há de mais moderno no ecossistema JavaScript/TypeScript.

- **Backend:**

  - Node.js
  - Express.js
  - TypeScript
  - PostgreSQL (Banco de Dados)
  - JSON Web Token (JWT) para autenticação
  - Bcrypt.js para hashing de senhas
  - Swagger (swagger-jsdoc, swagger-ui-express) para documentação

- **Frontend:**

  - Vite (Ambiente de desenvolvimento)
  - TypeScript
  - HTML5 Semântico
  - CSS3 com Variáveis

- **Infraestrutura e Deploy:**
  - **Backend:** Render (Web Service + PostgreSQL)
  - **Frontend:** GitHub Pages
  - **CI/CD:** GitHub Actions

---

### 📁 Estrutura de Pastas

O projeto foi organizado em um monorepo com uma separação clara entre backend e frontend.

```
verdin/
├── .github/
│   └── workflows/
│       └── deploy-pages.yml      # Automação de deploy do frontend
├── backend/
│   ├── src/
│   │   ├── config/               # Conexão com DB
│   │   ├── controllers/          # Lógica de negócio
│   │   ├── docs/                 # Configuração do Swagger
│   │   ├── middlewares/          # Middleware de autenticação (JWT)
│   │   └── routes/               # Definição dos endpoints da API
│   ├── .env.example              # Exemplo de variáveis de ambiente
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── src/
    │   ├── api.ts                # Módulo de comunicação com a API
    │   ├── auth.ts               # Módulo de gerenciamento de token
    │   ├── main.ts               # Ponto de entrada e orquestrador
    │   └── ui.ts                 # Módulo de manipulação do DOM
    ├── .env.local.example        # Exemplo de variáveis de ambiente
    ├── index.html                # Estrutura principal da página
    └── vite.config.ts
```

---

### Endpoints da API

A API segue os padrões RESTful e possui duas coleções de rotas principais.

#### Rotas de Usuários (`/api/users`)

| Método HTTP | Endpoint    | Descrição                                    | Protegido? |
| :---------- | :---------- | :------------------------------------------- | :--------- |
| `POST`      | `/register` | Registra um novo usuário.                    | ❌ Não     |
| `POST`      | `/login`    | Autentica um usuário e retorna um token JWT. | ❌ Não     |

#### Rotas de Transações (`/api/transactions`)

| Método HTTP | Endpoint | Descrição                                      | Protegido? |
| :---------- | :------- | :--------------------------------------------- | :--------- |
| `GET`       | `/`      | Retorna todas as transações do usuário logado. | ✅ Sim     |
| `POST`      | `/`      | Cria uma nova transação para o usuário logado. | ✅ Sim     |
| `DELETE`    | `/:id`   | Deleta uma transação específica pelo ID.       | ✅ Sim     |

---

### ⚙️ Como Rodar Localmente

Siga os passos abaixo para executar o projeto na sua máquina.

**Pré-requisitos:**

- [Node.js](https://nodejs.org/en/) (versão 20.x ou superior)
- [Git](https://git-scm.com/)
- Um banco de dados PostgreSQL rodando localmente ou na nuvem.

**1. Clone o repositório:**

```bash
git clone [https://github.com/edukamoz/verdin.git](https://github.com/edukamoz/verdin.git)
cd verdin
```

**2. Configure o Backend:**

```bash
# Navegue para a pasta do backend
cd backend

# Crie seu arquivo de ambiente a partir do exemplo
# Preencha com os dados do seu banco e um JWT_SECRET
cp .env.example .env

# Instale as dependências
npm install

# Rode o script para criar as tabelas no banco
# (só precisa rodar uma vez)
npx tsx setupDatabase.ts

# Inicie o servidor de desenvolvimento
npm run dev
```

> O backend estará rodando em `http://localhost:3001`.

**3. Configure o Frontend:**

```bash
# Em um novo terminal, navegue para a pasta do frontend
cd frontend

# Crie seu arquivo de ambiente a partir do exemplo
# Garanta que VITE_API_URL aponta para a API do backend
cp .env.local.example .env.local

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

> O frontend estará disponível em `http://localhost:5173` (ou outra porta indicada pelo Vite).

---

### 👨‍💻 Autor

Feito com ❤️ por **Eduardo Kamo**.

- **GitHub:** [@edukamoz](https://github.com/edukamoz)
- **LinkedIn:** [Eduardo Kamo](https://www.linkedin.com/in/eduardo-kamo/)
