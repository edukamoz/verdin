import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger';

// Importa as rotas
import userRoutes from './routes/userRoutes';
import transactionRoutes from './routes/transactionRoutes';

const app = express();

app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);

// Rota da Documentação
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API do Verdin (TS) rodando na porta ${PORT}`);
  console.log(`Documentação disponível em http://localhost:${PORT}/api-docs`);
});