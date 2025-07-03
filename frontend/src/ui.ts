// --- Tipos e Interfaces ---
// Definimos a "forma" de um objeto de transação para o TypeScript
interface Transaction {
  id: number;
  description: string;
  amount: string; // O banco de dados envia como string
  type: "receita" | "despesa";
  date: string;
}

// --- Seletores de Elementos do DOM ---
// Pegamos todos os elementos que vamos precisar manipular
const authView = document.querySelector<HTMLDivElement>("#auth-view")!;
const appView = document.querySelector<HTMLDivElement>("#app-view")!;
const transactionsTableBody = document.querySelector<HTMLTableSectionElement>(
  "#transactions-table tbody"
)!;
const totalReceitasEl =
  document.querySelector<HTMLParagraphElement>("#total-receitas")!;
const totalDespesasEl =
  document.querySelector<HTMLParagraphElement>("#total-despesas")!;
const saldoTotalEl =
  document.querySelector<HTMLParagraphElement>("#saldo-total")!;
const loginErrorEl = document.querySelector<HTMLDivElement>("#login-error")!;
const registerErrorEl =
  document.querySelector<HTMLDivElement>("#register-error")!;
const successModal = document.querySelector<HTMLDivElement>("#success-modal")!;

// --- Funções Auxiliares de Formatação ---
const formatCurrency = (value: number): string => {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  // Adiciona 1 dia para corrigir o fuso horário que pode causar problemas na exibição
  date.setDate(date.getDate() + 1);
  return date.toLocaleDateString("pt-BR");
};

// --- Funções de Renderização ---

/**
 * Limpa e renderiza a tabela de transações com os dados fornecidos.
 */
export const renderTransactions = (transactions: Transaction[]): void => {
  transactionsTableBody.innerHTML = "";

  if (transactions.length === 0) {
    transactionsTableBody.innerHTML = `<tr><td colspan="5">Nenhuma transação encontrada.</td></tr>`;
    return;
  }

  transactions.forEach((transaction) => {
    const tr = document.createElement("tr");
    const isReceita = transaction.type === "receita";

    // O ícone de lápis em SVG
    const editIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
      </svg>
    `;

    // Ícone de lixeira em SVG
    const deleteIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.033-2.134H8.716c-1.123 0-2.033.954-2.033 2.134v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
      </svg>
    `;

    // Agora a última célula da tabela terá os dois botões
    tr.innerHTML = `
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
          data-date="${transaction.date.split("T")[0]}">
          ${editIcon}
        </button>
        <button class="delete-btn" title="Excluir" data-id="${transaction.id}">
          ${deleteIcon} </button>
      </td>
    `;
    transactionsTableBody.appendChild(tr);
  });
};

/**
 * Calcula e atualiza os cards de resumo (receitas, despesas, saldo).
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
 * Alterna a visibilidade entre a tela de autenticação e a tela principal do app.
 */
export const showView = (viewName: "auth" | "app"): void => {
  if (viewName === "app") {
    authView.classList.add("hidden");
    appView.classList.remove("hidden");
  } else {
    authView.classList.remove("hidden");
    appView.classList.add("hidden");
  }
};

/**
 * Exibe uma mensagem de erro nos formulários de login ou registro.
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
 * Mostra o modal de sucesso.
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

// Seletores para o novo modal
const editModal = document.querySelector<HTMLDivElement>("#edit-modal")!;
const editIdInput = document.querySelector<HTMLInputElement>(
  "#edit-transaction-id"
)!;
const editDescriptionInput =
  document.querySelector<HTMLInputElement>("#edit-description")!;
const editAmountInput =
  document.querySelector<HTMLInputElement>("#edit-amount")!;
const editDateInput = document.querySelector<HTMLInputElement>("#edit-date")!;

/**
 * Preenche o formulário de edição com os dados da transação e exibe o modal.
 */
export const openEditModal = (transaction: Transaction) => {
  editIdInput.value = transaction.id.toString();
  editDescriptionInput.value = transaction.description;
  editAmountInput.value = parseFloat(transaction.amount).toFixed(2);
  editDateInput.value = transaction.date.split("T")[0]; // Formato YYYY-MM-DD

  // Marca o radio button correto (receita ou despesa)
  document.querySelector<HTMLInputElement>(
    `input[name="type"][value="${transaction.type}"]`
  )!.checked = true;

  editModal.classList.remove("hidden");
};

/**
 * Esconde o modal de edição.
 */
export const closeEditModal = () => {
  editModal.classList.add("hidden");
};
