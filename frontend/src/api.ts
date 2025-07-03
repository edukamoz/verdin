import { getToken } from "./auth";

// Pega a URL da API do arquivo .env.local, garantindo que ela exista.
const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  throw new Error("VITE_API_URL não está definida no arquivo .env.local");
}

/**
 * Função base para fazer requisições à API, já incluindo o token de autenticação.
 */
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: { ...headers, ...options.headers },
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Erro desconhecido." }));
    throw new Error(errorData.message || "Ocorreu um erro na requisição.");
  }

  // Retorna um objeto de sucesso para respostas sem corpo (ex: DELETE 204 No Content)
  if (
    response.status === 204 ||
    response.headers.get("content-length") === "0"
  ) {
    return { success: true };
  }

  return response.json();
};

// --- Funções específicas para cada endpoint da API ---

export const loginUser = (data: object) =>
  fetchWithAuth("/api/users/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
export const registerUser = (data: object) =>
  fetchWithAuth("/api/users/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getTransactions = () => fetchWithAuth("/api/transactions");
export const createTransaction = (data: object) =>
  fetchWithAuth("/api/transactions", {
    method: "POST",
    body: JSON.stringify(data),
  });
export const deleteTransaction = (id: number) =>
  fetchWithAuth(`/api/transactions/${id}`, { method: "DELETE" });
export const deleteUserAccount = () =>
  fetchWithAuth("/api/users/me", { method: "DELETE" });
