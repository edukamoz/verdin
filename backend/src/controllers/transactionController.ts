import { Request, Response } from "express";
import pool from "../config/db";
import { Transaction } from "../types";

export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await pool.query(
      "SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC",
      [req.user!.id]
    );
    res.json(transactions.rows);
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor" });
  }
};

export const createTransaction = async (req: Request, res: Response) => {
  // --- CORREÇÃO AQUI ---
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
  const { id } = req.params; // Pega o ID da transação da URL
  const userId = req.user!.id; // Pega o ID do usuário do token JWT
  const { description, amount, type, date } = req.body; // Pega os novos dados do corpo da requisição

  // Validação simples para garantir que os dados necessários foram enviados
  if (!description || !amount || !type || !date) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios." });
  }

  try {
    const result = await pool.query(
      `UPDATE transactions 
       SET description = $1, amount = $2, type = $3, date = $4 
       WHERE id = $5 AND user_id = $6 
       RETURNING *`,
      [description, amount, type, date, id, userId]
    );

    // A cláusula "AND user_id = $6" é uma camada CRUCIAL de segurança.
    // Ela garante que um usuário só pode editar uma transação que lhe pertence.

    // Se a consulta não afetou nenhuma linha, significa que a transação não existe ou não pertence ao usuário
    if (result.rowCount === 0) {
      return res.status(404).json({
        message:
          "Transação não encontrada ou você não tem permissão para editá-la.",
      });
    }

    // Retorna a transação atualizada
    res.json(result.rows[0]);
  } catch (error) {
    console.error("ERRO AO ATUALIZAR TRANSAÇÃO:", error);
    res.status(500).json({ message: "Erro no servidor" });
  }
};
