import { Router } from "express";
import {
  getAllTransactions,
  createTransaction,
  deleteTransaction,
} from "../controllers/transactionController";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Transactions
 *     description: Gerenciamento de transações financeiras
 */

// Aplica o middleware de proteção a todas as rotas deste arquivo
router.use(protect);

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Retorna todas as transações do usuário autenticado
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de transações.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   description:
 *                     type: string
 *                   amount:
 *                     type: number
 *                   type:
 *                     type: string
 *                     enum: [receita, despesa]
 *                   date:
 *                     type: string
 *                     format: date
 *       401:
 *         description: Não autorizado (token inválido ou ausente).
 */

router.route("/").get(getAllTransactions);

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Cria uma nova transação para o usuário autenticado
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - description
 *               - amount
 *               - type
 *               - date
 *             properties:
 *               description:
 *                 type: string
 *                 example: Salário
 *               amount:
 *                 type: number
 *                 example: 5000.00
 *               type:
 *                 type: string
 *                 enum: [receita, despesa]
 *                 example: receita
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-07-05"
 *     responses:
 *       201:
 *         description: Transação criada com sucesso.
 *       401:
 *         description: Não autorizado.
 */
router.post("/", createTransaction);

/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     summary: Deleta uma transação específica do usuário autenticado
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID da transação a ser deletada.
 *     responses:
 *       200:
 *         description: Transação deletada com sucesso.
 *       401:
 *         description: Não autorizado.
 *       404:
 *         description: Transação não encontrada.
 */

router.route("/:id").delete(deleteTransaction);

export default router;
