import "./style.css";
import * as auth from "./auth";
import * as api from "./api";
import * as ui from "./ui";

document.addEventListener("DOMContentLoaded", () => {
  // --- Seletores de Elementos do DOM ---
  const loginForm = document.querySelector<HTMLFormElement>("#login-form");
  const registerForm =
    document.querySelector<HTMLFormElement>("#register-form");
  const transactionForm =
    document.querySelector<HTMLFormElement>("#transaction-form");
  const logoutBtn = document.querySelector<HTMLButtonElement>("#logout-btn");
  const transactionsTable = document.querySelector<HTMLTableElement>(
    "#transactions-table"
  );

  // Se algum seletor principal falhar, o erro aparecerá aqui, facilitando a depuração.
  if (
    !loginForm ||
    !registerForm ||
    !transactionForm ||
    !logoutBtn ||
    !transactionsTable
  ) {
    console.error(
      "Erro crítico: Um ou mais elementos essenciais não foram encontrados no DOM. Verifique os IDs no seu index.html."
    );
    return; // Interrompe a execução se algum elemento vital estiver faltando.
  }

  // --- Manipuladores de Eventos ---

  const handleLoginSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    ui.clearAuthErrors();
    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData.entries());

    try {
      const result = await api.loginUser(data);
      auth.saveToken(result.token);
      await initializeApp();
    } catch (error) {
      ui.displayAuthError("login", (error as Error).message);
    }
  };

  const handleRegisterSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    ui.clearAuthErrors();
    const formData = new FormData(registerForm);
    const data = Object.fromEntries(formData.entries());

    // Agora que temos o atributo name, data.password será uma string
    const password = data.password as string;

    // --- NOVA LÓGICA DE VALIDAÇÃO ---

    // 1. Regex para verificar se existe pelo menos um número
    const hasNumber = /\d/.test(password);

    // 2. Regex para verificar se existe pelo menos um caractere especial
    // O conjunto [!@#$%^&*(),.?":{}|<>] é um exemplo, pode ser customizado.
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    // 3. Verificação completa
    if (password.length < 6 || !hasNumber || !hasSpecialChar) {
      ui.displayAuthError(
        "register",
        "A senha deve ter no mínimo 6 caracteres, um número e um caractere especial."
      );
      return; // Interrompe a execução se a senha for inválida
    }

    // --- CORREÇÃO APLICADA AQUI ---
    // Adicionamos a verificação de tipo para garantir que data.password é uma string.
    if (typeof data.password !== "string" || data.password.length < 6) {
      ui.displayAuthError(
        "register",
        "A senha deve ser informada e ter no mínimo 6 caracteres."
      );
      return;
    }

    try {
      await api.registerUser(data);
      alert(
        "Registro realizado com sucesso! Por favor, faça o login para continuar."
      );
      registerForm.reset();
    } catch (error) {
      ui.displayAuthError("register", (error as Error).message);
    }
  };

  const handleLogoutClick = () => {
    auth.removeToken();
    initializeApp();
  };

  const handleTransactionSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    const formData = new FormData(transactionForm);
    const data = {
      description: formData.get("description"),
      amount: formData.get("amount"),
      date: formData.get("date"),
      type: formData.get("type"),
    };

    try {
      await api.createTransaction(data);
      transactionForm.reset();
      await initializeApp();
    } catch (error) {
      alert(`Erro ao criar transação: ${(error as Error).message}`);
    }
  };

  const handleTransactionTableClick = async (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains("delete-btn")) {
      const id = target.getAttribute("data-id");
      if (id && confirm("Tem certeza que deseja deletar esta transação?")) {
        try {
          await api.deleteTransaction(parseInt(id, 10));
          await initializeApp();
        } catch (error) {
          alert(`Erro ao deletar transação: ${(error as Error).message}`);
        }
      }
    }
  };

  // --- Função Principal de Inicialização ---

  const initializeApp = async () => {
    if (auth.isLoggedIn()) {
      ui.showView("app");
      try {
        const transactions = await api.getTransactions();
        ui.renderTransactions(transactions);
        ui.updateSummary(transactions);
      } catch (error) {
        console.error("Sessão inválida ou erro de rede. Deslogando...", error);
        auth.removeToken();
        initializeApp(); // Chama a si mesma para re-renderizar a tela de auth
      }
    } else {
      ui.showView("auth");
    }
  };

  // --- Anexando os Eventos ---

  loginForm.addEventListener("submit", handleLoginSubmit);
  registerForm.addEventListener("submit", handleRegisterSubmit);
  logoutBtn.addEventListener("click", handleLogoutClick);
  transactionForm.addEventListener("submit", handleTransactionSubmit);
  transactionsTable.addEventListener("click", handleTransactionTableClick);

  // Roda a aplicação pela primeira vez
  initializeApp();
});
