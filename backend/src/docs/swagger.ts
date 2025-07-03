// Conteúdo de backend/src/docs/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API do Verdin',
      version: '1.0.0',
      description: 'Documentação da API para o gestor financeiro Verdin',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts'], // Caminho para os arquivos com anotações da API
};

export const swaggerSpec = swaggerJsdoc(options);