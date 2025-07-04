import { Request, Response } from "express";
import pool from "../config/db";
import { Transaction } from "../types";

export const getAllTransactions = async (req: Request, res: Response) => {
  // 1. Extrai os NOVOS filtros da query string da URL
  const {
    type,
    category,
    startDate,
    endDate,
    description,
    minValue,
    maxValue,
  } = req.query;
  const userId = req.user!.id;

  let queryText = "SELECT * FROM transactions WHERE user_id = $1";
  const queryParams: any[] = [userId];
  let paramIndex = 2;

  if (type && type !== "todos") {
    queryText += ` AND type = $${paramIndex++}`;
    queryParams.push(type);
  }
  if (category && typeof category === "string") {
    queryText += ` AND category = ANY($${paramIndex++}::text[])`;
    queryParams.push(category.split(","));
  }
  if (startDate) {
    queryText += ` AND date >= $${paramIndex++}`;
    queryParams.push(startDate);
  }
  if (endDate) {
    queryText += ` AND date <= $${paramIndex++}`;
    queryParams.push(endDate);
  }

  // Filtro por descrição (busca parcial, case-insensitive)
  if (description && typeof description === "string") {
    queryText += ` AND description ILIKE $${paramIndex++}`;
    queryParams.push(`%${description}%`); // O '%' é um coringa para buscar parte do texto
  }

  // Filtro por valor mínimo
  if (minValue && !isNaN(parseFloat(minValue as string))) {
    queryText += ` AND amount >= $${paramIndex++}`;
    queryParams.push(minValue);
  }

  // Filtro por valor máximo
  if (maxValue && !isNaN(parseFloat(maxValue as string))) {
    queryText += ` AND amount <= $${paramIndex++}`;
    queryParams.push(maxValue);
  }

  queryText += " ORDER BY date DESC";

  try {
    console.log("Executando Query:", queryText, queryParams);
    const allTransactions = await pool.query(queryText, queryParams);
    res.json(allTransactions.rows);
  } catch (err) {
    console.error("ERRO AO FILTRAR TRANSAÇÕES:", err);
    res.status(500).json({ message: "Erro no servidor" });
  }
};

export const createTransaction = async (req: Request, res: Response) => {
  // Nós precisamos extrair 'category' do req.body junto com os outros campos.
  const { description, amount, type, date, category } = req.body as Transaction;

  try {
    // Se a transação for do tipo 'receita', nós forçamos a categoria a ser nula.
    // Caso contrário, usamos a categoria que veio do frontend.
    const finalCategory = type === "receita" ? null : category;

    const newTransaction = await pool.query(
      // A query SQL já estava correta, esperando 6 valores.
      "INSERT INTO transactions (user_id, description, amount, type, date, category) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [req.user!.id, description, amount, type, date, finalCategory]
    );
    res.status(201).json(newTransaction.rows[0]);
  } catch (error) {
    console.error("ERRO AO CRIAR TRANSAÇÃO:", error);
    res.status(500).json({ message: "Erro no servidor" });
  }
};

export const deleteTransaction = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM transactions WHERE id = $1 AND user_id = $2",
      [id, req.user!.id]
    );
    if (result.rowCount === 0) {
      res.status(404).json({
        message: "Transação não encontrada ou não pertence ao usuário.",
      });
      return; // Usamos um return "seco" para parar a execução da função aqui.
    }
    res.json({ message: "Transação deletada com sucesso." });
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor" });
  }
};

export const updateTransaction = async (req: Request, res: Response) => {
  console.log("BACKEND-Recebeu para UPDATE:", req.body);

  const { id } = req.params;
  const userId = req.user!.id;
  const { description, amount, type, date, category } = req.body as Transaction;

  if (!description || !amount || !type || !date) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios." });
  }

  try {
    const finalCategory = type === "receita" ? null : category;

    // --- AQUI ESTÁ A CORREÇÃO CRÍTICA ---
    const result = await pool.query(
      // 1. Adicionamos "category = $5" na lista de campos a serem atualizados
      `UPDATE transactions 
       SET description = $1, amount = $2, type = $3, date = $4, category = $5 
       WHERE id = $6 AND user_id = $7 
       RETURNING *`,
      // 2. Adicionamos a variável "finalCategory" na posição correta ($5) da lista de parâmetros
      [description, amount, type, date, finalCategory, id, userId]
    );

    if (result.rowCount === 0) {
      res.status(404).json({
        message:
          "Transação não encontrada ou você não tem permissão para editá-la.",
      });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("ERRO AO ATUALIZAR TRANSAÇÃO:", error);
    res.status(500).json({ message: "Erro no servidor" });
  }
};
