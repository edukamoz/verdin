import { Router } from "express";
import {
  getAllTransactions,
  createTransaction,
  deleteTransaction,
  updateTransaction, // 1. IMPORTAR A NOVA FUNÇÃO
} from "../controllers/transactionController";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Transactions
 *     description: Gerenciamento de transações financeiras
 */

router.use(protect);

router.route("/").get(getAllTransactions).post(createTransaction);

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
router
  .route("/:id")
  .put(updateTransaction) // 2. ADICIONAR O MÉTODO PUT
  .delete(deleteTransaction);

export default router;
