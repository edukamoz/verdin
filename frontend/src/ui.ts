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
  transactionsTableBody.innerHTML = ""; // Limpa a tabela antes de adicionar novas linhas

  if (transactions.length === 0) {
    transactionsTableBody.innerHTML = `<tr><td colspan="4">Nenhuma transação encontrada.</td></tr>`;
    return;
  }

  transactions.forEach((transaction) => {
    const tr = document.createElement("tr");
    const isReceita = transaction.type === "receita";

    tr.innerHTML = `
      <td>${transaction.description}</td>
      <td class="${isReceita ? "receita" : "despesa"}">${formatCurrency(
      parseFloat(transaction.amount)
    )}</td>
      <td>${formatDate(transaction.date)}</td>
      <td>
        <button class="delete-btn" data-id="${transaction.id}">Excluir</button>
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
