import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Estende a interface Request do Express para incluir nossa propriedade 'user'
declare global {
  namespace Express {
    interface Request {
      user?: { id: number };
    }
  }
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { user: { id: number } };
      req.user = decoded.user;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Acesso não autorizado, token não encontrado.' });
  }
};