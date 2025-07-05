<div align="center">
  <img src="./frontend/public/logo.svg" alt="Logo Verdin" width="120px" />
  <h1>Verdin - Gestor Financeiro Pessoal 💸</h1>
</div>

<div align="center">

![Deploy Frontend](https://github.com/edukamoz/verdin/actions/workflows/deploy-pages.yml/badge.svg)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Postgres](https://img.shields.io/badge/Postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)
![DBeaver](https://img.shields.io/badge/dbeaver-382923?style=for-the-badge&logo=dbeaver&logoColor=white)
![VSCode](https://img.shields.io/badge/VSCode-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

</div>

> **Status:** Projeto Concluído ✔️

**Verdin** é uma aplicação Full Stack de gestão financeira pessoal, projetada para ajudar usuários a terem uma visão clara e controle total sobre suas receitas e despesas. O projeto começa com uma landing page de apresentação e leva o usuário a um dashboard interativo e seguro após a autenticação.

O objetivo foi construir uma aplicação completa e robusta, utilizando tecnologias modernas, boas práticas de desenvolvimento, um fluxo de CI/CD para o frontend, e uma API RESTful bem documentada e segura.

---

### 📚 Índice

- [Demo ao Vivo](#-demo-ao-vivo)
- [Visualização do Projeto](#-visualização-do-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Endpoints da API](#-endpoints-da-api)
- [Como Rodar Localmente](#-como-rodar-localmente)
- [Autor](#-autor)

---

### 🚀 Demo ao Vivo

- **Aplicação Frontend:** **[https://edukamoz.github.io/verdin/](https://edukamoz.github.io/verdin/)**
- **Documentação da API (Swagger):** **[https://verdin-api.onrender.com/api-docs](https://verdin-api.onrender.com/api-docs)**

---

### 🖼️ Visualização do Projeto

**Landing Page**
![Landing Page do Verdin](/docs/images/landing-page.gif)

**Dashboard Principal**
![Dashboard do Verdin](/docs/images/dashboard.png)

**Pagina de autenticaçao**
![Modais do Verdin](/docs/images/auth.png)

---

### ✨ Funcionalidades

- ✅ **Landing Page:** Página de apresentação profissional para o projeto.
- ✅ **Roteamento no Frontend:** Navegação fluida entre as "páginas" (Landing, Autenticação, Dashboard) sem recarregar o site, usando um SPA (Single Page Application).
- ✅ **Autenticação de Usuários:** Sistema completo de Cadastro e Login com tokens **JWT** para segurança.
- ✅ **CRUD Completo de Transações:** Crie, visualize, **edite** e delete suas transações financeiras.
- ✅ **Gerenciamento de Conta:** Usuários podem deletar suas próprias contas de forma segura.
- ✅ **Painel Financeiro:** Resumo automático de receitas, despesas e saldo total.
- ✅ **Modais Interativos:** Experiência de usuário aprimorada com modais para sucesso, edição e confirmações de ações destrutivas.
- ✅ **API RESTful Segura:** Endpoints protegidos que garantem que cada usuário só acesse e modifique seus próprios dados.

---

### 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando o que há de mais moderno no ecossistema JavaScript/TypeScript.

- **Backend:**

  - Node.js com TypeScript
  - Express.js para o servidor e rotas
  - PostgreSQL como banco de dados
  - JSON Web Token (JWT) para autenticação
  - Bcrypt.js para hashing de senhas
  - Swagger (swagger-jsdoc, swagger-ui-express) para documentação de API

- **Frontend:**

  - Vite como ambiente de desenvolvimento e build
  - TypeScript
  - HTML5 Semântico
  - CSS3 com Variáveis (Dark Mode)

- **Infraestrutura e Deploy:**
  - **Backend:** Render (Web Service + PostgreSQL)
  - **Frontend:** GitHub Pages
  - **CI/CD:** GitHub Actions para deploy automatizado do frontend.

---

### 🛰️ Endpoints da API

A API segue os padrões RESTful. Todos os endpoints de transações e gerenciamento de conta são protegidos.

#### Rotas de Usuários (`/api/users`)

| Método HTTP | Endpoint    | Descrição                                           | Protegido? |
| :---------- | :---------- | :-------------------------------------------------- | :--------- |
| `POST`      | `/register` | Registra um novo usuário.                           | ❌ Não     |
| `POST`      | `/login`    | Autentica um usuário e retorna um token JWT.        | ❌ Não     |
| `DELETE`    | `/me`       | Deleta o usuário autenticado e todos os seus dados. | ✅ Sim     |

#### Rotas de Transações (`/api/transactions`)

| Método HTTP | Endpoint | Descrição                                      | Protegido? |
| :---------- | :------- | :--------------------------------------------- | :--------- |
| `GET`       | `/`      | Retorna todas as transações do usuário logado. | ✅ Sim     |
| `POST`      | `/`      | Cria uma nova transação para o usuário logado. | ✅ Sim     |
| `PUT`       | `/:id`   | Atualiza uma transação específica pelo ID.     | ✅ Sim     |
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

# Rode o script para criar as tabelas no banco (só precisa rodar uma vez)
npx tsx setupDatabase.ts

# Inicie o servidor de desenvolvimento
npm run dev
```

> O backend estará rodando em `http://localhost:3001`.

**3. Configure o Frontend (em outro terminal):**

```bash
# Navegue para a pasta do frontend
cd frontend

# Crie seu arquivo de ambiente local a partir do exemplo
# Garanta que VITE_API_URL aponta para a API do backend (http://localhost:3001)
cp .env.local.example .env.local

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

> O frontend estará disponível em `http://localhost:5173` (ou outra porta indicada pelo Vite).

---

### 👨‍💻 Autor

Feito com muito aprendizado e café por **Eduardo Kamo**.

- **GitHub:** [@edukamoz](https://github.com/edukamoz)
- **LinkedIn:** [Eduardo Kamo](https://www.linkedin.com/in/eduardo-kamo/)
