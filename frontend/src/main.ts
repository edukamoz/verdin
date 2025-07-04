import "./style.css";
import * as auth from "./auth";
import * as api from "./api";
import * as ui from "./ui";

// --- Ícones SVG para o toggle de senha ---
const eyeIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>`;
const eyeSlashIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.243 4.243L6.228 6.228" /></svg>`;

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

  // --- LÓGICA PARA MOSTRAR/ESCONDER SENHA ---
  const setupPasswordTogglers = () => {
    document.querySelectorAll(".password-toggle-icon").forEach((icon) => {
      icon.innerHTML = eyeIcon; // Define o ícone inicial
      icon.addEventListener("click", () => {
        const targetId = (icon as HTMLElement).dataset.target;
        if (!targetId) return;

        const passwordInput = document.querySelector<HTMLInputElement>(
          `#${targetId}`
        );
        if (!passwordInput) return;

        const isPassword = passwordInput.type === "password";
        passwordInput.type = isPassword ? "text" : "password";
        icon.innerHTML = isPassword ? eyeSlashIcon : eyeIcon;
      });
    });
  };

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    ui.clearAllAuthErrors();
    const data = Object.fromEntries(new FormData(loginForm).entries());
    try {
      const result = await api.loginUser(data);
      auth.saveToken(result.token);
      window.location.hash = "#/dashboard";
    } catch (error) {
      ui.displayLoginError((error as Error).message);
    }
  });

  // --- VALIDAÇÃO E SUBMISSÃO DO FORMULÁRIO DE REGISTRO (Refatorado) ---
  const handleRegisterSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    let isValid = true;

    // Limpa todos os erros antigos
    document
      .querySelectorAll(".error-message-inline")
      .forEach((el) => (el.textContent = ""));

    // Pega todos os campos
    const nameInput =
      document.querySelector<HTMLInputElement>("#register-name")!;
    const emailInput =
      document.querySelector<HTMLInputElement>("#register-email")!;
    const passwordInput =
      document.querySelector<HTMLInputElement>("#register-password")!;
    const passwordConfirmInput = document.querySelector<HTMLInputElement>(
      "#register-password-confirm"
    )!;

    // Validação do Nome
    if (nameInput.value.trim() === "") {
      document.querySelector("#name-error")!.textContent =
        "O nome é obrigatório.";
      isValid = false;
    }

    // Validação do Email
    if (emailInput.value.trim() === "") {
      document.querySelector("#email-error")!.textContent =
        "O e-mail é obrigatório.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(emailInput.value)) {
      document.querySelector("#email-error")!.textContent =
        "Formato de e-mail inválido.";
      isValid = false;
    }

    // Validação da Senha
    const password = passwordInput.value;
    const passwordErrors = [];
    if (password.length < 8) passwordErrors.push("8 caracteres");
    if (!/\d/.test(password)) passwordErrors.push("um número");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      passwordErrors.push("um caractere especial");

    if (passwordErrors.length > 0) {
      document.querySelector(
        "#password-error"
      )!.textContent = `A senha precisa ter no mínimo: ${passwordErrors.join(
        ", "
      )}.`;
      isValid = false;
    }

    // Validação da Confirmação de Senha
    if (passwordConfirmInput.value !== password) {
      document.querySelector("#password-confirm-error")!.textContent =
        "As senhas não coincidem.";
      isValid = false;
    }

    // Se tudo for válido, envia para a API
    if (!isValid) return;

    try {
      const data = {
        name: nameInput.value,
        email: emailInput.value,
        password: passwordInput.value,
      };
      await api.registerUser(data);
      ui.showSuccessModal();
      registerForm.reset();
    } catch (error) {
      document.querySelector("#email-error")!.textContent = (
        error as Error
      ).message;
    }
  };

  // Anexa o handler ao formulário de registro
  registerForm.addEventListener("submit", handleRegisterSubmit);

  // Roda a função para configurar os ícones de olho
  setupPasswordTogglers();

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
