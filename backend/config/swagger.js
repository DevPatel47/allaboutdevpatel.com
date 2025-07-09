import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
dotenv.config();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Portfolio API Docs',
      version: '1.0.0',
      description: 'API documentation for Dev Patel’s Portfolio Backend',
    },
    servers: [
      {
        url: process.env.SWAGGER_SERVER_URL || 'http://localhost:5000/api/v1',
        description: process.env.NODE_ENV === 'production' ? 'Production Server' : 'Local Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
