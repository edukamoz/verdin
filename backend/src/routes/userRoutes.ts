import { Router } from "express";
import { registerUser, loginUser } from "../controllers/userController";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Autenticação e gerenciamento de usuários
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do usuário.
 *                 example: João da Silva
 *               email:
 *                 type: string
 *                 description: E-mail do usuário para login.
 *                 example: joao@exemplo.com
 *               password:
 *                 type: string
 *                 description: Senha do usuário.
 *                 example: senha123
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso.
 *       400:
 *         description: E-mail já cadastrado.
 */

router.post("/register", registerUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Realiza o login de um usuário e retorna um token JWT
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: joao@exemplo.com
 *               password:
 *                 type: string
 *                 example: senha123
 *     responses:
 *       200:
 *         description: Login bem-sucedido, token retornado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticação.
 *       400:
 *         description: Credenciais inválidas.
 */
router.post("/login", loginUser);

export default router;
