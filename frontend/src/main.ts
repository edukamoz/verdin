import "./style.css";
import * as auth from "./auth";
import * as api from "./api";
import * as ui from "./ui";

// --- ROTEADOR (O CÉREBRO DA NAVEGAÇÃO) ---
const routes: { [key: string]: () => void | Promise<void> } = {
  "#/auth": () => ui.showView("auth"),
  "#/dashboard": () => showDashboard(),
};

const router = () => {
  ui.updateHeaderButton(auth.isLoggedIn());

  const path = window.location.hash || "#/";

  if (auth.isLoggedIn() && path === "#/auth") {
    window.location.hash = "#/dashboard";
    return;
  }

  const routeHandler = routes[path];

  if (routeHandler) {
    routeHandler();
  } else {
    ui.showView("landing");
  }
};

// --- LÓGICA DAS PÁGINAS ---
const showDashboard = async () => {
  if (!auth.isLoggedIn()) {
    window.location.hash = "#/auth";
    return;
  }

  ui.showView("app");
  try {
    const transactions = await api.getTransactions();
    ui.renderTransactions(transactions);
    ui.updateSummary(transactions);
  } catch (error) {
    console.error("Sessão inválida ou erro de rede. Deslogando...", error);
    auth.removeToken();
    window.location.hash = "#/auth";
  }
};

// --- MANIPULADORES DE EVENTOS (HANDLERS) ---
const setupEventListeners = () => {
  const loginForm = document.querySelector<HTMLFormElement>("#login-form");
  const registerForm =
    document.querySelector<HTMLFormElement>("#register-form");
  const transactionForm =
    document.querySelector<HTMLFormElement>("#transaction-form")!;
  const logoutBtn = document.querySelector<HTMLButtonElement>("#logout-btn");
  const transactionsTable = document.querySelector<HTMLTableElement>(
    "#transactions-table"
  );
  const deleteAccountBtn = document.querySelector<HTMLButtonElement>(
    "#delete-account-btn"
  );
  const successModal = document.querySelector<HTMLDivElement>("#success-modal");
  const closeModalBtn =
    document.querySelector<HTMLButtonElement>("#close-modal-btn");
  const editModal = document.querySelector<HTMLDivElement>("#edit-modal");
  const editTransactionForm = document.querySelector<HTMLFormElement>(
    "#edit-transaction-form"
  )!;
  const cancelEditBtn =
    document.querySelector<HTMLButtonElement>("#cancel-edit-btn");
  const finalDeleteBtn =
    document.querySelector<HTMLButtonElement>("#final-delete-btn");
  const cancelDeleteAccountBtn = document.querySelector<HTMLButtonElement>(
    "#cancel-delete-account-btn"
  );
  const deleteConfirmInput = document.querySelector<HTMLInputElement>(
    "#delete-confirm-input"
  );
  const deleteConfirmModal = document.querySelector<HTMLDivElement>(
    "#delete-confirm-modal"
  );
  const typeSwitch =
    transactionForm.querySelector<HTMLInputElement>("#type-switch");
  const editTypeSwitch =
    editTransactionForm.querySelector<HTMLInputElement>("#edit-type-switch");

  if (typeSwitch) {
    typeSwitch.addEventListener("change", () => {
      // --- INÍCIO DO BLOCO DE DEPURAÇÃO ---
      console.log("--- DEBUG: Switch de NOVA TRANSAÇÃO foi alterado! ---");
      console.log("Está marcado (é despesa)?", typeSwitch.checked);

      // Vamos verificar se estamos encontrando o container da categoria
      const categoryContainer = transactionForm?.querySelector(
        "#category-container"
      );
      console.log(
        "Elemento do container de categoria encontrado:",
        categoryContainer
      );
      // --- FIM DO BLOCO DE DEPURAÇÃO ---

      // O resto do código que controla a aparência
      transactionForm
        ?.querySelector(".receita-label")
        ?.classList.toggle("active", !typeSwitch.checked);
      transactionForm
        ?.querySelector(".despesa-label")
        ?.classList.toggle("active", typeSwitch.checked);
      categoryContainer?.classList.toggle("hidden", !typeSwitch.checked);
    });
  }
  if (editTypeSwitch) {
    editTypeSwitch.addEventListener("change", () => {
      // Procura os elementos APENAS DENTRO do formulário de edição
      const editCategoryContainer = editTransactionForm.querySelector(
        "#edit-category-container"
      );
      editTransactionForm
        .querySelector(".edit-receita-label")
        ?.classList.toggle("active", !editTypeSwitch.checked);
      editTransactionForm
        .querySelector(".edit-despesa-label")
        ?.classList.toggle("active", editTypeSwitch.checked);
      editCategoryContainer?.classList.toggle(
        "hidden",
        !editTypeSwitch.checked
      );
    });
  }

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
    !cancelEditBtn ||
    !finalDeleteBtn ||
    !cancelDeleteAccountBtn ||
    !deleteConfirmInput ||
    !deleteConfirmModal
  ) {
    console.error(
      "Erro crítico: Um ou mais elementos essenciais não foram encontrados no DOM."
    );
    return;
  }

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    ui.clearAuthErrors();
    const data = Object.fromEntries(new FormData(loginForm).entries());
    try {
      const result = await api.loginUser(data);
      auth.saveToken(result.token);
      window.location.hash = "#/dashboard";
    } catch (error) {
      ui.displayAuthError("login", (error as Error).message);
    }
  });

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
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
  });

  logoutBtn.addEventListener("click", () => {
    auth.removeToken();
    window.location.hash = "#/";
  });

  deleteAccountBtn.addEventListener("click", () => ui.openDeleteConfirmModal());

  transactionForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(transactionForm);
    const typeSwitch =
      transactionForm.querySelector<HTMLInputElement>("#type-switch")!;
    const data = {
      description: formData.get("description"),
      amount: formData.get("amount"),
      date: formData.get("date"),
      type: typeSwitch.checked ? "despesa" : "receita",
      category: typeSwitch.checked ? formData.get("category") : null,
    };

    try {
      await api.createTransaction(data);
      transactionForm.reset();
      transactionForm
        .querySelector("#category-container")
        ?.classList.add("hidden");
      router();
    } catch (error) {
      alert(`Erro ao criar transação: ${(error as Error).message}`);
    }
  });

  transactionsTable.addEventListener("click", (event: MouseEvent) => {
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
    }

    if (deleteButton) {
      const id = parseInt(deleteButton.getAttribute("data-id")!, 10);
      if (confirm("Tem certeza que deseja deletar esta transação?")) {
        api
          .deleteTransaction(id)
          .then(router)
          .catch((error) => {
            alert(`Erro ao deletar transação: ${(error as Error).message}`);
          });
      }
    }
  });

  editTransactionForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(editTransactionForm);
    const transactionId = parseInt(formData.get("transactionId") as string, 10);
    const editTypeSwitch =
      editTransactionForm.querySelector<HTMLInputElement>("#edit-type-switch")!;
    const data = {
      description: formData.get("description"),
      amount: formData.get("amount"),
      date: formData.get("date"),
      type: editTypeSwitch.checked ? "despesa" : "receita",
      category: editTypeSwitch.checked ? formData.get("category") : null,
    };

    console.log("FRONTEND-Enviando para UPDATE:", data);

    try {
      await api.updateTransaction(transactionId, data);
      ui.closeEditModal();
      router();
    } catch (error) {
      alert(`Erro ao atualizar transação: ${(error as Error).message}`);
    }
  });

  cancelEditBtn.addEventListener("click", ui.closeEditModal);

  closeModalBtn.addEventListener("click", ui.hideSuccessModal);
  successModal.addEventListener(
    "click",
    (e) => e.target === successModal && ui.hideSuccessModal()
  );

  cancelDeleteAccountBtn.addEventListener("click", ui.closeDeleteConfirmModal);
  finalDeleteBtn.addEventListener("click", async () => {
    try {
      await api.deleteUserAccount();
      ui.closeDeleteConfirmModal();
      alert("Sua conta foi deletada com sucesso.");
      auth.removeToken();
      window.location.hash = "#/";
    } catch (error) {
      alert(`Erro ao deletar conta: ${(error as Error).message}`);
    }
  });
  deleteConfirmInput.addEventListener("input", () => {
    finalDeleteBtn.disabled = deleteConfirmInput.value !== "CONFIRMAR";
  });
};

// --- PONTO DE ENTRADA DA APLICAÇÃO ---
window.addEventListener("load", router);
window.addEventListener("hashchange", router);
document.addEventListener("DOMContentLoaded", setupEventListeners);
