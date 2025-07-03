import { Request, Response } from "express";
import pool from "../config/db";

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
  const { description, amount, type, date } = req.body;
  try {
    const newTransaction = await pool.query(
      "INSERT INTO transactions (user_id, description, amount, type, date) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [req.user!.id, description, amount, type, date]
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
