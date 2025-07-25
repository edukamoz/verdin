import { Router } from "express";
import {
  getAllTransactions,
  createTransaction,
  updateTransaction,
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
 *     summary: Retorna as transações do usuário, com filtros opcionais
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [receita, despesa]
 *         description: Filtra por tipo.
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtra por categorias (separadas por vírgula).
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de início (YYYY-MM-DD).
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de fim (YYYY-MM-DD).
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *         description: Busca por parte do texto na descrição.
 *       - in: query
 *         name: minValue
 *         schema:
 *           type: number
 *         description: Filtra por valor mínimo.
 *       - in: query
 *         name: maxValue
 *         schema:
 *           type: number
 *         description: Filtra por valor máximo.
 *     responses:
 *       200:
 *         description: Lista de transações (filtrada ou não).
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   user_id:
 *                     type: integer
 *                   description:
 *                     type: string
 *                   amount:
 *                     type: string
 *                   type:
 *                     type: string
 *                     enum: [receita, despesa]
 *                   date:
 *                     type: string
 *                     format: date
 *                   category:
 *                     type: string
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
 *   put:
 *     summary: Atualiza uma transação existente
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID da transação a ser atualizada.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [receita, despesa]
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Transação atualizada com sucesso.
 *       404:
 *         description: Transação não encontrada.
 *       401:
 *         description: Não autorizado.
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
 *       404:
 *         description: Transação não encontrada.
 */
router.route("/:id").delete(deleteTransaction).put(updateTransaction);

export default router;
