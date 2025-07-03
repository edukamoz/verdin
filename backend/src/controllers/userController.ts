import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db";

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (userExists.rows.length > 0) {
      // CORREÇÃO AQUI: "return" removido
      res
        .status(400)
        .json({ message: "Usuário já cadastrado com este e-mail." });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]
    );
    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro no servidor" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (user.rows.length === 0) {
      // CORREÇÃO AQUI: "return" removido
      res.status(400).json({ message: "Credenciais inválidas." });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      // CORREÇÃO AQUI: "return" removido
      res.status(400).json({ message: "Credenciais inválidas." });
      return;
    }

    const payload = { user: { id: user.rows[0].id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro no servidor" });
  }
};
