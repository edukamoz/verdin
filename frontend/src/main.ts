import "./style.css";
import * as auth from "./auth";
import * as api from "./api";
import * as ui from "./ui";

document.addEventListener("DOMContentLoaded", () => {
  // --- Seletores do DOM ---
  const loginForm = document.querySelector<HTMLFormElement>("#login-form");
  const registerForm =
    document.querySelector<HTMLFormElement>("#register-form");
  const transactionForm =
    document.querySelector<HTMLFormElement>("#transaction-form");
  const logoutBtn = document.querySelector<HTMLButtonElement>("#logout-btn");
  const transactionsTable = document.querySelector<HTMLTableElement>(
    "#transactions-table"
  );
  const deleteAccountBtn = document.querySelector<HTMLButtonElement>(
    "#delete-account-btn"
  );

  // Seletores do Modal de Sucesso
  const successModal = document.querySelector<HTMLDivElement>("#success-modal");
  const closeModalBtn =
    document.querySelector<HTMLButtonElement>("#close-modal-btn");

  // Seletores do Modal de Edição
  const editModal = document.querySelector<HTMLDivElement>("#edit-modal");
  const editTransactionForm = document.querySelector<HTMLFormElement>(
    "#edit-transaction-form"
  );
  const cancelEditBtn =
    document.querySelector<HTMLButtonElement>("#cancel-edit-btn");

  // Se algum seletor principal falhar, o erro aparecerá aqui, facilitando a depuração.
  if (
    !loginForm ||
    !registerForm ||
    !transactionForm ||
    !logoutBtn ||
    !transactionsTable ||
    !deleteAccountBtn ||
    !successModal ||
    !closeModalBtn ||
    !editModal ||
    !editTransactionForm ||
    !cancelEditBtn
  ) {
    console.error(
      "Erro crítico: Um ou mais elementos essenciais não foram encontrados no DOM."
    );
    return;
  }

  // --- Manipuladores de Eventos ---

  const handleLoginSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    ui.clearAuthErrors();
    const data = Object.fromEntries(new FormData(loginForm).entries());
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
    const data = Object.fromEntries(new FormData(registerForm).entries());
    const password = data.password as string;
    if (
      password.length < 6 ||
      !/\d/.test(password) ||
      !/[!@#$%^&*(),.?":{}|<>]/.test(password)
    ) {
      ui.displayAuthError(
        "register",
        "A senha deve ter no mínimo 6 caracteres, um número e um caractere especial."
      );
      return;
    }
    try {
      await api.registerUser(data);
      ui.showSuccessModal();
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
    const data = Object.fromEntries(new FormData(transactionForm).entries());
    try {
      await api.createTransaction(data);
      transactionForm.reset();
      await initializeApp();
    } catch (error) {
      alert(`Erro ao criar transação: ${(error as Error).message}`);
    }
  };

  const handleTransactionTableClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const editButton = target.closest(".edit-btn");
    const deleteButton = target.closest(".delete-btn");

    if (editButton) {
      const id = parseInt(editButton.getAttribute("data-id")!, 10);
      const description = editButton.getAttribute("data-description")!;
      const amount = editButton.getAttribute("data-amount")!;
      const type = editButton.getAttribute("data-type") as
        | "receita"
        | "despesa";
      const date = editButton.getAttribute("data-date")!;
      ui.openEditModal({ id, description, amount, type, date });
      return;
    }

    if (deleteButton) {
      const id = parseInt(deleteButton.getAttribute("data-id")!, 10);
      if (confirm("Tem certeza que deseja deletar esta transação?")) {
        api
          .deleteTransaction(id)
          .then(initializeApp)
          .catch((error) => {
            alert(`Erro ao deletar transação: ${(error as Error).message}`);
          });
      }
      return;
    }
  };

  // Handler para o formulário de edição
  const handleEditFormSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    const editForm = event.target as HTMLFormElement;
    const formData = new FormData(editForm);
    const transactionId = parseInt(formData.get("transactionId") as string, 10);
    const data = {
      description: formData.get("description"),
      amount: formData.get("amount"),
      date: formData.get("date"),
      type: formData.get("type"),
    };
    try {
      await api.updateTransaction(transactionId, data);
      ui.closeEditModal();
      await initializeApp();
    } catch (error) {
      alert(`Erro ao atualizar transação: ${(error as Error).message}`);
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

  const handleDeleteAccountClick = async () => {
    // Usamos um prompt para uma confirmação forte, evitando cliques acidentais.
    const confirmation = prompt(
      'Esta ação é PERMANENTE e irá deletar sua conta e todas as suas transações.\n\nPara confirmar, digite "DELETAR MINHA CONTA":'
    );

    if (confirmation === "DELETAR MINHA CONTA") {
      try {
        await api.deleteUserAccount();
        alert("Sua conta foi deletada com sucesso.");
        auth.removeToken();
        initializeApp(); // Volta para a tela de login
      } catch (error) {
        alert(`Erro ao deletar a conta: ${(error as Error).message}`);
      }
    } else {
      alert("Ação cancelada.");
    }
  };

  // --- Anexando os Eventos ---

  loginForm.addEventListener("submit", handleLoginSubmit);
  registerForm.addEventListener("submit", handleRegisterSubmit);
  logoutBtn.addEventListener("click", handleLogoutClick);
  transactionForm.addEventListener("submit", handleTransactionSubmit);
  transactionsTable.addEventListener("click", handleTransactionTableClick);
  closeModalBtn.addEventListener("click", ui.hideSuccessModal);
  successModal.addEventListener("click", (event) => {
    if (event.target === successModal) {
      ui.hideSuccessModal();
    }
  });
  deleteAccountBtn.addEventListener("click", handleDeleteAccountClick);
  editTransactionForm.addEventListener("submit", handleEditFormSubmit);
  cancelEditBtn.addEventListener("click", ui.closeEditModal);
  editModal.addEventListener(
    "click",
    (e) => e.target === editModal && ui.closeEditModal()
  );

  // Roda a aplicação pela primeira vez
  initializeApp();
});
