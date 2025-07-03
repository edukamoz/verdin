import "./style.css";
import * as auth from "./auth";
import * as api from "./api";
import * as ui from "./ui";

/**
 * Inicializa a aplicação após o carregamento do DOM.
 */
document.addEventListener("DOMContentLoaded", () => {
  // --- Seletores do DOM ---
  // Formulários
  const loginForm = document.querySelector<HTMLFormElement>("#login-form");
  const registerForm =
    document.querySelector<HTMLFormElement>("#register-form");
  const transactionForm =
    document.querySelector<HTMLFormElement>("#transaction-form");
  const editTransactionForm = document.querySelector<HTMLFormElement>(
    "#edit-transaction-form"
  );

  // Botões
  const logoutBtn = document.querySelector<HTMLButtonElement>("#logout-btn");
  const deleteAccountBtn = document.querySelector<HTMLButtonElement>(
    "#delete-account-btn"
  );
  const finalDeleteBtn =
    document.querySelector<HTMLButtonElement>("#final-delete-btn")!;
  const cancelDeleteAccountBtn = document.querySelector<HTMLButtonElement>(
    "#cancel-delete-account-btn"
  )!;
  const closeModalBtn =
    document.querySelector<HTMLButtonElement>("#close-modal-btn");
  const cancelEditBtn =
    document.querySelector<HTMLButtonElement>("#cancel-edit-btn");

  // Tabelas e Modais
  const transactionsTable = document.querySelector<HTMLTableElement>(
    "#transactions-table"
  );
  const successModal = document.querySelector<HTMLDivElement>("#success-modal");
  const editModal = document.querySelector<HTMLDivElement>("#edit-modal");
  const deleteConfirmModal = document.querySelector<HTMLDivElement>(
    "#delete-confirm-modal"
  )!;
  const deleteConfirmInput = document.querySelector<HTMLInputElement>(
    "#delete-confirm-input"
  )!;

  // Verifica se todos os elementos essenciais foram encontrados
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

  // --- Funções de Manipulação de Eventos ---

  /**
   * Manipula o envio do formulário de login.
   * @param event Evento de envio do formulário.
   */
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

  /**
   * Manipula o envio do formulário de registro.
   * @param event Evento de envio do formulário.
   */
  const handleRegisterSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    ui.clearAuthErrors();
    const data = Object.fromEntries(new FormData(registerForm).entries());
    const password = data.password as string;
    // Validação de senha
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

  /**
   * Manipula o clique no botão de logout.
   */
  const handleLogoutClick = () => {
    auth.removeToken();
    initializeApp();
  };

  /**
   * Manipula o envio do formulário de transação.
   * @param event Evento de envio do formulário.
   */
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

  /**
   * Manipula cliques na tabela de transações (edição e exclusão).
   * @param event Evento de clique.
   */
  const handleTransactionTableClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const editButton = target.closest(".edit-btn");
    const deleteButton = target.closest(".delete-btn");

    if (editButton) {
      // Abre modal de edição com dados da transação
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
      // Confirma e deleta transação
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

  /**
   * Manipula o envio do formulário de edição de transação.
   * @param event Evento de envio do formulário.
   */
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

  /**
   * Manipula a exclusão final da conta do usuário.
   */
  const handleFinalDelete = async () => {
    try {
      await api.deleteUserAccount();
      ui.closeDeleteConfirmModal();
      alert("Sua conta foi deletada com sucesso.");
      auth.removeToken();
      initializeApp();
    } catch (error) {
      alert(`Erro ao deletar conta: ${(error as Error).message}`);
    }
  };

  /**
   * Habilita o botão de exclusão final apenas se o texto for "CONFIRMAR".
   */
  const handleDeleteConfirmInput = () => {
    finalDeleteBtn.disabled = deleteConfirmInput.value !== "CONFIRMAR";
  };

  /**
   * Abre o modal de confirmação de exclusão de conta.
   */
  const handleDeleteAccountClick = () => {
    ui.openDeleteConfirmModal();
  };

  /**
   * Função principal de inicialização da aplicação.
   * Exibe a view correta e carrega as transações se o usuário estiver logado.
   */
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
        initializeApp();
      }
    } else {
      ui.showView("auth");
    }
  };

  // --- Anexando os Eventos aos Elementos do DOM ---

  loginForm.addEventListener("submit", handleLoginSubmit);
  registerForm.addEventListener("submit", handleRegisterSubmit);
  logoutBtn.addEventListener("click", handleLogoutClick);
  transactionForm.addEventListener("submit", handleTransactionSubmit);
  transactionsTable.addEventListener("click", handleTransactionTableClick);
  closeModalBtn.addEventListener("click", ui.hideSuccessModal);
  successModal.addEventListener("click", (event) => {
    if (event.target === successModal) ui.hideSuccessModal();
  });
  deleteAccountBtn.addEventListener("click", handleDeleteAccountClick);
  editTransactionForm.addEventListener("submit", handleEditFormSubmit);
  cancelEditBtn.addEventListener("click", ui.closeEditModal);
  editModal.addEventListener(
    "click",
    (e) => e.target === editModal && ui.closeEditModal()
  );
  finalDeleteBtn.addEventListener("click", handleFinalDelete);
  cancelDeleteAccountBtn.addEventListener("click", ui.closeDeleteConfirmModal);
  deleteConfirmInput.addEventListener("input", handleDeleteConfirmInput);
  deleteConfirmModal.addEventListener(
    "click",
    (e) => e.target === deleteConfirmModal && ui.closeDeleteConfirmModal()
  );

  // Inicializa a aplicação na primeira carga
  initializeApp();
});
