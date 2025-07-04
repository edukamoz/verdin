// --- Tipos e Interfaces ---

/**
 * Interface que define a estrutura de uma transação financeira.
 */
interface Transaction {
  id: number;
  description: string;
  amount: string; // Valor recebido como string do backend
  type: "receita" | "despesa";
  date: string;
  category?: string | null;
}

// --- Seletores de Elementos do DOM ---

// Adicionamos o seletor da landing page
const landingView = document.querySelector<HTMLDivElement>("#landing-view")!;

// Elementos principais da interface
const authView = document.querySelector<HTMLDivElement>("#auth-view")!;
const appView = document.querySelector<HTMLDivElement>("#app-view")!;
const headerCtaBtn =
  document.querySelector<HTMLAnchorElement>("#header-cta-btn")!;

// Elementos da tabela de transações
const transactionsTableBody = document.querySelector<HTMLTableSectionElement>(
  "#transactions-table tbody"
)!;

// Elementos dos cards de resumo
const totalReceitasEl =
  document.querySelector<HTMLParagraphElement>("#total-receitas")!;
const totalDespesasEl =
  document.querySelector<HTMLParagraphElement>("#total-despesas")!;
const saldoTotalEl =
  document.querySelector<HTMLParagraphElement>("#saldo-total")!;

// Elementos de erro dos formulários de autenticação
const loginErrorEl = document.querySelector<HTMLDivElement>("#login-error")!;
const registerErrorEl =
  document.querySelector<HTMLDivElement>("#register-error")!;

// Modal de sucesso
const successModal = document.querySelector<HTMLDivElement>("#success-modal")!;

// Modal de edição de transação
const editModal = document.querySelector<HTMLDivElement>("#edit-modal")!;
const editIdInput = document.querySelector<HTMLInputElement>(
  "#edit-transaction-id"
)!;
const editDescriptionInput =
  document.querySelector<HTMLInputElement>("#edit-description")!;
const editAmountInput =
  document.querySelector<HTMLInputElement>("#edit-amount")!;
const editDateInput = document.querySelector<HTMLInputElement>("#edit-date")!;

// Modal de confirmação de deleção
const deleteConfirmModal = document.querySelector<HTMLDivElement>(
  "#delete-confirm-modal"
)!;
const deleteConfirmInput = document.querySelector<HTMLInputElement>(
  "#delete-confirm-input"
)!;
const finalDeleteBtn =
  document.querySelector<HTMLButtonElement>("#final-delete-btn")!;

// --- Funções Auxiliares de Formatação ---

/**
 * Formata um número para o formato de moeda brasileiro (BRL).
 * @param value Valor numérico a ser formatado.
 * @returns String formatada como moeda.
 */
const formatCurrency = (value: number): string => {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

/**
 * Formata uma data em string para o padrão brasileiro (dd/mm/aaaa).
 * @param dateString Data em formato ISO.
 * @returns Data formatada.
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + 1); // Corrige possíveis problemas de fuso horário
  return date.toLocaleDateString("pt-BR");
};

// --- Funções de Renderização e UI ---

/**
 * Renderiza a tabela de transações no DOM.
 * @param transactions Lista de transações a serem exibidas.
 */
export const renderTransactions = (transactions: Transaction[]): void => {
  transactionsTableBody.innerHTML = "";

  if (transactions.length === 0) {
    // Atualizamos o colspan para 5, pois agora temos 5 colunas
    transactionsTableBody.innerHTML = `<tr><td colspan="5">Nenhuma transação encontrada.</td></tr>`;
    return;
  }

  transactions.forEach((transaction) => {
    const tr = document.createElement("tr");
    const isReceita = transaction.type === "receita";

    // Se a transação for uma despesa, usamos a categoria dela. Se for receita ou não tiver categoria, usamos '---'.
    const category =
      transaction.type === "despesa" ? transaction.category || "Outras" : "---";

    const editIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>`;
    const deleteIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.033-2.134H8.716c-1.123 0-2.033.954-2.033 2.134v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>`;

    tr.innerHTML = `
      <td>${category}</td>
      <td>${transaction.description}</td>
      <td class="${isReceita ? "receita" : "despesa"}">${formatCurrency(
      parseFloat(transaction.amount)
    )}</td>
      <td>${formatDate(transaction.date)}</td>
      <td>
        <button class="edit-btn" title="Editar" 
          data-id="${transaction.id}"
          data-description="${transaction.description}"
          data-amount="${transaction.amount}"
          data-type="${transaction.type}"
          data-date="${transaction.date.split("T")[0]}"
          data-category="${transaction.category || ""}">
          ${editIcon}
        </button>
        <button class="delete-btn" title="Excluir" data-id="${transaction.id}">
          ${deleteIcon}
        </button>
      </td>
    `;
    transactionsTableBody.appendChild(tr);
  });
};

/**
 * Atualiza os valores dos cards de resumo (receitas, despesas, saldo).
 * @param transactions Lista de transações.
 */
export const updateSummary = (transactions: Transaction[]): void => {
  const amounts = transactions.map((t) => parseFloat(t.amount));
  const receitas = amounts
    .filter((_item, index) => transactions[index].type === "receita")
    .reduce((acc, amount) => acc + amount, 0);

  const despesas = amounts
    .filter((_item, index) => transactions[index].type === "despesa")
    .reduce((acc, amount) => acc + amount, 0);

  const saldoTotal = receitas - despesas;

  totalReceitasEl.textContent = formatCurrency(receitas);
  totalDespesasEl.textContent = formatCurrency(despesas);
  saldoTotalEl.textContent = formatCurrency(saldoTotal);
};

/**
 * Alterna entre a tela de autenticação e a tela principal do app.
 * @param viewName Nome da view a ser exibida ("auth" ou "app").
 */
export const showView = (viewName: "landing" | "auth" | "app"): void => {
  // 1. Esconde todas as telas
  landingView.classList.add("hidden");
  authView.classList.add("hidden");
  appView.classList.add("hidden");

  // 2. Mostra apenas a tela correta
  if (viewName === "landing") {
    landingView.classList.remove("hidden");
  } else if (viewName === "auth") {
    authView.classList.remove("hidden");
  } else if (viewName === "app") {
    appView.classList.remove("hidden");
  }
};

/**
 * Exibe mensagem de erro nos formulários de login ou registro.
 * @param form Formulário alvo ("login" ou "register").
 * @param message Mensagem de erro.
 */
export const displayAuthError = (
  form: "login" | "register",
  message: string
): void => {
  const element = form === "login" ? loginErrorEl : registerErrorEl;
  element.textContent = message;
};

/**
 * Limpa as mensagens de erro dos formulários de autenticação.
 */
export const clearAuthErrors = (): void => {
  loginErrorEl.textContent = "";
  registerErrorEl.textContent = "";
};

/**
 * Exibe o modal de sucesso.
 */
export const showSuccessModal = (): void => {
  successModal.classList.remove("hidden");
};

/**
 * Esconde o modal de sucesso.
 */
export const hideSuccessModal = (): void => {
  successModal.classList.add("hidden");
};

/**
 * Preenche o formulário de edição com os dados da transação e exibe o modal.
 * @param transaction Transação a ser editada.
 */
export const openEditModal = (transaction: Transaction) => {
  editIdInput.value = transaction.id.toString();
  editDescriptionInput.value = transaction.description;
  editAmountInput.value = parseFloat(transaction.amount).toFixed(2);
  editDateInput.value = transaction.date.split("T")[0]; // Formato YYYY-MM-DD
  const editTypeSwitch =
    document.querySelector<HTMLInputElement>("#edit-type-switch")!;
  // Se for despesa, o switch fica "ligado" (checked)
  editTypeSwitch.checked = transaction.type === "despesa";
  const editCategoryContainer = document.querySelector<HTMLDivElement>(
    "#edit-category-container"
  )!;
  const editCategorySelect =
    document.querySelector<HTMLSelectElement>("#edit-category")!;

  // Marca o radio button correto (receita ou despesa)
  document
    .querySelector(".edit-receita-label")!
    .classList.toggle("active", transaction.type === "receita");
  document
    .querySelector(".edit-despesa-label")!
    .classList.toggle("active", transaction.type === "despesa");

  if (transaction.type === "despesa") {
    editCategoryContainer.classList.remove("hidden");
    editCategorySelect.value = transaction.category || "Outras";
  } else {
    editCategoryContainer.classList.add("hidden");
  }

  editModal.classList.remove("hidden");
};

/**
 * Esconde o modal de edição.
 */
export const closeEditModal = () => {
  editModal.classList.add("hidden");
};

/**
 * Exibe o modal de confirmação de deleção.
 */
export const openDeleteConfirmModal = () => {
  deleteConfirmModal.classList.remove("hidden");
};

/**
 * Esconde o modal de confirmação de deleção e reseta seus campos.
 */
export const closeDeleteConfirmModal = () => {
  deleteConfirmInput.value = ""; // Limpa o input
  finalDeleteBtn.disabled = true; // Desabilita o botão novamente
  deleteConfirmModal.classList.add("hidden");
};

export const updateHeaderButton = (isLoggedIn: boolean) => {
  if (!headerCtaBtn) return; // Garante que o botão existe

  if (isLoggedIn) {
    headerCtaBtn.textContent = "Meu Dashboard";
    headerCtaBtn.href = "#/dashboard";
  } else {
    headerCtaBtn.textContent = "Acessar Plataforma";
    headerCtaBtn.href = "#/auth";
  }
};
